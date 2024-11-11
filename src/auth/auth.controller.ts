import { Controller, Injectable, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { Public } from 'src/shared/decorators/public.decorator';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { AuthResponseDto } from './dtos/auth-response.dto';

@Controller('auth')
@ApiTags('Auth')
@Injectable()
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    @Post('login')
    @ApiResponse({ 
        status: HttpStatus.OK,
        description: 'Login',
        type: AuthResponseDto
    })
    @Public()
    async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
        return await this.authService.login(loginDto);
    }

    @Post('register')
    @ApiResponse({ 
        status: HttpStatus.CREATED,
        description: 'Register',
        type: AuthResponseDto
    })
    @HttpCode(HttpStatus.CREATED)
    @Public()
    async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
        return await this.authService.register(registerDto);
    }
}
