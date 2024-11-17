import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Injectable,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  Patch,
  Delete,
} from '@nestjs/common';
import { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';
import { Roles } from 'src/shared/decorators/role.decorator';
import { Role } from 'src/shared/enums';
import { UserRewardService } from './user-reward.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRewardResponseDto } from './dtos/user-reward-response.dto';
import { UpdateStatusUserReward } from './dtos/update-status-user-reward.dto';
import { UserRewardStatus } from './enums/user-reward-status.enum';

@Controller('user-reward')
@Injectable()
@ApiTags('User Reward')
@ApiBearerAuth()
export class UserRewardController {
  constructor(private readonly userRewardService: UserRewardService) {}

  @Get()
  @Roles(Role.ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserRewardResponseDto,
    isArray: true,
    description: 'get all user-reward',
  })
  async findAll(): Promise<UserRewardResponseDto[]> {
    const userRewards = await this.userRewardService.findAll();
    return userRewards;
  }

  @Post(':rewardId')
  @Roles(Role.STUDENT)
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserRewardResponseDto,
    description: 'create new user-reward',
  })
  async create(
    @Param(
      'rewardId',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    rewardId: string,
    @Req() request: AuthenticatedRequest,
  ): Promise<UserRewardResponseDto> {
    const userReward = await this.userRewardService.create(
      request.user.id,
      rewardId,
    );
    return userReward;
  }

  @Get('user')
  @Roles(Role.STUDENT)
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserRewardResponseDto,
    isArray: true,
    description: "get all user reward by user's id",
  })
  async findByUser(
    @Req() request: AuthenticatedRequest,
  ): Promise<UserRewardResponseDto[]> {
    const userRewards = await this.userRewardService.findByUser(
      request.user.id,
    );
    return userRewards;
  }

  @Get(':id')
  @Roles(Role.STUDENT)
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserRewardResponseDto,
    description: 'get user reward by id',
  })
  async findOne(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    id: string,
  ): Promise<UserRewardResponseDto> {
    const userReward = await this.userRewardService.findOne(id);
    return userReward;
  }

  @Patch(':id')
  @Roles(Role.STUDENT)
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserRewardResponseDto,
    description: `update status (${UserRewardStatus.PENDING} ${UserRewardStatus.DELIVERED} or ${UserRewardStatus.EXPIRED})`,
  })
  async updateStatus(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    id: string,
    @Body() updateUserRewardDto: UpdateStatusUserReward,
  ): Promise<UserRewardResponseDto> {
    const userReward = await this.userRewardService.updateStatus(
      id,
      updateUserRewardDto,
    );
    return userReward;
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'delete user-reward by user-reward id',
  })
  async delete(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    id: string,
  ): Promise<void> {
    this.userRewardService.delete(id);
  }
}
