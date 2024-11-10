import { Controller, Injectable, Get, Req, Patch, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiResponse } from "@nestjs/swagger";
import { UserStreakService } from "./user-streak.service";
import { UserStreak } from "./user-streak.entity";
import { AuthenticatedRequest } from "src/auth/interfaces/authenticated-request.interface";
import { Role } from "src/shared/enums/roles.enum";
import { Roles } from "src/shared/decorators/role.decorator";

@Controller("user-streak")
@ApiTags("User Streak")
@Injectable()
export class UserStreakController {
    constructor(
        private readonly userStreakService: UserStreakService,
    ) { }

    @Get()
    @Roles(Role.ADMIN)
    @ApiResponse({
        status: HttpStatus.OK,
        type: UserStreak,
        description: 'Get all user streaks',
        isArray: true,
    })
    async findAll(): Promise<UserStreak[]> {
        return await this.userStreakService.findAll();
    }

    @Get('profile')
    @ApiResponse({
        status: HttpStatus.OK,
        type: UserStreak,
        description: 'Get user streak',
    })
    async findOne(
        @Req() request: AuthenticatedRequest,
    ): Promise<UserStreak> {
        return await this.userStreakService.findOne({ where: { id: request.user.id } });
    }

    @Patch() 
    @ApiResponse({
        status: HttpStatus.OK,
        type: UserStreak,
        description: 'Update user streak',
    })
    async update(
        @Req() request: AuthenticatedRequest,
    ): Promise<UserStreak> {
        return await this.userStreakService.update(request.user.id);
    }
}