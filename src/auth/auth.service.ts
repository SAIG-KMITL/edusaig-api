import {
    Injectable,
    NotFoundException,
    BadRequestException,
    InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { UserService } from 'src/user/user.service';
import { hash, verify } from 'argon2';
import { AuthResponseDto } from './dtos/auth-response.dto';
import { JwtPayloadDto } from './dtos/jwt-payload.dto';
import { GLOBAL_CONFIG } from 'src/shared/constants/global-config.constant';
import { UserResponseDto } from 'src/user/dtos/user-response.dto';
import { UserStreakService } from 'src/user-streak/user-streak.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly userStreakService: UserStreakService,
    ) { }

    async login(loginDto: LoginDto): Promise<AuthResponseDto> {
        const user = await this.userService.findOne({
            where: { email: loginDto.email },
        });
        if (!user) throw new NotFoundException('User not found');
        const isPasswordValid = await verify(user.password, loginDto.password);
        if (!isPasswordValid) throw new BadRequestException('Invalid password');
        try {
            const accessToken = this.generateAccessToken({
                id: user.id,
                role: user.role,
            });
            const refreshToken = this.generateRefreshToken();
            await this.userStreakService.update(user.id);
            return {
                accessToken,
                refreshToken,
                user: new UserResponseDto(user),
            };
        } catch (error) {
            if (error instanceof Error)
                throw new InternalServerErrorException(error.message);
        }
    }

    async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
        const user = await this.userService.findOne({
            where: { email: registerDto.email },
        });
        if (user) throw new BadRequestException('User already exists');
        const hashedPassword = await hash(registerDto.password);
        const createdUser = await this.userService.create({
            ...registerDto,
            password: hashedPassword,
        });
        try {
            const accessToken = this.generateAccessToken({
                id: createdUser.id,
                role: createdUser.role,
            });
            const refreshToken = this.generateRefreshToken();
            await this.userStreakService.create(createdUser.id);
            return {
                accessToken,
                refreshToken,
                user: new UserResponseDto(createdUser),
            };
        } catch (error) {
            if (error instanceof Error) {
                await this.userService.delete(createdUser.id);
                throw new InternalServerErrorException(error.message);
            }
        }
    }

    private generateAccessToken(payload: JwtPayloadDto): string {
        return this.jwtService.sign(payload, {
            secret: this.configService.get<string>(GLOBAL_CONFIG.JWT_ACCESS_SECRET),
            expiresIn: this.configService.get<string>(
                GLOBAL_CONFIG.JWT_ACCESS_EXPIRATION,
            ),
        });
    }

    private generateRefreshToken(): string {
        return this.jwtService.sign(
            {},
            {
                secret: this.configService.get<string>(
                    GLOBAL_CONFIG.JWT_REFRESH_SECRET,
                ),
                expiresIn: this.configService.get<string>(
                    GLOBAL_CONFIG.JWT_REFRESH_EXPIRATION,
                ),
            },
        );
    }
}
