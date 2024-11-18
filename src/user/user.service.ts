import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createPagination } from 'src/shared/pagination';
import { FindOneOptions, ILike, Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { PaginatedUserResponseDto } from './dtos/user-response.dto';
import { User } from './user.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll({
    page = 1,
    limit = 20,
    search = '',
  }: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedUserResponseDto> {
    const { find } = await createPagination(this.userRepository, {
      page,
      limit,
    });

    const users = await find({
      where: { email: ILike(`%${search}%`) },
    }).run();

    return users;
  }

  async findOne(options: FindOneOptions<User>): Promise<User> {
    const user = this.userRepository.findOne(options);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      return this.userRepository.save(createUserDto);
    } catch (error) {
      if (error instanceof Error) throw new BadRequestException(error.message);
    }
  }

  async update(
    id: string,
    partialEntity: QueryDeepPartialEntity<User>,
  ): Promise<User> {
    try {
      await this.userRepository.update(id, partialEntity);
      return await this.findOne({ where: { id } });
    } catch (error) {
      if (error instanceof Error) throw new NotFoundException('User not found');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.userRepository.delete(id);
    } catch (error) {
      if (error instanceof Error) throw new NotFoundException('User not found');
    }
  }
}
