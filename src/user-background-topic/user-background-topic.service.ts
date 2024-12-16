import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createPagination } from 'src/shared/pagination';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { CreateUserBackgroundTopicDto } from './dtos/create-user-background-topic.dto';
import { UpdateUserBackgroundTopicDto } from './dtos/update-user-background-topic.dto';
import {
  PaginatedUserBackgroundTopicResponseDto,
  UserBackgroundTopicResponseDto,
} from './dtos/user-background-response.dto';
import { UserBackgroundTopic } from './user-background-topic.entity';

@Injectable()
export class UserBackgroundTopicService {
  constructor(
    @InjectRepository(UserBackgroundTopic)
    private readonly userBackgroundTopicRepository: Repository<UserBackgroundTopic>,
  ) {}

  async findAll({
    page = 1,
    limit = 20,
  }: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedUserBackgroundTopicResponseDto> {
    const { find } = await createPagination(
      this.userBackgroundTopicRepository,
      {
        page,
        limit,
      },
    );

    const userBackgroundTopics = await find({}).run();

    return userBackgroundTopics;
  }

  async findOne(
    id: string,
    options: FindOneOptions<UserBackgroundTopic>,
  ): Promise<UserBackgroundTopic> {
    const baseWhere = options.where as FindOptionsWhere<UserBackgroundTopic>;
    const whereCondition = { ...baseWhere, id };

    const userBackgroundTopic =
      await this.userBackgroundTopicRepository.findOne({
        where: whereCondition,
      });

    if (!userBackgroundTopic) {
      throw new NotFoundException('User Background Topic not found');
    }

    return userBackgroundTopic;
  }

  async create(
    createUserBackgroundTopicDto: CreateUserBackgroundTopicDto,
  ): Promise<UserBackgroundTopic> {
    const userBackgroundTopic = this.userBackgroundTopicRepository.create(
      createUserBackgroundTopicDto,
    );

    await this.userBackgroundTopicRepository.save(userBackgroundTopic);

    return userBackgroundTopic;
  }

  async update(
    id: string,
    updateUserBackgroundTopicDto: UpdateUserBackgroundTopicDto,
  ): Promise<UserBackgroundTopic> {
    const userBackgroundTopic = await this.findOne(id, { where: { id } });

    this.userBackgroundTopicRepository.merge(
      userBackgroundTopic,
      updateUserBackgroundTopicDto,
    );

    await this.userBackgroundTopicRepository.save(userBackgroundTopic);

    return userBackgroundTopic;
  }

  async remove(id: string): Promise<UserBackgroundTopicResponseDto> {
    const userBackgroundTopic = await this.findOne(id, { where: { id } });

    await this.userBackgroundTopicRepository.remove(userBackgroundTopic);

    return userBackgroundTopic;
  }
}
