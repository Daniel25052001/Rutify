import { Controller, Get, Query } from '@nestjs/common';
import { SuperAdminFleetService } from './super-admin-fleet.service';

@Controller('admin/fleet')
export class SuperAdminFleetController {
    constructor(private readonly fleetService: SuperAdminFleetService) { }

    @Get('buses')
    getAllBuses(@Query('companyId') companyId?: string) {
        return this.fleetService.getAllBuses(companyId);
    }

    @Get('routes')
    getAllRoutes(@Query('companyId') companyId?: string) {
        return this.fleetService.getAllRoutes(companyId);
    }
}