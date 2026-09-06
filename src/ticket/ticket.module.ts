import { Module } from '@nestjs/common';
import { TicketsService } from './ticket.service';
import { TicketsController } from './ticket.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService],
})
export class TicketModule { }