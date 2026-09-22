import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { HttpErrorResponseDto } from '../common/dto/error-response.dto';

@ApiTags('Users Management')
@ApiBearerAuth('JWT-auth')
@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('invite')
    @Roles(Role.SUPER_ADMIN)
    @ApiOperation({ summary: 'Invitar o registrar un nuevo empleado' })
    @ApiResponse({ status: 201, description: 'Empleado creado exitosamente.' })
    @ApiResponse({ status: 403, description: 'Acceso denegado.', type: HttpErrorResponseDto })
    inviteEmployee(@Body() dto: { email: string; name: string; role: Role; companyId?: string }) {
        return this.usersService.createEmployee(dto, Role.SUPER_ADMIN);
    }

    @Get()
    @Roles(Role.SUPER_ADMIN, Role.COMPANY_ADMIN)
    @ApiOperation({ summary: 'Listar empleados del sistema o de la compañía' })
    @ApiResponse({ status: 200, description: 'Lista de usuarios obtenida.' })
    findAllEmployees(@Req() req: any) {
        return this.usersService.findAll(req.user);
    }

    @Patch(':id/role')
    @Roles(Role.SUPER_ADMIN)
    @ApiOperation({ summary: 'Asignar o modificar el rol y tenant de un empleado' })
    @ApiResponse({ status: 200, description: 'Rol actualizado correctamente.' })
    updateRole(@Param('id') id: string, @Body() dto: { role?: Role; companyId?: string }) {
        return this.usersService.updateRoleOrCompany(id, dto);
    }

    @Delete(':id')
    @Roles(Role.SUPER_ADMIN)
    @ApiOperation({ summary: 'Eliminar un empleado del sistema' })
    @ApiResponse({ status: 200, description: 'Empleado eliminado correctamente.' })
    removeEmployee(@Param('id') id: string) {
        return this.usersService.removeEmployee(id);
    }


}