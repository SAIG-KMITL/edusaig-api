import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  Repository,
  FindOneOptions,
  ILike,
  FindOptionsWhere,
  FindOptionsSelect,
} from 'typeorm';
import { Exam } from './exam.entity';
import { CreateExamDto } from './dtos/create-exam.dto';
import { PaginatedExamResponseDto } from './dtos/exam-response.dto';
import { createPagination } from 'src/shared/pagination';
import { ExamStatus, Role } from 'src/shared/enums';
import { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';
import { UpdateExamDto } from './dtos/update-exam.dto';
import { CourseModule } from 'src/course-module/course-module.entity';

@Injectable()
export class ExamService {
  constructor(
    @Inject('ExamRepository')
    private readonly examRepository: Repository<Exam>,
    @Inject('CourseModuleRepository')
    private readonly courseModuleRepository: Repository<CourseModule>,
  ) {}

  async findAll(
    request: AuthenticatedRequest,
    {
      page = 1,
      limit = 20,
      search = '',
    }: {
      page?: number;
      limit?: number;
      search?: string;
    },
  ): Promise<PaginatedExamResponseDto> {
    const { find } = await createPagination(this.examRepository, {
      page,
      limit,
    });

    const whereCondition = this.validateAndCreateCondition(request, search);
    const exam = await find({
      where: whereCondition,
      relations: ['courseModule'],
      select: {
        courseModule: this.selectPopulateCourseModule(),
      },
    }).run();

    return exam;
  }

  private validateAndCreateCondition(
    request: AuthenticatedRequest,
    search: string,
  ): FindOptionsWhere<Exam> | FindOptionsWhere<Exam>[] {
    const baseSearch = search ? { title: ILike(`%${search}%`) } : {};

    if (request.user.role === Role.STUDENT) {
      return { ...baseSearch, status: ExamStatus.PUBLISHED };
    }

    if (request.user.role === Role.TEACHER) {
      return [
        {
          ...baseSearch,
          courseModule: {
            course: {
              teacher: {
                id: request.user.id,
              },
            },
          },
        },
        {
          ...baseSearch,
          status: ExamStatus.PUBLISHED,
        },
      ];
    }

    if (request.user.role === Role.ADMIN) {
      return { ...baseSearch };
    }

    return { ...baseSearch, status: ExamStatus.PUBLISHED };
  }

  async findOne(
    request: AuthenticatedRequest,
    options: FindOneOptions<Exam> = {},
  ): Promise<Exam> {
    const whereCondition = this.validateAndCreateCondition(request, '');

    const where = Array.isArray(whereCondition)
      ? [
          { ...whereCondition[0], ...options.where },
          { ...whereCondition[1], ...options.where },
        ]
      : { ...whereCondition, ...options.where };

    const exam = await this.examRepository.findOne({
      ...options,
      where,
      relations: ['courseModule'],
      select: {
        courseModule: this.selectPopulateCourseModule(),
      },
    });

    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    return exam;
  }

  async createExam(createExamDto: CreateExamDto): Promise<Exam> {
    const courseModule = await this.courseModuleRepository.findOne({
      where: { id: createExamDto.courseModuleId },
      select: this.selectPopulateCourseModule(),
    });

    if (!courseModule) throw new NotFoundException('Course Module not found');

    const exam = await this.examRepository.create({
      ...createExamDto,
      courseModule,
    });

    if (!exam) throw new NotFoundException("Can't create exam");
    await this.examRepository.save(exam);
    return exam;
  }

  async updateExam(
    request: AuthenticatedRequest,
    id: string,
    updateExamDto: UpdateExamDto,
  ): Promise<Exam> {
    const examInData = await this.findOne(request, { where: { id } });
    if (
      examInData.status != ExamStatus.DRAFT &&
      updateExamDto.status == ExamStatus.DRAFT
    ) {
      throw new NotFoundException("Can't change status to draft");
    }
    let courseModule = null;
    if (updateExamDto.courseModuleId) {
      courseModule = await this.courseModuleRepository.findOne({
        where: { id: updateExamDto.courseModuleId },
        select: this.selectPopulateCourseModule(),
      });

      if (!courseModule) throw new NotFoundException('CourseModule Not Found');
    }
    const updateExam = {
      ...updateExamDto,
      ...(courseModule ? { examAttemptId: courseModule.id } : {}),
    };

    const exam = await this.examRepository.update(id, updateExam);
    if (!exam) throw new NotFoundException("Can't update exam");
    return await this.examRepository.findOne({
      where: { id },
      relations: ['courseModule'],
      select: {
        courseModule: this.selectPopulateCourseModule(),
      },
    });
  }

  async deleteExam(request: AuthenticatedRequest, id: string): Promise<void> {
    try {
      if (await this.findOne(request, { where: { id } })) {
        await this.examRepository.delete(id);
      }
    } catch (error) {
      if (error instanceof Error) throw new NotFoundException('Exam not found');
    }
  }

  private selectPopulateCourseModule(): FindOptionsSelect<CourseModule> {
    return { id: true, title: true, description: true, orderIndex: true };
  }
}
