import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createPagination } from 'src/shared/pagination';
import { UserBackgroundTopic } from 'src/user-background-topic/user-background-topic.entity';
import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { CreateUserBackground } from './dtos/create-user-background.dto';
import { UpdateUserBackground } from './dtos/update-user-background.dto';
import {
  PaginatedUserBackgroundResponseDto,
  UserBackgroundResponseDto,
} from './dtos/user-background-response.dto';
import { UserBackground } from './user-background.entity';

@Injectable()
export class UserBackgroundService {
  constructor(
    @InjectRepository(UserBackground)
    private readonly userBackgroundRepository: Repository<UserBackground>,
  ) {}

  async findAll({
    page = 1,
    limit = 20,
  }: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedUserBackgroundResponseDto> {
    const { find } = await createPagination(this.userBackgroundRepository, {
      page,
      limit,
    });

    const userBackground = await find({
      relations: {
        user: true,
        occupation: true,
        topics: true,
      },
    }).run();

    return userBackground;
  }

  async findOne(
    id: string,
    options: FindOneOptions<UserBackground>,
  ): Promise<UserBackground> {
    const baseWhere = options.where as FindOptionsWhere<UserBackground>;
    const whereCondition = { ...baseWhere, id };

    const userBackground = await this.userBackgroundRepository.findOne({
      where: whereCondition,
      relations: {
        user: true,
        occupation: true,
        topics: true,
      },
    });

    if (!userBackground) {
      throw new NotFoundException('User background not found');
    }

    return userBackground;
  }

  async create(data: CreateUserBackground): Promise<UserBackgroundResponseDto> {
    const userBackground = this.userBackgroundRepository.create({
      userId: data.userId,
      occupationId: data.occupationId,
    });

    const savedUserBackground = await this.userBackgroundRepository.save(
      userBackground,
    );
    return savedUserBackground;
  }

  async update(
    id: string,
    data: UpdateUserBackground,
  ): Promise<UserBackgroundResponseDto> {
    const userBackground = await this.userBackgroundRepository.findOne({
      where: { id },
    });

    const updateData: DeepPartial<UserBackground> = {
      userId: data.userId,
      occupationId: data.occupationId,
    };

    this.userBackgroundRepository.merge(userBackground, updateData);
    const savedUserBackground = await this.userBackgroundRepository.save(
      userBackground,
    );

    return savedUserBackground;
  }

  async remove(id: string): Promise<UserBackground> {
    const userBackground = await this.findOne(id, {
      where: { id },
    });

    await this.userBackgroundRepository.remove(userBackground);

    return userBackground;
  }

  async findOneByUserId(userId: string): Promise<UserBackground> {
    const userBackground = this.userBackgroundRepository.findOne({
      where: { user: { id: userId } },
      order: { updatedAt: 'DESC' },
      relations: {
        user: true,
        topics: true,
        occupation: true,
      },
    });
    if (!userBackground) throw new NotFoundException('Not found this user');
    return userBackground;
  }
}
