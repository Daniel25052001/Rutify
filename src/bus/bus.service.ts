import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Ajusta la ruta según tu estructura
import { CreateBusDto, UpdateBusDto } from './dto/bus-dto';

@Injectable()
export class BusService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createBusDto: CreateBusDto) {
        // 1. Verificar si la compañía existe
        const company = await this.prisma.company.findUnique({
            where: { id: createBusDto.companyId },
        });

        if (!company) {
            throw new NotFoundException(`Company with ID ${createBusDto.companyId} not found`);
        }

        // 2. Verificar si la placa ya está registrada
        const existingBus = await this.prisma.bus.findUnique({
            where: { plate: createBusDto.plate },
        });

        if (existingBus) {
            throw new ConflictException(`Bus with plate ${createBusDto.plate} already exists`);
        }

        // 3. Crear el bus
        return this.prisma.bus.create({
            data: createBusDto,
            include: { company: true },
        });
    }

    async findAll() {
        return this.prisma.bus.findMany({
            include: { company: true },
        });
    }

    async findOne(id: string) {
        const bus = await this.prisma.bus.findUnique({
            where: { id },
            include: { company: true },
        });

        if (!bus) {
            throw new NotFoundException(`Bus with ID ${id} not found`);
        }

        return bus;
    }

    async update(id: string, updateBusDto: UpdateBusDto) {
        await this.findOne(id); // Valida que exista

        if (updateBusDto.plate) {
            const existingBus = await this.prisma.bus.findUnique({
                where: { plate: updateBusDto.plate },
            });
            if (existingBus && existingBus.id !== id) {
                throw new ConflictException(`Bus with plate ${updateBusDto.plate} already exists`);
            }
        }

        return this.prisma.bus.update({
            where: { id },
            data: updateBusDto,
            include: { company: true },
        });
    }

    async remove(id: string) {
        await this.findOne(id); // Valida que exista
        return this.prisma.bus.delete({
            where: { id },
        });
    }
}