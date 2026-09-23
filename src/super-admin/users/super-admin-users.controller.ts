import { Controller, Get, Param, Patch, Body, Query } from '@nestjs/common';
import { SuperAdminUsersService } from 'src/super-admin/users/super-admin-users.service';
import { Role } from '@prisma/client';

@Controller('admin/users')
export class SuperAdminUsersController {
    constructor(private readonly usersService: SuperAdminUsersService) { }

    @Get()
    findAll(
        @Query('companyId') companyId?: string,
        @Query('role') role?: Role,
    ) {
        return this.usersService.findAll(companyId, role);
    }

    @Patch(':id/role-company')
    updateRoleOrCompany(
        @Param('id') id: string,
        @Body() dto: { role?: Role; companyId?: string },
    ) {
        return this.usersService.updateRoleOrCompany(id, dto);
    }
}