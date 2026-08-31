import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register-dto';
import { LoginDto } from './dto/login-dto';
import { JwtAuthGuard } from './guards/jwt.auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { Role, User } from '@prisma/client';

export type AuthUser = Omit<User, 'password'>;

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post('login')
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@GetUser() user: AuthUser) {
        return user;
    }

    @UseGuards(JwtAuthGuard)
    @Get('my-id')
    getUserId(@GetUser('id') userId: string) {
        return { userId };
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Get('admin-only')
    getAdminData(@GetUser() user: AuthUser) {
        return {
            message: 'Bienvenido al panel de administración',
            adminName: user.fullName,
        };
    }
}