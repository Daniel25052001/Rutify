import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { BusesService } from './bus.service';
import { CreateBusDto, UpdateBusDto } from './dto/bus-dto';
import { BusResponseDto } from './dto/bus-response.dto';
import { HttpErrorResponseDto } from '../common/dto/error-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Buses')
@ApiBearerAuth('JWT-auth')
@Controller('buses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BusesController {
    constructor(private readonly busesService: BusesService) { }

    @Post()
    @Roles(Role.SUPER_ADMIN, Role.COMPANY_ADMIN)
    @ApiOperation({
        summary: 'Registrar un nuevo autobús',
        description: 'Crea un autobús en el sistema asociado a la compañía del usuario administrador autenticado (o la compañía especificada si es Super ADMIN).',
    })
    @ApiResponse({
        status: 201,
        description: 'Autobús creado exitosamente.',
        type: BusResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Datos inválidos en el cuerpo de la petición.',
        type: HttpErrorResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: 'No autenticado.',
        type: HttpErrorResponseDto,
    })
    @ApiResponse({
        status: 403,
        description: 'No autorizado para registrar buses o no está vinculado a una compañía.',
        type: HttpErrorResponseDto,
    })
    @ApiResponse({
        status: 409,
        description: 'Conflicto: La placa ingresada ya se encuentra registrada.',
        type: HttpErrorResponseDto,
    })
    create(@Body() createBusDto: CreateBusDto, @Req() req: any) {
        return this.busesService.create(createBusDto, req.user);
    }
    @Get()
    @ApiOperation({
        summary: 'Listar autobuses con paginación y búsqueda',
        description: 'Retorna una lista paginada de autobuses pertenecientes a la compañía del usuario autenticado, permitiendo filtrar por placa.',
    })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página (por defecto 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Cantidad de registros por página (por defecto 10)' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Término de búsqueda para filtrar por placa' })
    @ApiResponse({
        status: 200,
        description: 'Listado paginado de autobuses obtenido exitosamente.',
    })
    @ApiResponse({
        status: 401,
        description: 'No autenticado.',
        type: HttpErrorResponseDto,
    })
    findAll(
        @Req() req: any,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('search') search?: string,
    ) {
        const pageNumber = page ? parseInt(page, 10) : 1;
        const limitNumber = limit ? parseInt(limit, 10) : 10;

        return this.busesService.findAll(req.user, pageNumber, limitNumber, search);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Obtener detalle de un autobús por ID',
        description: 'Retorna la información detallada de un autobús específico si pertenece a la compañía del solicitante.',
    })
    @ApiParam({
        name: 'id',
        type: String,
        description: 'Identificador único del autobús (UUID)',
        example: 'd1e2f3a4-b5c6-7890-abcd-ef0123456789',
    })
    @ApiResponse({
        status: 200,
        description: 'Detalle del autobús obtenido correctamente.',
        type: BusResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: 'No autenticado.',
        type: HttpErrorResponseDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Autobús no encontrado o no pertenece a la compañía.',
        type: HttpErrorResponseDto,
    })
    findOne(@Param('id') id: string, @Req() req: any) {
        return this.busesService.findOne(id, req.user);
    }

    @Patch(':id')
    @Roles(Role.SUPER_ADMIN, Role.COMPANY_ADMIN)
    @ApiOperation({
        summary: 'Actualizar datos de un autobús',
        description: 'Modifica la información de un autobús existente (placa o capacidad).',
    })
    @ApiParam({
        name: 'id',
        type: String,
        description: 'Identificador único del autobús a actualizar (UUID)',
        example: 'd1e2f3a4-b5c6-7890-abcd-ef0123456789',
    })
    @ApiResponse({
        status: 200,
        description: 'Autobús actualizado exitosamente.',
        type: BusResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Datos de actualización inválidos.',
        type: HttpErrorResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: 'No autenticado.',
        type: HttpErrorResponseDto,
    })
    @ApiResponse({
        status: 403,
        description: 'Permisos insuficientes.',
        type: HttpErrorResponseDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Autobús no encontrado.',
        type: HttpErrorResponseDto,
    })
    update(@Param('id') id: string, @Body() updateBusDto: UpdateBusDto, @Req() req: any) {
        return this.busesService.update(id, updateBusDto, req.user);
    }

    @Delete(':id')
    @Roles(Role.SUPER_ADMIN, Role.COMPANY_ADMIN)
    @ApiOperation({
        summary: 'Eliminar un autobús',
        description: 'Elimina un autobús del sistema si pertenece a la compañía correspondiente.',
    })
    @ApiParam({
        name: 'id',
        type: String,
        description: 'Identificador único del autobús a eliminar (UUID)',
        example: 'd1e2f3a4-b5c6-7890-abcd-ef0123456789',
    })
    @ApiResponse({
        status: 200,
        description: 'Autobús eliminado exitosamente.',
        type: BusResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: 'No autenticado.',
        type: HttpErrorResponseDto,
    })
    @ApiResponse({
        status: 403,
        description: 'Permisos insuficientes.',
        type: HttpErrorResponseDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Autobús no encontrado.',
        type: HttpErrorResponseDto,
    })
    remove(@Param('id') id: string, @Req() req: any) {
        return this.busesService.remove(id, req.user);
    }
}