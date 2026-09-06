import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TicketStatus } from '@prisma/client';
import { TripResponseDto } from '../../trip/dto/trip-response.dto';
import { AuthUserSummaryDto } from '../../auth/dto/auth-response.dto';

export class TicketResponseDto {
    @ApiProperty({ example: '7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d', description: 'ID único del boleto (UUID)' })
    id: string;

    @ApiProperty({ example: 12, description: 'Número de asiento asignado' })
    seatNumber: number;

    @ApiProperty({
        enum: TicketStatus,
        enumName: 'TicketStatus',
        example: TicketStatus.RESERVED,
        description: 'Estado actual del boleto',
    })
    status: TicketStatus;

    @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', description: 'ID del usuario pasajero' })
    userId: string;

    @ApiProperty({ example: 'e3f4a5b6-c7d8-90ab-cdef-123456789012', description: 'ID del viaje reservado' })
    tripId: string;

    @ApiProperty({ example: '2026-09-01T12:00:00.000Z', description: 'Fecha y hora de creación de la reserva' })
    createdAt: Date;

    @ApiProperty({ example: '2026-09-01T12:00:00.000Z', description: 'Fecha y hora de última modificación' })
    updatedAt: Date;

    @ApiPropertyOptional({ type: () => TripResponseDto, description: 'Detalle del viaje, autobús y ruta' })
    trip?: TripResponseDto;

    @ApiPropertyOptional({ type: () => AuthUserSummaryDto, description: 'Información básica del usuario' })
    user?: AuthUserSummaryDto;
}
