import { Module } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { InvitationController } from './invitation.controller';
import { PublicInvitationController } from './public-invitation.controller'; // <--- 1. Importa el controlador público
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [
    InvitationController,
    PublicInvitationController
  ],
  providers: [InvitationService],
  exports: [InvitationService],
})
export class InvitationsModule { }