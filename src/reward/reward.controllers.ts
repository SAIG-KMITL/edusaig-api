import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  Param,
  ParseUUIDPipe,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RewardService } from './reward.service';
import { Roles } from 'src/shared/decorators/role.decorator';
import { RewardResponseDto } from './dtos/reward-response.dto';
import { CreateRewardDto } from './dtos/create-reward.dto';
import { Role } from 'src/shared/enums/roles.enum';
import { UpdateRewardDto } from './dtos/update-reward.dto';
import { Public } from 'src/shared/decorators/public.decorator';
import { Reward } from './reward.entity';

@Controller('reward')
@Injectable()
@ApiTags('Reward')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @Get()
  @Public()
  @ApiResponse({
    status: HttpStatus.OK,
    type: RewardResponseDto,
    description: 'get all reward',
    isArray: true,
  })
  async findAll(): Promise<RewardResponseDto[]> {
    const rewards = await this.rewardService.findAll();
    return rewards.map((reward) => new RewardResponseDto(reward));
  }

  @Get(':id')
  @Public()
  @ApiResponse({
    status: HttpStatus.OK,
    type: RewardResponseDto,
    description: 'get reward',
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
  ): Promise<RewardResponseDto> {
    const reward = await this.rewardService.findOne({ where: { id } });
    return new RewardResponseDto(reward);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: RewardResponseDto,
    description: 'create reward',
  })
  async create(
    @Body() CreateRewardDto: CreateRewardDto,
  ): Promise<RewardResponseDto> {
    return this.rewardService.create(CreateRewardDto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: RewardResponseDto,
    description: 'edit reward',
  })
  async update(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    id: string,
    @Body() UpdateRewardDto: UpdateRewardDto,
  ): Promise<RewardResponseDto> {
    const reward = await this.rewardService.update(id, UpdateRewardDto);
    return new RewardResponseDto(reward);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'delete reward',
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
  ): Promise<{ message: string }> {
    await this.rewardService.delete(id);
    return { message: 'Reward delete successfully' };
  }
}
