import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import * as crypto from 'crypto';

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
            invitationToken: invitation.token, // Útil para pruebas locales o simulación de envío por correo
            expiresAt: invitation.expiresAt,
        };
    }
}