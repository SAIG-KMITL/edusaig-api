import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindOneOptions, ILike, Repository, FindOptionsWhere } from 'typeorm';
import { Reward } from './reward.entity';
import { CreateRewardDto } from './dtos/create-reward.dto';
import { UpdateRewardDto } from './dtos/update-reward.dto';
import { ConfigService } from '@nestjs/config';
import { createPagination } from 'src/shared/pagination';
import { PaginatedRewardResponseDto } from './dtos/reward-response.dto';
import { Status } from './enums/status.enum';
import { Role } from 'src/shared/enums';
import { Type } from './enums/type.enum';

@Injectable()
export class RewardService {
  constructor(
    @Inject('RewardRepository')
    private readonly rewardRepository: Repository<Reward>,
    private readonly configService: ConfigService,
  ) {}

  async findAll(
    {
      page = 1,
      limit = 20,
      search = '',
      type = '',
    }: {
      page?: number;
      limit?: number;
      search?: string;
      type?: Type | '';
    },
    role?: Role,
  ): Promise<PaginatedRewardResponseDto> {
    const { find } = await createPagination(this.rewardRepository, {
      page,
      limit,
    });
    const conditionSearch = search ? { name: ILike(`%${search}%`) } : {};
    const conditionType = type ? { type: type } : {};
    if (role && role === Role.ADMIN) {
      const rewards = await find({
        where: {
          ...conditionSearch,
          ...conditionType,
        },
      }).run();
      return rewards;
    }
    const rewards = await find({
      where: {
        ...conditionSearch,
        ...conditionType,
        status: Status.ACTIVE,
      },
    }).run();
    return rewards;
  }

  async findOne(id: string, role: Role): Promise<Reward> {
    const condition =
      role === Role.ADMIN ? { id } : { id, status: Status.ACTIVE };
    const reward = await this.rewardRepository.findOne({ where: condition });
    if (!reward) throw new NotFoundException('reward not found');
    return reward;
  }

  async create(CreateRewardDto: CreateRewardDto): Promise<Reward> {
    try {
      if (CreateRewardDto.points < 0)
        throw new BadRequestException('points should not be less than zero');
      return this.rewardRepository.save(CreateRewardDto);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
    }
  }

  async update(id: string, UpdateRewardDto: UpdateRewardDto): Promise<Reward> {
    try {
      if (UpdateRewardDto.points < 0)
        throw new BadRequestException('points should not be less than zero');
      await this.rewardRepository.update(id, UpdateRewardDto);
      return this.rewardRepository.findOne({ where: { id } });
    } catch (error) {
      if (error instanceof Error)
        throw new NotFoundException('reward not found');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      this.rewardRepository.delete(id);
    } catch (error) {
      if (error instanceof Error)
        throw new NotFoundException('reward not found');
    }
  }
}
