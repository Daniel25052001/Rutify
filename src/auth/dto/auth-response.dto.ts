import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UserProfileResponseDto {
    @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', description: 'Identificador único del usuario (UUID)' })
    id: string;

    @ApiProperty({ example: 'juan.perez@ejemplo.com', description: 'Correo electrónico del usuario' })
    email: string;

    @ApiProperty({ example: 'Juan Pérez García', description: 'Nombre completo del usuario' })
    fullName: string;

    @ApiProperty({ enum: Role, enumName: 'Role', example: Role.PASSENGER, description: 'Rol asignado al usuario en el sistema' })
    role: Role;

    @ApiProperty({ example: 'c0a80101-1234-5678-90ab-cdef12345678', description: 'ID de la compañía a la que pertenece (si aplica)', required: false, nullable: true })
    companyId?: string | null;

    @ApiProperty({ example: '2026-09-01T12:00:00.000Z', description: 'Fecha y hora de creación de la cuenta' })
    createdAt: Date;

    @ApiProperty({ example: '2026-09-01T12:00:00.000Z', description: 'Fecha y hora de última actualización' })
    updatedAt: Date;
}

export class AuthUserSummaryDto {
    @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', description: 'ID del usuario' })
    id: string;

    @ApiProperty({ example: 'juan.perez@ejemplo.com', description: 'Correo electrónico del usuario' })
    email: string;

    @ApiProperty({ example: 'Juan Pérez García', description: 'Nombre completo' })
    fullName: string;

    @ApiProperty({ enum: Role, enumName: 'Role', example: Role.PASSENGER, description: 'Rol del usuario' })
    role: Role;
}

export class AuthResponseDto {
    @ApiProperty({ example: 'Usuario registrado exitosamente', description: 'Mensaje informativo del resultado' })
    message: string;

    @ApiProperty({ type: () => AuthUserSummaryDto, description: 'Datos del usuario autenticado' })
    user: AuthUserSummaryDto;

    @ApiProperty({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        description: 'Token JWT de acceso para autenticación en cabecera Authorization: Bearer <token>',
    })
    accessToken: string;
}

export class UserIdResponseDto {
    @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', description: 'ID único del usuario autenticado extraído del token' })
    userId: string;
}

export class AdminOnlyResponseDto {
    @ApiProperty({ example: 'Bienvenido al panel de administración', description: 'Mensaje de bienvenida al área administrativa' })
    message: string;

    @ApiProperty({ example: 'Administrador General', description: 'Nombre del administrador en sesión' })
    adminName: string;
}
