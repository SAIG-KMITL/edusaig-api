import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createPagination } from 'src/shared/pagination';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { CreateUserOccupationDto } from './dtos/create-user-occupation.dto';
import { UpdateUserOccupationDto } from './dtos/update-user-occupation.dto';
import { PaginatedUserOccupationResponseDto } from './dtos/user-occupation-response.dto';
import { UserOccupation } from './user-occupation.entity';

@Injectable()
export class UserOccupationService {
  constructor(
    @InjectRepository(UserOccupation)
    private readonly userOccupationRepository: Repository<UserOccupation>,
  ) {}

  async create(
    createUserOccupationDto: CreateUserOccupationDto,
  ): Promise<UserOccupation> {
    const userOccupation = this.userOccupationRepository.create(
      createUserOccupationDto,
    );

    return this.userOccupationRepository.save(userOccupation);
  }

  async findAll({
    page = 1,
    limit = 20,
  }: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedUserOccupationResponseDto> {
    const { find } = await createPagination(this.userOccupationRepository, {
      page,
      limit,
    });

    const userOccupations = await find({}).run();

    return userOccupations;
  }

  async findOne(
    id: string,
    options: FindOneOptions<UserOccupation>,
  ): Promise<UserOccupation> {
    const baseWhere = options.where as FindOptionsWhere<UserOccupation>;
    const whereCondition = { ...baseWhere, id };

    const userOccupation = await this.userOccupationRepository.findOne({
      where: whereCondition,
    });

    if (!userOccupation) {
      throw new NotFoundException('User occupation not found');
    }

    return userOccupation;
  }

  async update(
    id: string,
    updateUserOccupationDto: UpdateUserOccupationDto,
  ): Promise<UserOccupation> {
    const userOccupation = await this.findOne(id, {});

    this.userOccupationRepository.merge(
      userOccupation,
      updateUserOccupationDto,
    );

    return this.userOccupationRepository.save(userOccupation);
  }

  async remove(id: string): Promise<UserOccupation> {
    const userOccupation = await this.findOne(id, { where: { id } });

    await this.userOccupationRepository.remove(userOccupation);

    return userOccupation;
  }
}
