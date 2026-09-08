import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CompanySummaryDto } from '../../bus/dto/bus-response.dto';

export class RouteResponseDto {
    @ApiProperty({ example: 'f1e2d3c4-b5a6-7890-abcd-1234567890ab', description: 'ID único de la ruta (UUID)' })
    id: string;

    @ApiProperty({ example: 'Medellín', description: 'Origen de la ruta' })
    origin: string;

    @ApiProperty({ example: 'Bogotá', description: 'Destino de la ruta' })
    destination: string;

    @ApiProperty({ example: 75000.00, description: 'Tarifa del trayecto' })
    price: number | string;

    @ApiProperty({ example: 'b1c2d3e4-f5a6-7890-bcde-f12345678901', description: 'ID de la compañía dueña de la ruta' })
    companyId: string;

    @ApiProperty({ example: '2026-09-01T12:00:00.000Z', description: 'Fecha de creación de la ruta' })
    createdAt: Date;

    @ApiProperty({ example: '2026-09-01T12:00:00.000Z', description: 'Fecha de última modificación' })
    updatedAt: Date;

    @ApiPropertyOptional({ type: () => CompanySummaryDto, description: 'Datos de la empresa transportadora' })
    company?: CompanySummaryDto;
}
