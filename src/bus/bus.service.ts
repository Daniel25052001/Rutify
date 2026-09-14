import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBusDto, UpdateBusDto } from './dto/bus-dto';
import { Role } from '@prisma/client';

@Injectable()
export class BusesService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createBusDto: CreateBusDto, user: { role: Role; companyId?: string }) {
        if (user.role === Role.COMPANY_ADMIN && !user.companyId) {
            throw new ForbiddenException('User is not bound to any company');
        }

        const companyIdToUse = user.role === Role.SUPER_ADMIN ? (createBusDto as any).companyId || user.companyId : user.companyId;

        if (!companyIdToUse) {
            throw new ForbiddenException('Company ID is required to create a bus');
        }

        return this.prisma.bus.create({
            data: {
                ...createBusDto,
                companyId: companyIdToUse,
            },
            include: { company: true },
        });
    }

    async findAll(user: { role: Role; companyId?: string }) {
        const filter = user.role === Role.SUPER_ADMIN ? {} : { companyId: user.companyId };

        return this.prisma.bus.findMany({
            where: filter,
            include: { company: true },
        });
    }

    async findOne(id: string, user: { role: Role; companyId?: string }) {
        const filter: any = { id };
        if (user.role !== Role.SUPER_ADMIN) {
            filter.companyId = user.companyId;
        }

        const bus = await this.prisma.bus.findFirst({
            where: filter,
            include: { company: true },
        });

        if (!bus) {
            throw new NotFoundException(`Bus with ID ${id} not found or access denied`);
        }

        return bus;
    }

    async update(id: string, updateBusDto: UpdateBusDto, user: { role: Role; companyId?: string }) {
        await this.findOne(id, user);

        return this.prisma.bus.update({
            where: { id },
            data: updateBusDto,
            include: { company: true },
        });
    }

    async remove(id: string, user: { role: Role; companyId?: string }) {
        await this.findOne(id, user);

        return this.prisma.bus.delete({
            where: { id },
        });
    }
}