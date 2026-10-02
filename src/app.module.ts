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
import { UsersModule } from './users/users.module';
import { InvitationsModule } from './invitation/invitation.module';
import { CompanyModule } from './company/company.module';
import { SuperAdminModule } from './super-admin/super-admin.module';

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
    UsersModule,
    InvitationsModule,
    CompanyModule,
    SuperAdminModule,
  ],
  controllers: [AppController], // Solo el controlador raíz global
  providers: [AppService],
})
export class AppModule { }