import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { UserStreak } from './user-streak.entity';

@Injectable()
export class UserStreakService {
  constructor(
    @Inject('UserStreakRepository')
    private readonly userStreakRepository: Repository<UserStreak>,
  ) {}

  async create(userId: string): Promise<UserStreak> {
    const userStreak = await this.userStreakRepository.save({
      user: { id: userId },
    });
    return userStreak;
  }

  async findAll(): Promise<UserStreak[]> {
    return this.userStreakRepository.find();
  }

  async findMany(options: FindManyOptions<UserStreak>): Promise<UserStreak[]> {
    return this.userStreakRepository.find(options);
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
}
