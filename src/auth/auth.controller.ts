import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
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

    @Post('register')
    @ApiOperation({
        summary: 'Registrar un nuevo usuario',
        description: 'Crea una cuenta en el sistema y retorna el token JWT de sesión junto a la información del usuario.',
    })
    @ApiResponse({
        status: 201,
        description: 'Usuario registrado exitosamente.',
        type: AuthResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Datos de registro inválidos o el correo ya se encuentra registrado.',
        type: HttpErrorResponseDto,
    })
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post('login')
    @ApiOperation({
        summary: 'Iniciar sesión',
        description: 'Autentica al usuario mediante email y contraseña, retornando el token de acceso JWT.',
    })
    @ApiResponse({
        status: 200,
        description: 'Inicio de sesión exitoso con token JWT generado.',
        type: AuthResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: 'Credenciales inválidas (correo o contraseña incorrectos).',
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
        description: 'Retorna los datos del usuario en sesión a partir del token JWT Bearer provisto.',
    })
    @ApiResponse({
        status: 200,
        description: 'Perfil del usuario recuperado exitosamente.',
        type: UserProfileResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: 'No autorizado. Token inexistente, inválido o expirado.',
        type: HttpErrorResponseDto,
    })
    getProfile(@GetUser() user: AuthUser) {
        return user;
    }

    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    @Get('my-id')
    @ApiOperation({
        summary: 'Obtener ID del usuario autenticado',
        description: 'Retorna el identificador único del usuario autenticado extraído de los claims del token.',
    })
    @ApiResponse({
        status: 200,
        description: 'ID de usuario retornado con éxito.',
        type: UserIdResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: 'No autorizado. Token no proporcionado o inválido.',
        type: HttpErrorResponseDto,
    })
    getUserId(@GetUser('id') userId: string) {
        return { userId };
    }

    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Get('admin-only')
    @ApiOperation({
        summary: 'Recurso exclusivo para administradores',
        description: 'Endpoint protegido que requiere token JWT válido y rol ADMIN para acceder.',
    })
    @ApiResponse({
        status: 200,
        description: 'Acceso concedido al panel de administración.',
        type: AdminOnlyResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: 'No autorizado.',
        type: HttpErrorResponseDto,
    })
    @ApiResponse({
        status: 403,
        description: 'Prohibido. El usuario autenticado no posee el rol ADMIN requerido.',
        type: HttpErrorResponseDto,
    })
    getAdminData(@GetUser() user: AuthUser) {
        return {
            message: 'Bienvenido al panel de administración',
            adminName: user.fullName,
        };
    }
}