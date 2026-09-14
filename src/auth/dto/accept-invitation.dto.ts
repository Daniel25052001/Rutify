import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class AcceptInvitationDto {
    @ApiProperty({
        example: 'token-generado-por-el-admin-uuid',
        description: 'Token único recibido en el enlace de invitación',
    })
    @IsString()
    @IsNotEmpty({ message: 'El token de invitación es obligatorio' })
    token: string;

    @ApiProperty({
        example: 'SeguraPass123',
        description: 'Nueva contraseña con mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número',
        minLength: 8,
    })
    @IsString()
    @IsNotEmpty({ message: 'La contraseña es obligatoria' })
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    @Matches(/(?:(?=.*[a-z])(?=.*[A-Z])(?=.*\d))/, {
        message: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número',
    })
    password: string;

    @ApiProperty({
        example: 'Carlos Pérez',
        description: 'Nombre completo del empleado',
        minLength: 3,
    })
    @IsString()
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
    fullName: string;
}