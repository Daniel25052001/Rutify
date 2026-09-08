import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsDateString, Min } from 'class-validator';

export class CreateTripDto {
    @ApiProperty({
        example: '2026-09-10T08:00:00.000Z',
        description: 'Fecha y hora de salida del viaje en formato ISO 8601',
    })
    @IsNotEmpty()
    @IsDateString()
    departureTime: string;

    @ApiProperty({
        example: 40,
        description: 'Número inicial de asientos disponibles para reserva (entero mayor o igual a 1)',
        minimum: 1,
    })
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    availableSeats: number;

    @ApiProperty({
        example: 'd1e2f3a4-b5c6-7890-abcd-ef0123456789',
        description: 'ID único del autobús asignado para el viaje',
    })
    @IsNotEmpty()
    @IsString()
    busId: string;

    @ApiProperty({
        example: 'f1e2d3c4-b5a6-7890-abcd-1234567890ab',
        description: 'ID único de la ruta del viaje',
    })
    @IsNotEmpty()
    @IsString()
    routeId: string;
}