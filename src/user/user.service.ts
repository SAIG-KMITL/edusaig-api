import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { createPagination } from 'src/shared/pagination';
import { FindOneOptions, ILike, Repository, FindOptionsWhere } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { PaginatedUserResponseDto } from './dtos/user-response.dto';
import { User } from './user.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { ConfigService } from '@nestjs/config';
import { Role } from 'src/shared/enums';
import { hash } from 'argon2';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');
    const admin = await this.userRepository.findOne({
      where: { email: adminEmail },
    });
    if (!admin) {
      await this.userRepository.save({
        email: adminEmail,
        password: await hash(adminPassword),
        fullname: 'Admin',
        role: Role.ADMIN,
        username: 'admin',
      });
    }
  }

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
    return await this.userRepository.findOne(options);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.userRepository.save(createUserDto);
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

  async delete(criteria: FindOptionsWhere<User>): Promise<void> {
    try {
      await this.userRepository.delete(criteria);
    } catch (error) {
      if (error instanceof Error) throw new NotFoundException(error.message);
    }
  }

  async increment(
    where: FindOptionsWhere<User>,
    propertyPath: string,
    value: number,
  ): Promise<void> {
    try {
        await this.userRepository.increment(where, propertyPath, value);
    } catch {
        throw new NotFoundException('User not found');
    }
  }
}
