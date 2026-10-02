import { Module } from '@nestjs/common';
import { SuperAdminUsersService } from './users/super-admin-users.service';
import { SuperAdminUsersController } from './users/super-admin-users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SuperAdminFleetController } from './fleet/super-admin-fleet.controller';
import { SuperAdminFleetService } from './fleet/super-admin-fleet.service';

@Module({
  imports: [PrismaModule],
  controllers: [SuperAdminUsersController, SuperAdminFleetController],
  providers: [SuperAdminUsersService, SuperAdminFleetService],
})
export class SuperAdminModule { }