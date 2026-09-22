import { Controller, Post, Get, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TicketsService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { HttpErrorResponseDto } from '../common/dto/error-response.dto';

@ApiTags('Tickets')
@ApiBearerAuth('JWT-auth')
@Controller('tickets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) { }

    @Post()
    @Roles(Role.PASSENGER)
    @ApiOperation({
        summary: 'Reservar un tiquete/viaje',
        description: 'Permite a un pasajero reservar un asiento en un viaje específico, descontando cupos de forma atómica.',
    })
    @ApiResponse({ status: 201, description: 'Tiquete reservado exitosamente.' })
    @ApiResponse({ status: 409, description: 'No hay asientos disponibles o el asiento ya está ocupado.', type: HttpErrorResponseDto })
    create(@Body() createTicketDto: CreateTicketDto, @Req() req: any) {
        const userId = req.user.userId; // Asegúrate de que tu JWT guard inyecte userId o id según tu payload
        return this.ticketsService.create(createTicketDto, userId);
    }

    @Get('me')
    @Roles(Role.PASSENGER)
    @ApiOperation({
        summary: 'Listar mis tiquetes o viajes reservados',
        description: 'Retorna el historial de tiquetes y viajes reservados por el pasajero autenticado.',
    })
    @ApiResponse({ status: 200, description: 'Lista de tiquetes obtenida correctamente.' })
    findAllMyTickets(@Req() req: any) {
        const userId = req.user.userId;
        return this.ticketsService.findAllByUser(userId);
    }

    @Patch(':id/cancel')
    @Roles(Role.PASSENGER, Role.COMPANY_ADMIN, Role.SUPER_ADMIN)
    @ApiOperation({
        summary: 'Cancelar un viaje o tiquete reservado',
        description: 'Permite al pasajero dueño del tiquete (o a un admin) cancelar su reserva, liberando automáticamente el asiento.',
    })
    @ApiResponse({ status: 200, description: 'Tiquete cancelado y asiento liberado exitosamente.' })
    @ApiResponse({ status: 403, description: 'No tienes permisos para cancelar este tiquete.', type: HttpErrorResponseDto })
    @ApiResponse({ status: 404, description: 'El tiquete no existe.', type: HttpErrorResponseDto })
    cancelTicket(@Param('id') id: string, @Req() req: any) {
        const userId = req.user.userId;
        const userRole = req.user.role;
        return this.ticketsService.cancel(id, userId, userRole);
    }
}