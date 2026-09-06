import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { RoutesService } from './routes.service';
import { CreateRouteDto, UpdateRouteDto } from './dto/route.dto';
import { RouteResponseDto } from './dto/route-response.dto';
import { HttpErrorResponseDto } from '../common/dto/error-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Routes')
@ApiBearerAuth('JWT-auth')
@Controller('routes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RoutesController {
    constructor(private readonly routesService: RoutesService) { }

    @Post()
    @Roles(Role.ADMIN, Role.COMPANY_ADMIN)
    @ApiOperation({
        summary: 'Crear una nueva ruta de transporte',
        description: 'Registra un origen, destino y tarifa asociado a la compañía del usuario autenticado.',
    })
    @ApiResponse({
        status: 201,
        description: 'Ruta creada exitosamente.',
        type: RouteResponseDto,
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
        description: 'Permisos insuficientes o no vinculado a una compañía.',
        type: HttpErrorResponseDto,
    })
    create(@Body() createRouteDto: CreateRouteDto, @Req() req: any) {
        return this.routesService.create(createRouteDto, req.user);
    }

    @Get()
    @ApiOperation({
        summary: 'Listar todas las rutas',
        description: 'Obtiene las rutas registradas pertenecientes a la compañía del usuario (o todas si es Super ADMIN).',
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de rutas obtenida correctamente.',
        type: [RouteResponseDto],
    })
    @ApiResponse({
        status: 401,
        description: 'No autenticado.',
        type: HttpErrorResponseDto,
    })
    findAll(@Req() req: any) {
        return this.routesService.findAll(req.user);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Obtener detalle de una ruta por ID',
        description: 'Retorna la información completa de una ruta si pertenece a la compañía del solicitante.',
    })
    @ApiParam({
        name: 'id',
        type: String,
        description: 'Identificador único de la ruta (UUID)',
        example: 'f1e2d3c4-b5a6-7890-abcd-1234567890ab',
    })
    @ApiResponse({
        status: 200,
        description: 'Detalle de la ruta encontrado.',
        type: RouteResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: 'No autenticado.',
        type: HttpErrorResponseDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Ruta no encontrada o acceso no permitido.',
        type: HttpErrorResponseDto,
    })
    findOne(@Param('id') id: string, @Req() req: any) {
        return this.routesService.findOne(id, req.user);
    }

    @Patch(':id')
    @Roles(Role.ADMIN, Role.COMPANY_ADMIN)
    @ApiOperation({
        summary: 'Actualizar una ruta existente',
        description: 'Permite modificar el origen, destino o tarifa de una ruta existente.',
    })
    @ApiParam({
        name: 'id',
        type: String,
        description: 'Identificador único de la ruta a modificar (UUID)',
        example: 'f1e2d3c4-b5a6-7890-abcd-1234567890ab',
    })
    @ApiResponse({
        status: 200,
        description: 'Ruta actualizada exitosamente.',
        type: RouteResponseDto,
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
        description: 'Ruta no encontrada.',
        type: HttpErrorResponseDto,
    })
    update(@Param('id') id: string, @Body() updateRouteDto: UpdateRouteDto, @Req() req: any) {
        return this.routesService.update(id, updateRouteDto, req.user);
    }

    @Delete(':id')
    @Roles(Role.ADMIN, Role.COMPANY_ADMIN)
    @ApiOperation({
        summary: 'Eliminar una ruta',
        description: 'Elimina una ruta del sistema perteneciente a la compañía del usuario.',
    })
    @ApiParam({
        name: 'id',
        type: String,
        description: 'Identificador único de la ruta a eliminar (UUID)',
        example: 'f1e2d3c4-b5a6-7890-abcd-1234567890ab',
    })
    @ApiResponse({
        status: 200,
        description: 'Ruta eliminada exitosamente.',
        type: RouteResponseDto,
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
        description: 'Ruta no encontrada.',
        type: HttpErrorResponseDto,
    })
    remove(@Param('id') id: string, @Req() req: any) {
        return this.routesService.remove(id, req.user);
    }
}