import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRouteDto, UpdateRouteDto } from './dto/route.dto';
import { Role } from '@prisma/client';

@Injectable()
export class RoutesService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createRouteDto: CreateRouteDto, user: { role: Role; companyId?: string }) {
        // Si es un ADMIN global, se le exige que tenga una compañía asignada o manejamos su lógica. 
        // Para un COMPANY_ADMIN, inyectamos obligatoriamente su companyId del token.
        if (user.role === Role.COMPANY_ADMIN && !user.companyId) {
            throw new ForbiddenException('User is not bound to any company');
        }

        const companyIdToUse = user.role === Role.ADMIN ? (createRouteDto as any).companyId || user.companyId : user.companyId;

        if (!companyIdToUse) {
            throw new ForbiddenException('Company ID is required to create a route');
        }

        return this.prisma.route.create({
            data: {
                ...createRouteDto,
                companyId: companyIdToUse,
            },
            include: { company: true },
        });
    }

    async findAll(user: { role: Role; companyId?: string }) {
        const filter = user.role === Role.ADMIN ? {} : { companyId: user.companyId };

        return this.prisma.route.findMany({
            where: filter,
            include: { company: true },
        });
    }

    async findOne(id: string, user: { role: Role; companyId?: string }) {
        const filter: any = { id };
        if (user.role !== Role.ADMIN) {
            filter.companyId = user.companyId;
        }

        const route = await this.prisma.route.findFirst({
            where: filter,
            include: { company: true },
        });

        if (!route) {
            throw new NotFoundException(`Route with ID ${id} not found or access denied`);
        }

        return route;
    }

    async update(id: string, updateRouteDto: UpdateRouteDto, user: { role: Role; companyId?: string }) {
        // Aseguramos que la ruta exista y pertenezca a la compañía del usuario antes de actualizar
        await this.findOne(id, user);

        return this.prisma.route.update({
            where: { id },
            data: updateRouteDto,
            include: { company: true },
        });
    }

    async remove(id: string, user: { role: Role; companyId?: string }) {
        // Aseguramos que pertenezca a su compañía antes de borrar
        await this.findOne(id, user);

        return this.prisma.route.delete({
            where: { id },
        });
    }
}