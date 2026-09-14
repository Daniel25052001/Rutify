import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { AcceptInvitationDto } from './dto/accept-invitation.dto'; // DTO que crearemos para aceptar invitación

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) { }

    // Nuevo flujo: Aceptar invitación en lugar de registro abierto
    async acceptInvitation(dto: AcceptInvitationDto) {
        const invitation = await this.prisma.invitation.findUnique({
            where: { token: dto.token },
            include: { company: true },
        });

        if (!invitation) {
            throw new NotFoundException('Token de invitación inválido o no existe');
        }

        if (invitation.acceptedAt) {
            throw new BadRequestException('Esta invitación ya ha sido utilizada');
        }

        if (new Date() > invitation.expiresAt) {
            throw new BadRequestException('La invitación ha expirado');
        }

        const userExists = await this.prisma.user.findUnique({
            where: { email: invitation.email },
        });

        if (userExists) {
            throw new BadRequestException('Ya existe un usuario registrado con este correo');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        // Crear el usuario asociado rígidamente a la compañía (Tenant) y rol de la invitación
        const user = await this.prisma.user.create({
            data: {
                email: invitation.email,
                password: hashedPassword,
                fullName: dto.fullName,
                role: invitation.role,
                companyId: invitation.companyId,
            },
        });

        // Marcar invitación como aceptada
        await this.prisma.invitation.update({
            where: { id: invitation.id },
            data: { acceptedAt: new Date() },
        });

        const token = this.generateToken(user.id, user.email, user.role, user.companyId);

        return {
            message: 'Cuenta activada e iniciada exitosamente',
            user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role, companyId: user.companyId },
            accessToken: token,
        };
    }

    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const token = this.generateToken(user.id, user.email, user.role, user.companyId);

        return {
            message: 'Inicio de sesión exitoso',
            user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role, companyId: user.companyId },
            accessToken: token,
        };
    }

    private generateToken(userId: string, email: string, role: string, companyId: string | null) {
        const payload = { sub: userId, email, role, companyId };
        return this.jwtService.sign(payload);
    }
}