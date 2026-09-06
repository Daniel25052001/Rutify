import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTripDto } from './dto/create-trip.dto';

@Injectable()
export class TripsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createTripDto: CreateTripDto, companyId: string) {
        const bus = await this.prisma.bus.findUnique({
            where: { id: createTripDto.busId },
        });

        if (!bus || bus.companyId !== companyId) {
            throw new ForbiddenException('El autobús no pertenece a tu compañía o no existe');
        }

        const route = await this.prisma.route.findUnique({
            where: { id: createTripDto.routeId },
        });

        if (!route || route.companyId !== companyId) {
            throw new ForbiddenException('La ruta no pertenece a tu compañía o no existe');
        }

        return this.prisma.trip.create({
            data: {
                departureTime: new Date(createTripDto.departureTime),
                availableSeats: createTripDto.availableSeats,
                busId: createTripDto.busId,
                routeId: createTripDto.routeId,
            },
            include: {
                bus: true,
                route: true,
            },
        });
    }

    async findAllByCompany(companyId: string) {
        return this.prisma.trip.findMany({
            where: {
                bus: {
                    companyId: companyId,
                },
            },
            include: {
                bus: true,
                route: true,
            },
        });
    }
}