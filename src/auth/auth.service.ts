import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) { }

    /**
     * Procesa la aceptación de una invitación corporativa para registrar un nuevo empleado.
     * Utiliza una transacción atómica para asegurar que la creación del usuario y 
     * el bloqueo de la invitación ocurran de forma simultánea e indivisible.
     * 
     * @param dto Datos de la invitación que incluyen el token único, la contraseña y el nombre completo.
     */
    async acceptInvitation(dto: AcceptInvitationDto) {
        // 1. Validar la existencia de la invitación en el sistema
        const invitation = await this.prisma.invitation.findUnique({
            where: { token: dto.token },
            include: { company: true },
        });

        if (!invitation) {
            throw new NotFoundException('Token de invitación inválido o no existe.');
        }

        // 2. Validar que la invitación no haya sido utilizada previamente
        if (invitation.acceptedAt) {
            throw new BadRequestException('Esta invitación ya ha sido utilizada.');
        }

        // 3. Validar que la invitación no haya expirado respecto a la fecha actual
        if (new Date() > invitation.expiresAt) {
            throw new BadRequestException('La invitación ha expirado.');
        }

        // 4. Asegurar que no exista un usuario registrado previamente con este correo electrónico
        const userExists = await this.prisma.user.findUnique({
            where: { email: invitation.email },
        });

        if (userExists) {
            throw new BadRequestException('Ya existe un usuario registrado con este correo.');
        }

        // 5. Generar un hash seguro de la contraseña mediante bcrypt (10 rondas de salt)
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        // 6. Transacción atómica: Crear el usuario vinculado al tenant y actualizar el estado de la invitación
        const [user] = await this.prisma.$transaction([
            this.prisma.user.create({
                data: {
                    email: invitation.email,
                    password: hashedPassword,
                    fullName: dto.fullName,
                    role: invitation.role,
                    companyId: invitation.companyId,
                },
            }),
            this.prisma.invitation.update({
                where: { id: invitation.id },
                data: { acceptedAt: new Date() },
            }),
        ]);

        // 7. Generar el token JWT de sesión para el usuario recién activado
        const token = this.generateToken(user.id, user.email, user.role, user.companyId);

        return {
            message: 'Cuenta activada e iniciada exitosamente.',
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                companyId: user.companyId
            },
            accessToken: token,
        };
    }

    /**
     * Gestiona el inicio de sesión para cualquier rol del sistema (Super Admin y Empleados).
     * 
     * @param dto Credenciales de acceso (correo electrónico y contraseña).
     */
    async login(dto: LoginDto) {
        // 1. Buscar al usuario por su correo electrónico único
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas.');
        }

        // 2. Comparar la contraseña ingresada con el hash seguro almacenado
        const isPasswordValid = await bcrypt.compare(dto.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciales inválidas.');
        }

        // 3. Generar el token JWT firmado con los datos de identidad, rol y compañía
        const token = this.generateToken(user.id, user.email, user.role, user.companyId);

        return {
            message: 'Inicio de sesión exitoso.',
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                companyId: user.companyId
            },
            accessToken: token,
        };
    }

    /**
     * Método auxiliar privado para construir y firmar el JSON Web Token (JWT).
     * 
     * @param userId Identificador único del usuario.
     * @param email Correo electrónico.
     * @param role Rol asignado (ej. SUPER_ADMIN, EMPLOYEE).
     * @param companyId Identificador del tenant/compañía asociado.
     */
    private generateToken(userId: string, email: string, role: string, companyId: string | null) {
        const payload = { sub: userId, email, role, companyId };
        return this.jwtService.sign(payload);
    }
}