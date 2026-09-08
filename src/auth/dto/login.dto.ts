import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
    @ApiProperty({
        example: 'usuario@ejemplo.com',
        description: 'Correo electrónico registrado del usuario',
    })
    @IsEmail({}, { message: 'El correo electrónico no es válido' })
    @IsNotEmpty({ message: 'El correo es obligatorio' })
    email: string;

    @ApiProperty({
        example: 'Password123*',
        description: 'Contraseña de acceso del usuario',
    })
    @IsString()
    @IsNotEmpty({ message: 'La contraseña es obligatoria' })
    password: string;
}