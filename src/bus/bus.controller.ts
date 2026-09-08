import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
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
    @Roles(Role.ADMIN, Role.COMPANY_ADMIN)
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
        summary: 'Listar todos los autobuses',
        description: 'Retorna la lista de autobuses pertenecientes a la compañía del usuario autenticado (o todos si es ADMIN global).',
    })
    @ApiResponse({
        status: 200,
        description: 'Listado de autobuses obtenido exitosamente.',
        type: [BusResponseDto],
    })
    @ApiResponse({
        status: 401,
        description: 'No autenticado.',
        type: HttpErrorResponseDto,
    })
    findAll(@Req() req: any) {
        return this.busesService.findAll(req.user);
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
    @Roles(Role.ADMIN, Role.COMPANY_ADMIN)
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
    @Roles(Role.ADMIN, Role.COMPANY_ADMIN)
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