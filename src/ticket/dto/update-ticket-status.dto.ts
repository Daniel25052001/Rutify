import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { TicketStatus } from '@prisma/client';

export class UpdateTicketStatusDto {
    @ApiProperty({
        enum: TicketStatus,
        enumName: 'TicketStatus',
        example: TicketStatus.PAID,
        description: 'Nuevo estado del boleto (RESERVED, PAID, CANCELLED)',
    })
    @IsNotEmpty()
    @IsEnum(TicketStatus)
    status: TicketStatus;
}