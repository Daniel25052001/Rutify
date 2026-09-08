import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BusResponseDto } from '../../bus/dto/bus-response.dto';
import { RouteResponseDto } from '../../routes/dto/route-response.dto';

export class TripResponseDto {
    @ApiProperty({ example: 'e3f4a5b6-c7d8-90ab-cdef-123456789012', description: 'ID único del viaje (UUID)' })
    id: string;

    @ApiProperty({ example: '2026-09-10T08:00:00.000Z', description: 'Fecha y hora programada de salida' })
    departureTime: Date;

    @ApiProperty({ example: 38, description: 'Número de asientos disponibles restantes' })
    availableSeats: number;

    @ApiProperty({ example: 'd1e2f3a4-b5c6-7890-abcd-ef0123456789', description: 'ID del autobús asignado' })
    busId: string;

    @ApiProperty({ example: 'f1e2d3c4-b5a6-7890-abcd-1234567890ab', description: 'ID de la ruta asociada' })
    routeId: string;

    @ApiProperty({ example: '2026-09-01T12:00:00.000Z', description: 'Fecha de creación del viaje' })
    createdAt: Date;

    @ApiProperty({ example: '2026-09-01T12:00:00.000Z', description: 'Fecha de última actualización' })
    updatedAt: Date;

    @ApiPropertyOptional({ type: () => BusResponseDto, description: 'Detalle del autobús asignado al viaje' })
    bus?: BusResponseDto;

    @ApiPropertyOptional({ type: () => RouteResponseDto, description: 'Detalle de la ruta del viaje' })
    route?: RouteResponseDto;
}
