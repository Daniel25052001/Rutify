import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SuperAdminFleetService {
    constructor(private prisma: PrismaService) { }

    // Obtener todos los buses del sistema con datos de su empresa
    async getAllBuses(companyId?: string) {
        return this.prisma.bus.findMany({
            where: {
                ...(companyId && { companyId }),
            },
            include: {
                company: {
                    select: { id: true, name: true, nit: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    // Obtener todas las rutas del sistema con datos de su empresa
    async getAllRoutes(companyId?: string) {
        return this.prisma.route.findMany({
            where: {
                ...(companyId && { companyId }),
            },
            include: {
                company: {
                    select: { id: true, name: true, nit: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
}