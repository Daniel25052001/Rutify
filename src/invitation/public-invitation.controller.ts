import { Controller, Post, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Invitations - Public')
@Controller('invitations')
export class PublicInvitationController {
    constructor(private readonly invitationService: InvitationService) { }

    /**
     * Endpoint público para procesar la aceptación de una invitación y registrar al usuario.
     * Ruta: POST /invitations/accept/:token
     * 
     * @param token - Token criptográfico único recibido en la URL de invitación.
     * @param dto - Objeto con el nombre y la nueva contraseña del usuario.
     */
    @Post('accept/:token')
    @ApiOperation({
        summary: 'Aceptar invitación y registrar usuario',
        description: 'Valida el token de invitación, verifica su vigencia, crea la cuenta del usuario con contraseña cifrada y marca la invitación como utilizada.',
    })
    @ApiResponse({ status: 200, description: 'Cuenta creada y activada con éxito.' })
    @ApiResponse({ status: 400, description: 'La invitación ha expirado, ya fue utilizada o el correo ya existe.' })
    @ApiResponse({ status: 404, description: 'El enlace de invitación es inválido o no existe.' })
    @HttpCode(HttpStatus.OK)
    async acceptInvitation(
        @Param('token') token: string,
        @Body() dto: AcceptInvitationDto,
    ) {
        return await this.invitationService.acceptInvitation(token, dto);
    }
}