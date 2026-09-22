import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * AcceptInvitationDto: Define y valida los datos enviados por el usuario
 * al momento de aceptar una invitación corporativa y registrar su cuenta.
 */
export class AcceptInvitationDto {
    @ApiProperty({
        description: 'Nombre completo del nuevo usuario',
        example: 'Carlos Andrés Pérez'
    })
    @IsString()
    @IsNotEmpty({ message: 'El nombre es obligatorio.' })
    name: string;

    @ApiProperty({
        description: 'Contraseña segura para la nueva cuenta',
        example: 'Password123*'
    })
    @IsString()
    @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
    password: string;
}