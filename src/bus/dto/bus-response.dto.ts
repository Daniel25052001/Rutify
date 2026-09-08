import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CompanySummaryDto {
    @ApiProperty({ example: 'b1c2d3e4-f5a6-7890-bcde-f12345678901', description: 'ID único de la empresa transportadora' })
    id: string;

    @ApiProperty({ example: 'Expreso Bolivariano S.A.', description: 'Razón social o nombre de la empresa' })
    name: string;

    @ApiProperty({ example: '900123456-7', description: 'NIT de la empresa' })
    nit: string;

    @ApiProperty({ example: '+573001234567', description: 'Teléfono de contacto' })
    phone: string;

    @ApiProperty({ example: '2026-09-01T12:00:00.000Z', description: 'Fecha de registro de la empresa' })
    createdAt: Date;

    @ApiProperty({ example: '2026-09-01T12:00:00.000Z', description: 'Fecha de última actualización' })
    updatedAt: Date;
}

export class BusResponseDto {
    @ApiProperty({ example: 'd1e2f3a4-b5c6-7890-abcd-ef0123456789', description: 'ID único del autobús' })
    id: string;

    @ApiProperty({ example: 'ABC1234', description: 'Placa del autobús' })
    plate: string;

    @ApiProperty({ example: 40, description: 'Capacidad de pasajeros' })
    capacity: number;

    @ApiProperty({ example: 'b1c2d3e4-f5a6-7890-bcde-f12345678901', description: 'ID de la compañía dueña del autobús' })
    companyId: string;

    @ApiProperty({ example: '2026-09-01T12:00:00.000Z', description: 'Fecha de creación' })
    createdAt: Date;

    @ApiProperty({ example: '2026-09-01T12:00:00.000Z', description: 'Fecha de última modificación' })
    updatedAt: Date;

    @ApiPropertyOptional({ type: () => CompanySummaryDto, description: 'Datos de la compañía propietaria' })
    company?: CompanySummaryDto;
}
