import { IsString, IsInt, Min, Max, IsNotEmpty, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types'; //toma las propiedas de un DTO y las deja como opcionales para dar de alta al registro de los vehiculos

export class CreateBusDto {
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => typeof value === 'string' ? value.trim().toUpperCase() : value)
    plate: string;

    @IsInt()
    @Min(1)
    @Max(100)
    capacity: number;

    @IsUUID()
    @IsNotEmpty()
    companyId: string;
}
export class UpdateBusDto extends PartialType(CreateBusDto) { }