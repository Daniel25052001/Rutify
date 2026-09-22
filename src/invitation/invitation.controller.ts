import { Controller, Post, Get, Delete, Param, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Invitations')
@Controller('invitations')
@UseGuards(JwtAuthGuard, RolesGuard) // Protegido por JWT y control de roles
@ApiBearerAuth('JWT-auth')
export class InvitationController {
    constructor(private readonly invitationService: InvitationService) { }

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

    @Get()
    @Roles(Role.SUPER_ADMIN, Role.COMPANY_ADMIN)
    @ApiOperation({
        summary: 'Listar todas las invitaciones',
        description: 'Retorna el historial completo de invitaciones emitidas en la plataforma.',
    })
    @ApiResponse({ status: 200, description: 'Lista de invitaciones obtenida exitosamente.' })
    @HttpCode(HttpStatus.OK)
    async findAll() {
        return await this.invitationService.findAllInvitations();
    }

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