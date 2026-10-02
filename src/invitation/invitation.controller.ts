import { Controller, Post, Get, Delete, Param, Body, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('Invitations')
@Controller('invitations')
@UseGuards(JwtAuthGuard, RolesGuard) // Protegido por JWT y control de roles
@ApiBearerAuth('JWT-auth')
export class InvitationController {
    constructor(private readonly invitationService: InvitationService) { }

    /**
     * Crea una nueva invitación corporativa vinculada a una compañía y un rol específico.
     * 
     * @param dto - Objeto de transferencia de datos con el correo, rol y ID de la compañía.
     * @returns Los detalles de la invitación generada y su token único.
     */
    @Post()
    @Roles(Role.SUPER_ADMIN, Role.COMPANY_ADMIN) // Restringido exclusivamente a administradores
    @ApiOperation({
        summary: 'Crear invitación para un nuevo usuario',
        description: 'Genera un token de invitación único vinculado a una compañía y un rol específico.',
    })
    @ApiResponse({ status: 201, description: 'Invitación generada exitosamente.' })
    @ApiResponse({ status: 400, description: 'Datos inválidos o el usuario ya existe.' })
    @ApiResponse({ status: 403, description: 'No tienes permisos suficientes.' })
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() dto: CreateInvitationDto) {
        return await this.invitationService.createInvitation(dto);
    }

    /**
     * Obtiene el listado paginado del historial de invitaciones emitidas en la plataforma.
     * 
     * @param page - Número de la página solicitada (por defecto 1).
     * @param limit - Cantidad máxima de registros por página (por defecto 10).
     * @returns Un objeto estructurado con la data paginada y los metadatos de control.
     */
    @Get()
    @Roles(Role.SUPER_ADMIN, Role.COMPANY_ADMIN)
    @ApiOperation({
        summary: 'Listar invitaciones con paginación',
        description: 'Retorna el historial paginado de invitaciones emitidas en la plataforma.',
    })
    @ApiQuery({ name: 'page', required: false, description: 'Número de página (por defecto 1)' })
    @ApiQuery({ name: 'limit', required: false, description: 'Cantidad de elementos por página (por defecto 10)' })
    @ApiResponse({ status: 200, description: 'Lista paginada de invitaciones obtenida exitosamente.' })
    @HttpCode(HttpStatus.OK)
    async findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        return await this.invitationService.findAllInvitations(page, limit);
    }

    /**
     * Revoca y elimina una invitación activa del sistema mediante su identificador único.
     * 
     * @param id - UUID único de la invitación a revocar.
     * @returns Mensaje de confirmación de revocación exitosa.
     */
    @Delete(':id')
    @Roles(Role.SUPER_ADMIN, Role.COMPANY_ADMIN)
    @ApiOperation({
        summary: 'Revocar una invitación',
        description: 'Elimina o invalida una invitación activa mediante su identificador único.',
    })
    @ApiResponse({ status: 200, description: 'Invitación revocada exitosamente.' })
    @ApiResponse({ status: 404, description: 'Invitación no encontrada.' })
    @HttpCode(HttpStatus.OK)
    async remove(@Param('id') id: string) {
        return await this.invitationService.revokeInvitation(id);
    }
}