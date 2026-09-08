import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { BusModule } from './bus/bus.module';
import { RoutesModule } from './routes/routes.module';
import { TripModule } from './trip/trip.module';
import { TicketModule } from './ticket/ticket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Carga el .env globalmente en toda la aplicación
    }),
    PrismaModule,
    AuthModule,
    BusModule,
    RoutesModule,
    TripModule,
    TicketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }