import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserReward } from './user-reward.entity';
import { User } from 'src/user/user.entity';
import { Reward } from 'src/reward/reward.entity';
import { Status } from 'src/reward/enums/status.enum';
import { UserRewardStatus } from './enums/user-reward-status.enum';
import { UpdateStatusUserReward } from './dtos/update-status-user-reward.dto';

@Injectable()
export class UserRewardService {
  constructor(
    @Inject('UserRewardRepository')
    private readonly userRewardRepository: Repository<UserReward>,
    @Inject('UserRepository')
    private readonly userRepository: Repository<User>,
    @Inject('RewardRepository')
    private readonly rewardRepository: Repository<Reward>,
  ) {}

  async create(userId: string, rewardId: string): Promise<UserReward> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const reward = await this.rewardRepository.findOne({
      where: { id: rewardId },
    });
    if (reward.status == Status.INACTIVE)
      throw new BadRequestException(
        `${reward.name} is currently not available.`,
      );
    if (user.points < reward.points)
      throw new BadRequestException(
        `not enough points (${reward.points - user.points} points missing)`,
      );
    if (reward.stock <= 0) throw new BadRequestException('reward not enough');
    if (reward.stock == 1)
      this.rewardRepository.update(rewardId, { status: Status.INACTIVE });
    this.rewardRepository.update(rewardId, { stock: reward.stock - 1 });
    this.userRepository.update(userId, { points: user.points - reward.points });
    const newUserReward = new UserReward();
    newUserReward.user = user;
    newUserReward.reward = reward;
    newUserReward.pointsSpent = reward.points;
    newUserReward.status = UserRewardStatus.PENDING;
    const userRewardRes = await this.userRewardRepository.save(newUserReward);
    return userRewardRes;
  }

  async findAll(): Promise<UserReward[]> {
    return this.userRewardRepository.find({
      relations: {
        reward: true,
        user: true,
      },
      select: {
        id: true,
        pointsSpent: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        user: {
          id: true,
        },
        reward: {
          id: true,
          name: true,
        },
      },
    });
  }

  async findOne(id: string): Promise<UserReward> {
    const userReward = await this.userRewardRepository.findOne({
      relations: {
        user: true,
        reward: true,
      },
      where: { id },
      select: {
        id: true,
        pointsSpent: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        user: {
          id: true,
        },
        reward: {
          id: true,
          name: true,
        },
      },
    });
    if (!userReward) throw new NotFoundException('user reward not found');
    return userReward;
  }

  async findByUser(id: string): Promise<UserReward[]> {
    const userRewards = await this.userRewardRepository.find({
      relations: {
        user: true,
        reward: true,
      },
      where: {
        user: {
          id,
        },
      },
      select: {
        id: true,
        pointsSpent: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        user: {
          id: true,
        },
        reward: {
          id: true,
          name: true,
        },
      },
    });
    if (userRewards.length <= 0) {
      throw new NotFoundException("user doesn't have reward yet");
    }
    return userRewards;
  }

  async updateStatus(
    id: string,
    userReward: UpdateStatusUserReward,
  ): Promise<UserReward> {
    try {
      const userRewardRes = await this.userRewardRepository.update(id, {
        status: userReward.status,
      });
      if (userRewardRes.affected == 0)
        throw new NotFoundException('user reward not found');
      return this.userRewardRepository.findOne({
        relations: {
          user: true,
          reward: true,
        },
        where: {
          id,
        },
        select: {
          id: true,
          pointsSpent: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          user: {
            id: true,
          },
          reward: {
            id: true,
            name: true,
          },
        },
      });
    } catch (error) {
      if (error instanceof Error)
        throw new NotFoundException('user reward not found');
    }
  }

  async delete(id: string): Promise<void> {
    const deleteResult = await this.userRewardRepository.delete(id);
    if (deleteResult.affected == 0)
      throw new NotFoundException('user-reward not found');
  }
}
