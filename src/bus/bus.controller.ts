import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BusService } from './bus.service';
import { CreateBusDto, UpdateBusDto } from './dto/bus-dto';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('buses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BusController {
    constructor(private readonly busService: BusService) { }

    @Post()
    @Roles(Role.ADMIN, Role.COMPANY_ADMIN)
    create(@Body() createBusDto: CreateBusDto) {
        return this.busService.create(createBusDto);
    }

    @Get()
    findAll() {
        return this.busService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.busService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.ADMIN, Role.COMPANY_ADMIN)
    update(@Param('id') id: string, @Body() updateBusDto: UpdateBusDto) {
        return this.busService.update(id, updateBusDto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    remove(@Param('id') id: string) {
        return this.busService.remove(id);
    }
}