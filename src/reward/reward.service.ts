import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
import { Reward } from './reward.entity';
import { CreateRewardDto } from './dtos/create-reward.dto';
import { UpdateRewardDto } from './dtos/update-reward.dto';

@Injectable()
export class RewardService {
  constructor(
    @Inject('RewardRepository')
    private readonly rewardRepository: Repository<Reward>,
  ) {}

  async findAll(): Promise<Reward[]> {
    return this.rewardRepository.find();
  }

  async findOne(options: FindOneOptions<Reward>): Promise<Reward> {
    const reward = await this.rewardRepository.findOne(options);
    if (!reward) throw new NotFoundException('reward not found');
    return reward;
  }

  async create(CreateRewardDto: CreateRewardDto): Promise<Reward> {
    try {
      return this.rewardRepository.save(CreateRewardDto);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
    }
  }

  async update(id: string, UpdateRewardDto: UpdateRewardDto): Promise<Reward> {
    try {
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
