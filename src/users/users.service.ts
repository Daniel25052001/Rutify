import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }

    async createEmployee(dto: { email: string; name: string; role: Role; companyId?: string }, requesterRole: Role) {
        if (requesterRole !== Role.SUPER_ADMIN) {
            throw new ForbiddenException('Solo un Super Administrador puede registrar empleados directamente.');
        }

        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (existingUser) {
            throw new ConflictException('Ya existe un usuario registrado con este correo electrónico.');
        }

        const temporaryPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

        const newUser = await this.prisma.user.create({
            data: {
                email: dto.email,
                fullName: dto.name,
                password: hashedPassword,
                role: dto.role,
                companyId: dto.companyId || null,
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
                companyId: true,
                createdAt: true,
            },
        });

        return {
            user: newUser,
            temporaryPassword,
        };
    }

    async findAll(user: { role: Role; companyId?: string }) {
        const filter = user.role === Role.SUPER_ADMIN ? {} : { companyId: user.companyId };

        return this.prisma.user.findMany({
            where: filter,
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
                companyId: true,
                createdAt: true,
            },
        });
    }

    async updateRoleOrCompany(targetUserId: string, dto: { role?: Role; companyId?: string }) {
        const user = await this.prisma.user.findUnique({ where: { id: targetUserId } });

        if (!user) {
            throw new NotFoundException('Usuario no encontrado.');
        }

        return this.prisma.user.update({
            where: { id: targetUserId },
            data: {
                role: dto.role ?? user.role,
                companyId: dto.companyId !== undefined ? dto.companyId : user.companyId,
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
                companyId: true,
            },
        });
    }

    async removeEmployee(targetUserId: string) {
        const user = await this.prisma.user.findUnique({ where: { id: targetUserId } });

        if (!user) {
            throw new NotFoundException('Usuario no encontrado.');
        }

        return this.prisma.user.delete({
            where: { id: targetUserId },
        });
    }
}