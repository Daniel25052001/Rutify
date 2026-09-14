import { IsEmail, IsNotEmpty, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class CreateEmployeeDto {
    @ApiProperty({ example: 'empleado@rutify.com' })
    @IsEmail({}, { message: 'El correo electrónico no es válido.' })
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'Carlos Pérez' })
    @IsNotEmpty()
    name: string;

    @ApiProperty({ enum: Role, example: Role.COMPANY_ADMIN })
    @IsEnum(Role, { message: 'Rol inválido.' })
    role: Role;

    @ApiPropertyOptional({ example: 'uuid-de-la-empresa' })
    @IsOptional()
    @IsUUID('4', { message: 'El ID de la empresa debe ser un UUID válido.' })
    companyId?: string;
}