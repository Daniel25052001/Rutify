import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min, IsOptional } from 'class-validator';

export class CreateRouteDto {
    @ApiProperty({
        example: 'Medellín',
        description: 'Ciudad, municipio o terminal de origen de la ruta',
    })
    @IsNotEmpty()
    @IsString()
    origin: string;

    @ApiProperty({
        example: 'Bogotá',
        description: 'Ciudad, municipio o terminal de destino de la ruta',
    })
    @IsNotEmpty()
    @IsString()
    destination: string;

    @ApiProperty({
        example: 75000.00,
        description: 'Tarifa del pasaje para el trayecto (en pesos/moneda local, mayor o igual a 0)',
        minimum: 0,
    })
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    price: number;

    @ApiPropertyOptional({
        example: 'b1c2d3e4-f5a6-7890-bcde-f12345678901',
        description: 'ID de la compañía (opcional, requerido solo si un Super ADMIN crea la ruta para otra compañía)',
    })
    @IsOptional()
    @IsString()
    companyId?: string;
}

export class UpdateRouteDto extends PartialType(CreateRouteDto) { }