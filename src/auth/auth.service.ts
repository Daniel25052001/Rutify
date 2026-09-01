import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) { }

    async register(dto: RegisterDto) {
        const userExists = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (userExists) {
            throw new BadRequestException('El correo ya está registrado');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                fullName: dto.fullName,
            },
        });

        const token = this.generateToken(user.id, user.email, user.role);

        return {
            message: 'Usuario registrado exitosamente',
            user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
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

        const token = this.generateToken(user.id, user.email, user.role);

        return {
            message: 'Inicio de sesión exitoso',
            user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
            accessToken: token,
        };
    }

    private generateToken(userId: string, email: string, role: string) {
        const payload = { sub: userId, email, role };
        return this.jwtService.sign(payload);
    }
}