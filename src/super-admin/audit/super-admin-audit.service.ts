import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class AuditService {
    constructor(private prisma: PrismaService) { }

    // Registrar una nueva acción en la bitácora de auditoría
    async logAction(action: string, target: string, details?: string, userId?: string) {
        return this.prisma.auditLog.create({
            data: {
                action,
                target,
                details,
                userId,
            },
        });
    }

    // Consultar todos los registros de auditoría globalmente
    async getAllLogs(action?: string) {
        return this.prisma.auditLog.findMany({
            where: {
                ...(action && { action }),
            },
            orderBy: { createdAt: 'desc' },
        });
    }
}