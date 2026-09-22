import { IsEmail, IsEnum, IsUUID } from 'class-validator';
import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInvitationDto {
    @ApiProperty({
        example: 'empleado@transportes.com',
        description: 'Correo electrónico del usuario al que se le enviará la invitación',
    })
    @IsEmail({}, { message: 'El correo electrónico no es válido.' })
    email: string;

    @ApiProperty({
        example: 'DRIVER',
        description: 'Rol que se le asignará al usuario una vez acepte la invitación',
        enum: Role,
    })
    @IsEnum(Role, { message: 'El rol especificado no es válido dentro del sistema.' })
    role: Role;

    @ApiProperty({
        example: 'uuid-de-la-compania',
        description: 'ID de la compañía (tenant) a la cual pertenecerá el usuario',
    })
    @IsUUID('4', { message: 'El ID de la compañía debe ser un UUID válido.' })
    companyId: string;
}