import { Controller, Get, Post, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { TicketsService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';
import { TicketResponseDto } from './dto/ticket-response.dto';
import { HttpErrorResponseDto } from '../common/dto/error-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Tickets')
@ApiBearerAuth('JWT-auth')
@Controller('tickets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) { }

    @Post()
    @Roles(Role.PASSENGER, Role.COMPANY_ADMIN, Role.ADMIN)
    @ApiOperation({
        summary: 'Reservar un nuevo boleto de viaje',
        description: 'Crea una reserva de asiento para el usuario autenticado y descuenta 1 cupo disponible en el viaje en una transacción atómica.',
    })
    @ApiResponse({
        status: 201,
        description: 'Boleto reservado exitosamente y asientos actualizados.',
        type: TicketResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Datos inválidos.',
        type: HttpErrorResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: 'No autenticado.',
        type: HttpErrorResponseDto,
    })
    @ApiResponse({
        status: 404,
        description: 'El viaje especificado no existe.',
        type: HttpErrorResponseDto,
    })
    @ApiResponse({
        status: 409,
        description: 'Conflicto: No hay asientos disponibles en este viaje o el asiento ya fue reservado.',
        type: HttpErrorResponseDto,
    })
    create(@Body() createTicketDto: CreateTicketDto, @Req() req: any) {
        const userId = req.user.userId;
        return this.ticketsService.create(createTicketDto, userId);
    }

    @Get()
    @Roles(Role.PASSENGER, Role.COMPANY_ADMIN, Role.ADMIN)
    @ApiOperation({
        summary: 'Obtener todos los boletos del usuario autenticado',
        description: 'Retorna el historial completo de boletos y reservas del pasajero en sesión junto con los datos del viaje, ruta y bus.',
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de boletos obtenida exitosamente.',
        type: [TicketResponseDto],
    })
    @ApiResponse({
        status: 401,
        description: 'No autenticado.',
        type: HttpErrorResponseDto,
    })
    findAll(@Req() req: any) {
        const userId = req.user.userId;
        return this.ticketsService.findAllByUser(userId);
    }

    @Patch(':id/cancel')
    @Roles(Role.PASSENGER, Role.COMPANY_ADMIN, Role.ADMIN)
    @ApiOperation({
        summary: 'Cancelar un boleto existente',
        description: 'Cancela la reserva de un boleto y devuelve el asiento como disponible al viaje asociado.',
    })
    @ApiParam({
        name: 'id',
        type: String,
        description: 'Identificador único del boleto a cancelar (UUID)',
        example: '7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d',
    })
    @ApiResponse({
        status: 200,
        description: 'Boleto cancelado exitosamente y asiento liberado.',
        type: TicketResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: 'No autenticado.',
        type: HttpErrorResponseDto,
    })
    @ApiResponse({
        status: 403,
        description: 'Prohibido. No tienes permisos para cancelar este boleto.',
        type: HttpErrorResponseDto,
    })
    @ApiResponse({
        status: 404,
        description: 'El boleto no existe.',
        type: HttpErrorResponseDto,
    })
    @ApiResponse({
        status: 409,
        description: 'El boleto ya se encuentra en estado CANCELLED.',
        type: HttpErrorResponseDto,
    })
    cancel(@Param('id') id: string, @Req() req: any) {
        const userId = req.user.userId;
        const userRole = req.user.role;
        return this.ticketsService.cancel(id, userId, userRole);
    }

    @Patch(':id/status')
    @Roles(Role.PASSENGER, Role.COMPANY_ADMIN, Role.ADMIN)
    @ApiOperation({
        summary: 'Actualizar el estado de un boleto',
        description: 'Modifica el estado del boleto (por ejemplo, a PAID o RESERVED) por el propietario o administrador.',
    })
    @ApiParam({
        name: 'id',
        type: String,
        description: 'Identificador único del boleto (UUID)',
        example: '7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d',
    })
    @ApiResponse({
        status: 200,
        description: 'Estado del boleto actualizado correctamente.',
        type: TicketResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Estado inválido proporcionado en el cuerpo.',
        type: HttpErrorResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: 'No autenticado.',
        type: HttpErrorResponseDto,
    })
    @ApiResponse({
        status: 403,
        description: 'No tienes permisos para modificar este boleto.',
        type: HttpErrorResponseDto,
    })
    @ApiResponse({
        status: 404,
        description: 'El boleto no existe.',
        type: HttpErrorResponseDto,
    })
    updateStatus(
        @Param('id') id: string,
        @Body() updateTicketStatusDto: UpdateTicketStatusDto,
        @Req() req: any,
    ) {
        const userId = req.user.userId;
        const userRole = req.user.role;
        return this.ticketsService.updateStatus(id, updateTicketStatusDto.status, userId, userRole);
    }
}