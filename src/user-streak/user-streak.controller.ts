import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  Post,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';
import { Roles } from 'src/shared/decorators/role.decorator';
import { Role } from 'src/shared/enums/roles.enum';
import { UserStreakResponseDto } from './dtos/user-streak-response.dto';
import { UserStreak } from './user-streak.entity';
import { UserStreakService } from './user-streak.service';
import { UserService } from 'src/user/user.service';

@Controller('user-streak')
@ApiTags('User Streak')
@ApiBearerAuth()
@Injectable()
export class UserStreakController {
  constructor(
    private readonly userStreakService: UserStreakService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @Roles(Role.ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserStreak,
    description: 'Get all user streaks',
    isArray: true,
  })
  async findAll(): Promise<UserStreakResponseDto[]> {
    const userStreaks = await this.userStreakService.findAll();
    return userStreaks.map(
      (userStreak) => new UserStreakResponseDto(userStreak),
    );
  }

  @Get('profile')
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserStreakResponseDto,
    description: 'Get user streak',
    isArray: true,
  })
  async findOne(
    @Req() request: AuthenticatedRequest,
  ): Promise<UserStreakResponseDto[]> {
    const userStreak = await this.userStreakService.findMany({
      where: { user: { id: request.user.id } },
      relations: { user: true },
    });
    return userStreak.map((userStreak) => new UserStreakResponseDto(userStreak));
  }

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: UserStreakResponseDto,
    description: 'Create user streak',
  })
  @Roles(Role.STUDENT)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Req() request: AuthenticatedRequest,
  ): Promise<UserStreakResponseDto> {
    const userStreak = await this.userStreakService.create(request.user.id);
    await this.userService.increment(
      {
        id: request.user.id,
      },
      'points',
      5,
    );
    return new UserStreakResponseDto(userStreak);
  }
}
