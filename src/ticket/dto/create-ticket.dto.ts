import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, Min } from 'class-validator';

export class CreateTicketDto {
    @ApiProperty({
        example: 12,
        description: 'Número de asiento a reservar dentro del autobús (entero positivo mayor o igual a 1)',
        minimum: 1,
    })
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    seatNumber: number;

    @ApiProperty({
        example: 'e3f4a5b6-c7d8-90ab-cdef-123456789012',
        description: 'ID único del viaje para el cual se realiza la reserva (UUID)',
    })
    @IsNotEmpty()
    @IsString()
    tripId: string;
}