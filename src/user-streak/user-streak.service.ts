import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { UserStreak } from './user-streak.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class UserStreakService {
  constructor(
    @Inject('UserStreakRepository')
    private readonly userStreakRepository: Repository<UserStreak>,
    private readonly userService: UserService,
  ) {}

  async create(userId: string): Promise<UserStreak> {
    const userStreak = await this.userStreakRepository.save({
      user: { id: userId },
    });
    await this.userService.increment(
      {
        id: userId,
      },
      'points',
      5,
    );
    return userStreak;
  }

  async findAll(): Promise<UserStreak[]> {
    return this.userStreakRepository.find();
  }

  async findOne(options: FindOneOptions<UserStreak>): Promise<UserStreak> {
    const userStreak = await this.userStreakRepository.findOne(options);
    if (!userStreak) throw new NotFoundException('User streak not found');
    return userStreak;
  }

  async delete(options: FindOptionsWhere<UserStreak>): Promise<void> {
    try {
      await this.userStreakRepository.delete(options);
    } catch (error) {
      if (error instanceof Error) {
        throw new NotFoundException('User streak not found');
      }
    }
  }

  async update(userId: string): Promise<void> {
    try {
      const streak = await this.findOne({ where: { user: { id: userId } } });
      const currentDate = new Date();
      const diff =
        Math.abs(
          currentDate.getTime() - new Date(streak.lastActivityDate).getTime(),
        ) /
        (1000 * 60 * 60 * 24);
      if (diff > 1) streak.currentStreak = 0;
      else streak.currentStreak++;
      if (streak.currentStreak > streak.longestStreak)
        streak.longestStreak = streak.currentStreak;
      await this.userStreakRepository.update(
        {
          user: { id: userId },
        },
        {
          currentStreak: streak.currentStreak,
          longestStreak: streak.longestStreak,
          lastActivityDate: currentDate,
        },
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }
    }
  }
}
