import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';
import {
    AuthResponseDto,
    UserProfileResponseDto,
    UserIdResponseDto,
    AdminOnlyResponseDto,
} from './dto/auth-response.dto';
import { HttpErrorResponseDto } from '../common/dto/error-response.dto';
import { JwtAuthGuard } from './guards/jwt.auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { Role, User } from '@prisma/client';

export type AuthUser = Omit<User, 'password'>;

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('accept-invitation')
    @ApiOperation({
        summary: 'Aceptar invitación y registrar contraseña',
        description: 'Permite a un empleado invitado configurar su contraseña y activar su cuenta corporativa mediante un token único.',
    })
    @ApiResponse({
        status: 201,
        description: 'Cuenta activada exitosamente.',
        type: AuthResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Token inválido, expirado o correo ya registrado.',
        type: HttpErrorResponseDto,
    })
    acceptInvitation(@Body() dto: AcceptInvitationDto) {
        return this.authService.acceptInvitation(dto);
    }

    @Post('login')
    @ApiOperation({
        summary: 'Iniciar sesión',
        description: 'Autentica al usuario mediante email y contraseña, retornando el token de acceso JWT con su respectivo tenant y rol.',
    })
    @ApiResponse({
        status: 200,
        description: 'Inicio de sesión exitoso con token JWT generado.',
        type: AuthResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: 'Credenciales inválidas.',
        type: HttpErrorResponseDto,
    })
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    @ApiOperation({
        summary: 'Obtener perfil del usuario autenticado',
        description: 'Retorna los datos del usuario en sesión incluyendo su empresa asociada.',
    })
    @ApiResponse({
        status: 200,
        description: 'Perfil del usuario recuperado exitosamente.',
        type: UserProfileResponseDto,
    })
    getProfile(@GetUser() user: AuthUser) {
        return user;
    }

    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.COMPANY_ADMIN)
    @Get('company-dashboard')
    @ApiOperation({
        summary: 'Recurso exclusivo para administradores de compañía',
        description: 'Endpoint protegido que requiere token JWT válido y rol COMPANY_ADMIN.',
    })
    getAdminData(@GetUser() user: AuthUser) {
        return {
            message: 'Bienvenido al panel administrativo de la compañía',
            companyId: user.companyId,
        };
    }
}