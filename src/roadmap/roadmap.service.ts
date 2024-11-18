import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { createPagination } from 'src/shared/pagination';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import {
  CreateRoadmapDto,
  PaginatedRoadmapResponseDto,
  UpdateRoadmapDto,
} from './dtos';
import { Roadmap } from './roadmap.entity';

@Injectable()
export class RoadmapService {
  constructor(
    @Inject('RoadmapRepository')
    private readonly roadmapRepository: Repository<Roadmap>,
  ) {}

  async create(
    userId: string,
    createRoadmapDto: CreateRoadmapDto,
  ): Promise<Roadmap> {
    try {
      return await this.roadmapRepository.save({
        ...createRoadmapDto,
        user: { id: userId },
        courses: createRoadmapDto.courses.map((courseId) => ({ id: courseId })),
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll({
    userId,
    page = 1,
    limit = 20,
    search = '',
  }: {
    userId?: string;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedRoadmapResponseDto> {
    const { find } = await createPagination(this.roadmapRepository, {
      page,
      limit,
    });

    const queryBuilder = this.roadmapRepository
      .createQueryBuilder('roadmap')
      .leftJoinAndSelect('roadmap.user', 'user')
      .leftJoinAndSelect('roadmap.courses', 'courses');

    if (userId) {
      queryBuilder.andWhere('user.id = :userId', { userId });
    }

    if (search) {
      queryBuilder.andWhere(
        '(roadmap.duration ILIKE :search OR courses.title ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return new PaginatedRoadmapResponseDto(data, total, limit, page);
  }
  async findOne(options: FindOneOptions<Roadmap>): Promise<Roadmap> {
    try {
      const roadmap = await this.roadmapRepository.findOne(options);
      if (!roadmap) throw new NotFoundException('Roadmap not found');
      return roadmap;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(
    criteria: FindOptionsWhere<Roadmap>,
    updateRoadmapDto: UpdateRoadmapDto,
  ): Promise<Roadmap> {
    try {
      const roadmap = await this.findOne({ where: criteria });
      return await this.roadmapRepository.save({
        ...roadmap,
        ...updateRoadmapDto,
        courses: updateRoadmapDto.courses.map((courseId) => ({ id: courseId })),
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async delete(criteria: FindOptionsWhere<Roadmap>): Promise<Roadmap> {
    try {
      const roadmap = await this.findOne({ where: criteria });
      if (!roadmap) {
        throw new NotFoundException('Roadmap not found');
      }
      return await this.roadmapRepository.remove(roadmap);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }
}
