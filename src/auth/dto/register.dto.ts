import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class RegisterDto {
    @ApiProperty({
        example: 'juan.perez@ejemplo.com',
        description: 'Correo electrónico válido y único del usuario',
    })
    @IsEmail({}, { message: 'El correo electrónico no es válido' })
    @IsNotEmpty({ message: 'El correo electrónico es requerido' })
    email: string;

    @ApiProperty({
        example: 'SeguraPass123',
        description: 'Contraseña con mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número',
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
        example: 'Juan Pérez García',
        description: 'Nombre completo del usuario',
        minLength: 3,
    })
    @IsString()
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
    fullName: string;
}
