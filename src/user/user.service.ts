import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hash } from 'argon2';
import { createPagination } from 'src/shared/pagination';
import { FindOneOptions, ILike, Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { PaginatedUserResponseDto } from './dtos/user-response.dto';
import { User } from './user.entity';

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

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      if (updateUserDto.password)
        updateUserDto.password = await hash(updateUserDto.password);
      await this.userRepository.update(id, updateUserDto);
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
