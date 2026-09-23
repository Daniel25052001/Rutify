import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompanyService {
    constructor(private prisma: PrismaService) { }

    async create(createCompanyDto: CreateCompanyDto) {
        const existing = await this.prisma.company.findFirst({
            where: {
                OR: [
                    { nit: createCompanyDto.nit },
                    { name: createCompanyDto.name }
                ]
            }
        });

        if (existing) {
            throw new ConflictException('Ya existe una empresa registrada con este NIT o Nombre.');
        }

        return this.prisma.company.create({
            data: createCompanyDto,
        });
    }

    async findAll() {
        return this.prisma.company.findMany({
            include: {
                _count: {
                    select: { users: true, routes: true, buses: true }
                }
            }
        });
    }

    async findOne(id: string) {
        const company = await this.prisma.company.findUnique({
            where: { id },
            include: { users: true, buses: true, routes: true }
        });

        if (!company) {
            throw new NotFoundException(`Empresa con ID ${id} no encontrada.`);
        }

        return company;
    }

    async update(id: string, updateCompanyDto: UpdateCompanyDto) {
        await this.findOne(id);

        return this.prisma.company.update({
            where: { id },
            data: updateCompanyDto,
        });
    }

    async remove(id: string) {
        await this.findOne(id);

        // Soft delete: cambiamos el estado a inactivo para mantener la integridad referencial
        return this.prisma.company.update({
            where: { id },
            data: { isActive: false },
        });
    }
}