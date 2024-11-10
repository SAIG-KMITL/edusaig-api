import {
    Controller,
    Injectable,
    Get,
    Req,
    Patch,
    HttpStatus,
    HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserStreakService } from './user-streak.service';
import { UserStreak } from './user-streak.entity';
import { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';
import { Role } from 'src/shared/enums/roles.enum';
import { Roles } from 'src/shared/decorators/role.decorator';
import { UserStreakResponseDto } from './dtos/user-streak-response.dto';

@Controller('user-streak')
@ApiTags('User Streak')
@ApiBearerAuth()
@Injectable()
export class UserStreakController {
    constructor(private readonly userStreakService: UserStreakService) { }

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
        type: UserStreak,
        description: 'Get user streak',
    })
    async findOne(
        @Req() request: AuthenticatedRequest,
    ): Promise<UserStreakResponseDto> {
        const userStreak = await this.userStreakService.findOne({
            where: { user: { id: request.user.id } },
            relations: { user: true },
        });
        return new UserStreakResponseDto(userStreak);
    }

    @Patch()
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Update user streak',
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    async update(@Req() request: AuthenticatedRequest): Promise<void> {
        return await this.userStreakService.update(request.user.id);
    }
}
