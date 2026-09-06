import { IsString, IsNotEmpty, IsInt, IsPositive, IsUppercase, Length, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateBusDto {
    @ApiProperty({
        example: 'ABC1234',
        description: 'Placa única del autobús en mayúsculas (de 3 a 10 caracteres)',
        minLength: 3,
        maxLength: 10,
    })
    @IsString()
    @IsNotEmpty()
    @IsUppercase()
    @Length(3, 10)
    plate: string;

    @ApiProperty({
        example: 40,
        description: 'Capacidad total de pasajeros del autobús (número entero positivo)',
        minimum: 1,
    })
    @IsInt()
    @IsPositive()
    capacity: number;

    @ApiPropertyOptional({
        example: 'b1c2d3e4-f5a6-7890-bcde-f12345678901',
        description: 'ID de la compañía (opcional, requerido solo si un Super ADMIN registra el bus para otra compañía)',
    })
    @IsOptional()
    @IsString()
    companyId?: string;
}

export class UpdateBusDto extends PartialType(CreateBusDto) { }