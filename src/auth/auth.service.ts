import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';
import 'dotenv/config';
import { GLOBAL_CONFIG } from 'src/shared/constants/global-config.constant';
import { UserResponseDto } from 'src/user/dtos/user-response.dto';
import { UserService } from 'src/user/user.service';
import { AuthResponseDto } from './dtos/auth-response.dto';
import { JwtPayloadDto } from './dtos/jwt-payload.dto';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';

const configService = new ConfigService();

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userService.findOne({
      where: { email: loginDto.email },
    });
    if (!user) throw new NotFoundException('User not found');
    const isPasswordValid = await verify(user.password, loginDto.password);
    if (!isPasswordValid) throw new BadRequestException('Invalid password');
    return {
      accessToken: this.generateAccessToken({ id: user.id, role: user.role }),
      refreshToken: this.generateRefreshToken(),
      user: new UserResponseDto(user),
    };
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
    return {
      accessToken: this.generateAccessToken({
        id: createdUser.id,
        role: createdUser.role,
      }),
      refreshToken: this.generateRefreshToken(),
      user: new UserResponseDto(createdUser),
    };
  }

  generateAccessToken(payload: JwtPayloadDto): string {
    return this.jwtService.sign(payload, {
      secret: configService.get<string>(GLOBAL_CONFIG.JWT_ACCESS_SECRET),
      expiresIn: configService.get<string>(GLOBAL_CONFIG.JWT_ACCESS_EXPIRATION),
    });
  }

  generateRefreshToken(): string {
    return this.jwtService.sign(
      {},
      {
        secret: configService.get<string>(GLOBAL_CONFIG.JWT_REFRESH_SECRET),
        expiresIn: configService.get<string>(
          GLOBAL_CONFIG.JWT_REFRESH_EXPIRATION,
        ),
      },
    );
  }
}
