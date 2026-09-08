import { Module } from '@nestjs/common';
import { TripsController } from './trip.controller';
import { TripsService } from './trip.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TripsController],
  providers: [TripsService],
  exports: [TripsService],
})
export class TripModule { }