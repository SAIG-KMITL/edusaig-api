import { HttpService } from '@nestjs/axios';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Course } from 'src/course/course.entity';
import { GLOBAL_CONFIG } from 'src/shared/constants/global-config.constant';
import { createPagination } from 'src/shared/pagination';
import { UserBackgroundService } from 'src/user-background/user-background.service';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { PaginatedRoadmapResponseDto, UpdateRoadmapDto } from './dtos';
import { CreateRoadmapAiDto } from './dtos/create-roadmp-ai.dto';
import { Roadmap } from './roadmap.entity';
@Injectable()
export class RoadmapService {
  constructor(
    @Inject('RoadmapRepository')
    private readonly roadmapRepository: Repository<Roadmap>,
    @Inject('CourseRepository')
    private readonly courseRepository: Repository<Course>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly userBackgroundService: UserBackgroundService,
  ) {}

  private readonly defaultRelations = {
    teacher: true,
    category: true,
  };

  async fetchRoadmapData(
    userId: string,
    createRoadmapAiDto: CreateRoadmapAiDto,
  ) {
    const userBackground = await this.userBackgroundService.findOneByUserId(
      userId,
    );
    const course = await this.courseRepository.find({
      relations: this.defaultRelations,
    });
    try {
      const requestBody = {
        courses: course,
        user_data: {
          age: '39',
          department: 'Computer Science',
          interest: userBackground.topics.map((topic) => topic.title),
          name: userBackground.user.fullname,
          preTestDescription: createRoadmapAiDto.preTestDescription,
          preTestScore: 70,
          university: 'Yale',
          userID: userId,
        },
      };
      const response = await this.httpService.axiosRef.post(
        `https://ai.edusaig.com/ai/generate-roadmap`,
        requestBody,
      );
      return { data: response.data };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async create(userId: string, createRoadmapAiDto: CreateRoadmapAiDto) {
    try {
      const roadmap = await this.fetchRoadmapData(userId, createRoadmapAiDto);

      await Promise.all(
        roadmap.data.validated_roadmap.recommended_courses.map(
          async (course) => {
            const courseData = await this.courseRepository.findOne({
              where: { id: course.id },
            });

            if (courseData) {
              const existingRoadmap = await this.roadmapRepository.findOne({
                where: {
                  user: { id: userId },
                  courses: { id: course.id },
                },
              });

              if (!existingRoadmap) {
                const requestBody = {
                  duration: course.duration.toString(),
                  priority: course.priority,
                  courses: [course.id],
                };

                await this.roadmapRepository.save({
                  ...requestBody,
                  user: { id: userId },
                  courses: requestBody.courses.map((courseId) => ({
                    id: courseId,
                  })),
                });
              }
            }
          },
        ),
      );
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
      .leftJoinAndSelect('roadmap.courses', 'courses')
      .leftJoinAndSelect('courses.teacher', 'teacher')
      .leftJoinAndSelect('courses.category', 'category');

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
