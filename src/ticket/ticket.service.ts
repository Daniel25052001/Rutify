import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketStatus } from '@prisma/client';

@Injectable()
export class TicketsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createTicketDto: CreateTicketDto, userId: string) {
        const trip = await this.prisma.trip.findUnique({
            where: { id: createTicketDto.tripId },
        });

        if (!trip) {
            throw new NotFoundException('El viaje especificado no existe');
        }

        if (trip.availableSeats <= 0) {
            throw new ConflictException('No hay asientos disponibles para este viaje');
        }

        return this.prisma.$transaction(async (tx) => {
            const ticket = await tx.ticket.create({
                data: {
                    seatNumber: createTicketDto.seatNumber,
                    tripId: createTicketDto.tripId,
                    userId: userId,
                    status: TicketStatus.RESERVED,
                },
            });

            await tx.trip.update({
                where: { id: createTicketDto.tripId },
                data: { availableSeats: trip.availableSeats - 1 },
            });

            return ticket;
        });
    }

    async findAllByUser(userId: string) {
        return this.prisma.ticket.findMany({
            where: { userId },
            include: {
                trip: {
                    include: {
                        route: true,
                        bus: true,
                    },
                },
            },
        });
    }

    async cancel(ticketId: string, userId: string, userRole: string) {
        const ticket = await this.prisma.ticket.findUnique({
            where: { id: ticketId },
            include: { trip: true },
        });

        if (!ticket) {
            throw new NotFoundException('El boleto no existe');
        }

        if (ticket.userId !== userId && userRole !== 'ADMIN' && userRole !== 'COMPANY_ADMIN') {
            throw new ForbiddenException('No tienes permisos para cancelar este boleto');
        }

        if (ticket.status === TicketStatus.CANCELLED) {
            throw new ConflictException('El boleto ya se encuentra cancelado');
        }

        return this.prisma.$transaction(async (tx) => {
            const updatedTicket = await tx.ticket.update({
                where: { id: ticketId },
                data: { status: TicketStatus.CANCELLED },
            });

            await tx.trip.update({
                where: { id: ticket.tripId },
                data: { availableSeats: ticket.trip.availableSeats + 1 },
            });

            return updatedTicket;
        });
    }

    async updateStatus(ticketId: string, status: TicketStatus, userId: string, userRole: string) {
        const ticket = await this.prisma.ticket.findUnique({
            where: { id: ticketId },
        });

        if (!ticket) {
            throw new NotFoundException('El boleto no existe');
        }

        if (ticket.userId !== userId && userRole !== 'ADMIN' && userRole !== 'COMPANY_ADMIN') {
            throw new ForbiddenException('No tienes permisos para modificar este boleto');
        }

        return this.prisma.ticket.update({
            where: { id: ticketId },
            data: { status },
        });
    }






    async findAllByTrip(tripId: string, companyId: string, userRole: string) {
        const trip = await this.prisma.trip.findUnique({
            where: { id: tripId },
            include: { bus: true },
        });

        if (!trip) {
            throw new NotFoundException('El viaje no existe');
        }

        if (userRole === 'COMPANY_ADMIN' && trip.bus.companyId !== companyId) {
            throw new ForbiddenException('No tienes acceso a los tiquetes de este viaje');
        }

        return this.prisma.ticket.findMany({
            where: { tripId },
            include: {
                user: {
                    select: { id: true, email: true },
                },
            },
        });
    }
}