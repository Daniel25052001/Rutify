import { Module } from '@nestjs/common';
import { BusesService } from './bus.service';
import { BusesController } from './bus.controller';

@Module({
  controllers: [BusesController],
  providers: [BusesService],
  exports: [BusesService],
})
export class BusModule { }