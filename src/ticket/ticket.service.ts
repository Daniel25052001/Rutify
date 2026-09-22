import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketStatus, Role } from '@prisma/client';

@Injectable()
export class TicketsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createTicketDto: CreateTicketDto, userId: string) {
        const { tripId, seatNumber } = createTicketDto;

        return this.prisma.$transaction(async (tx) => {
            // 1. Buscar el viaje y bloquear/verificar disponibilidad
            const trip = await tx.trip.findUnique({
                where: { id: tripId },
                include: { bus: true },
            });

            if (!trip) {
                throw new NotFoundException('El viaje especificado no existe.');
            }

            if (trip.availableSeats <= 0) {
                throw new ConflictException('No hay asientos disponibles en este viaje.');
            }

            // 2. Validar si el asiento específico ya está ocupado (si manejas número de asiento)
            if (seatNumber) {
                const existingTicket = await tx.ticket.findFirst({
                    where: {
                        tripId,
                        seatNumber,
                        status: { not: TicketStatus.CANCELLED },
                    },
                });

                if (existingTicket) {
                    throw new ConflictException(`El asiento número ${seatNumber} ya ha sido reservado.`);
                }
            }

            // 3. Crear el tiquete
            const ticket = await tx.ticket.create({
                data: {
                    tripId,
                    userId,
                    seatNumber,
                    status: TicketStatus.RESERVED,
                },
                include: {
                    trip: {
                        include: { route: true, bus: true },
                    },
                },
            });

            // 4. Decrementar el cupo disponible en el viaje de forma atómica
            await tx.trip.update({
                where: { id: tripId },
                data: {
                    availableSeats: {
                        decrement: 1,
                    },
                },
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
                        bus: true,
                        route: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async cancel(ticketId: string, userId: string, userRole: Role) {
        return this.prisma.$transaction(async (tx) => {
            const ticket = await tx.ticket.findUnique({
                where: { id: ticketId },
                include: { trip: true },
            });

            if (!ticket) {
                throw new NotFoundException('El boleto no existe.');
            }

            if (userRole !== Role.SUPER_ADMIN && ticket.userId !== userId) {
                throw new ForbiddenException('No tienes permisos para cancelar este boleto.');
            }

            if (ticket.status === TicketStatus.CANCELLED) {
                throw new ConflictException('El boleto ya se encuentra cancelado.');
            }

            // Actualizar estado del tiquete
            const updatedTicket = await tx.ticket.update({
                where: { id: ticketId },
                data: { status: TicketStatus.CANCELLED },
            });

            // Retornar el asiento al viaje
            await tx.trip.update({
                where: { id: ticket.tripId },
                data: {
                    availableSeats: {
                        increment: 1,
                    },
                },
            });

            return updatedTicket;
        });
    }
}