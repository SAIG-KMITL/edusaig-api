import { Controller, Injectable, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dtos/login.dto";
import { RegisterDto } from "./dtos/register.dto";
import { Public } from "src/shared/decorators/public.decorator";

@Controller("auth")
@Injectable()
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    @Post("login")
    @Public()
    async login(
        @Body() loginDto: LoginDto,
    ) {
        return this.authService.login(loginDto);
    }

    @Post("register")
    @Public()
    async register(
        @Body() registerDto: RegisterDto,
    ) {
        return this.authService.register(registerDto);
    }
}