import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TripsService } from './trip.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { TripResponseDto } from './dto/trip-response.dto';
import { HttpErrorResponseDto } from '../common/dto/error-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Trips')
@ApiBearerAuth('JWT-auth')
@Controller('trips')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TripsController {
    constructor(private readonly tripsService: TripsService) { }

    @Post()
    @Roles(Role.COMPANY_ADMIN, Role.SUPER_ADMIN)
    @ApiOperation({
        summary: 'Programar un nuevo viaje',
        description: 'Crea un nuevo itinerario de viaje asignando un autobús, una ruta y la cantidad de asientos disponibles.',
    })
    @ApiResponse({
        status: 201,
        description: 'Viaje programado exitosamente.',
        type: TripResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Datos inválidos en la petición.',
        type: HttpErrorResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: 'No autenticado.',
        type: HttpErrorResponseDto,
    })
    @ApiResponse({
        status: 403,
        description: 'El autobús o la ruta no pertenecen a tu compañía o no existe.',
        type: HttpErrorResponseDto,
    })
    create(@Body() createTripDto: CreateTripDto, @Req() req: any) {
        const companyId = req.user.companyId;
        return this.tripsService.create(createTripDto, companyId);
    }

    @Get()
    @Roles(Role.COMPANY_ADMIN, Role.SUPER_ADMIN, Role.DRIVER, Role.PASSENGER)
    @ApiOperation({
        summary: 'Listar todos los viajes de la compañía',
        description: 'Retorna los viajes asociados a los autobuses de la compañía del usuario autenticado.',
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de viajes obtenida correctamente.',
        type: [TripResponseDto],
    })
    @ApiResponse({
        status: 401,
        description: 'No autenticado.',
        type: HttpErrorResponseDto,
    })
    findAll(@Req() req: any) {
        const companyId = req.user.companyId;
        return this.tripsService.findAllByCompany(companyId);
    }
}