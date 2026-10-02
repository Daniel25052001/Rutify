import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class SuperAdminUsersService {
    constructor(private prisma: PrismaService) { }

    // Listar todos los usuarios a nivel global con opción de filtrar por empresa o rol
    async findAll(companyId?: string, role?: Role) {
        return this.prisma.user.findMany({
            where: {
                ...(companyId && { companyId }),
                ...(role && { role }),
            },
            include: {
                company: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    // Actualizar el rol o la compañía de un usuario de forma global
    async updateRoleOrCompany(targetUserId: string, dto: { role?: Role; companyId?: string }) {
        const user = await this.prisma.user.findUnique({ where: { id: targetUserId } });

        if (!user) {
            throw new NotFoundException('Usuario no encontrado.');
        }

        // Si se envía un companyId, verificar que la empresa exista
        if (dto.companyId) {
            const companyExists = await this.prisma.company.findUnique({
                where: { id: dto.companyId },
            });
            if (!companyExists) {
                throw new NotFoundException('La empresa especificada no existe.');
            }
        }

        return this.prisma.user.update({
            where: { id: targetUserId },
            data: {
                role: dto.role ?? user.role,
                companyId: dto.companyId !== undefined ? dto.companyId : user.companyId,
            },
            include: { company: true },
        });
    }
}