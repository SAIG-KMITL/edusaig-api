import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createPagination } from 'src/shared/pagination';
import { PaginateQueryDto } from 'src/shared/pagination/dtos/paginate-query.dto';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { CreateProgressDto } from './dtos/create-progress.dto';
import { PaginatedProgressResponseDto } from './dtos/progress-response.dto';
import { UpdateProgressDto } from './dtos/update-progress.dto';
import { Progress } from './progress.entity';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(Progress)
    private readonly progressRepository: Repository<Progress>,
  ) {}

  async findAll({
    page = 1,
    limit = 20,
  }: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedProgressResponseDto> {
    const { find } = await createPagination(this.progressRepository, {
      page,
      limit,
    });

    const progress = await find({
      relations: {
        enrollment: true,
        chapter: true,
      },
    }).run();

    return progress;
  }

  async findAllByUser(
    userId: string,
    query: PaginateQueryDto,
  ): Promise<PaginatedProgressResponseDto> {
    const { find } = await createPagination(this.progressRepository, query);

    const progress = await find({
      where: {
        enrollment: {
          user: {
            id: userId,
          },
        },
      },
      relations: {
        enrollment: true,
        chapter: true,
      },
    }).run();

    return progress;
  }

  async findOne(
    id: string,
    options: FindOneOptions<Progress>,
  ): Promise<Progress> {
    const baseWhere = options.where as FindOptionsWhere<Progress>;
    const whereCondition = { ...baseWhere, id };

    const progress = await this.progressRepository.findOne({
      where: whereCondition,
      relations: {
        enrollment: true,
        chapter: true,
      },
    });

    if (!progress) {
      throw new NotFoundException('Progress not found');
    }

    return progress;
  }

  async create(data: CreateProgressDto): Promise<Progress> {
    const progress = this.progressRepository.create(data);
    await this.progressRepository.save(progress);

    return progress;
  }

  async update(id: string, data: UpdateProgressDto): Promise<Progress> {
    const progress = await this.findOne(id, { where: { id } });
    Object.assign(progress, data);
    await this.progressRepository.save(progress);

    return progress;
  }

  async remove(id: string): Promise<Progress> {
    const progress = await this.findOne(id, { where: { id } });
    await this.progressRepository.remove(progress);

    return progress;
  }
}
