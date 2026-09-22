import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class InvitationService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Genera una invitación corporativa segura con un token único y vigencia de 7 días.
     * 
     * @param dto Datos requeridos: correo, rol y ID de la compañía.
     */
    async createInvitation(dto: CreateInvitationDto) {
        // 1. Validar que la compañía (tenant) exista en la base de datos
        const companyExists = await this.prisma.company.findUnique({
            where: { id: dto.companyId },
        });

        if (!companyExists) {
            throw new NotFoundException('La compañía especificada no existe.');
        }

        // 2. Verificar que el correo no esté registrado activamente por otro usuario
        const userExists = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (userExists) {
            throw new BadRequestException('Ya existe un usuario registrado con este correo electrónico.');
        }

        // 3. Generar un token aleatorio criptográficamente seguro
        const token = crypto.randomBytes(32).toString('hex');

        // 4. Configurar la expiración de la invitación (7 días a partir del momento actual)
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        // 5. Guardar la invitación en la base de datos
        const invitation = await this.prisma.invitation.create({
            data: {
                email: dto.email,
                role: dto.role,
                companyId: dto.companyId,
                token,
                expiresAt,
            },
        });

        return {
            message: 'Invitación creada exitosamente.',
            invitationToken: invitation.token,
            expiresAt: invitation.expiresAt,
        };
    }

    /**
     * Obtiene el listado completo de invitaciones ordenadas por fecha de creación descendente.
     */
    async findAllInvitations() {
        return await this.prisma.invitation.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    /**
     * Revoca y elimina una invitación del sistema mediante su identificador único.
     * 
     * @param id - UUID de la invitación.
     */
    async revokeInvitation(id: string) {
        const invitation = await this.prisma.invitation.findUnique({ where: { id } });
        if (!invitation) {
            throw new NotFoundException('La invitación no existe.');
        }

        await this.prisma.invitation.delete({ where: { id } });
        return { message: 'Invitación revocada exitosamente.' };
    }

    /**
     * Procesa la aceptación de una invitación corporativa mediante un token único.
     * Valida su vigencia, crea el usuario con contraseña hasheada y marca la invitación como aceptada.
     * 
     * @param token - Token único de la invitación recibido por parámetro de URL.
     * @param dto - Contiene el nombre y la nueva contraseña del usuario.
     */
    async acceptInvitation(token: string, dto: AcceptInvitationDto) {
        // 1. Buscar la invitación asociada al token
        const invitation = await this.prisma.invitation.findUnique({
            where: { token },
        });

        if (!invitation) {
            throw new NotFoundException('El enlace de invitación es inválido o no existe.');
        }

        // 2. Validar si la invitación ya fue utilizada (verificando acceptedAt)
        if (invitation.acceptedAt) {
            throw new BadRequestException('Esta invitación ya ha sido utilizada anteriormente.');
        }

        // 3. Validar si la invitación ha expirado
        if (new Date() > new Date(invitation.expiresAt)) {
            throw new BadRequestException('El enlace de invitación ha expirado.');
        }

        // 4. Verificar que no exista un usuario registrado con ese correo
        const existingUser = await this.prisma.user.findUnique({
            where: { email: invitation.email },
        });

        if (existingUser) {
            throw new BadRequestException('Ya existe un usuario registrado con este correo electrónico.');
        }

        // 5. Hashear la contraseña de forma segura con bcrypt
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        // 6. Transacción para crear el usuario y actualizar el estado de la invitación
        const newUser = await this.prisma.$transaction(async (prisma) => {
            const user = await prisma.user.create({
                data: {
                    email: invitation.email,
                    fullName: dto.name,
                    password: hashedPassword,
                    role: invitation.role as any,
                    companyId: invitation.companyId,
                },
            });

            // Registrar la fecha de aceptación para invalidar futuras reutilizaciones del token
            await prisma.invitation.update({
                where: { id: invitation.id },
                data: { acceptedAt: new Date() },
            });

            return user;
        });

        return {
            message: '¡Cuenta creada y activada con éxito!',
            userId: newUser.id,
            email: newUser.email,
        };
    }
}