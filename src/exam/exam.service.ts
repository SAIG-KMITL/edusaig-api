import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
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
    userId: string,
    role: Role,
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

    const whereCondition = this.validateAndCreateCondition(
      userId,
      role,
      search,
    );
    const exam = await find({
      where: whereCondition,
      relations: ['courseModule'],
      select: {
        courseModule: this.selectPopulateCourseModule(),
      },
    }).run();

        return new PaginatedExamResponseDto(exam.data, exam.meta.total, exam.meta.pageSize, exam.meta.currentPage);
    }

  private validateAndCreateCondition(
    userId: string,
    role: Role,
    search: string,
  ): FindOptionsWhere<Exam> | FindOptionsWhere<Exam>[] {
    const baseSearch = search ? { title: ILike(`%${search}%`) } : {};

    if (role === Role.STUDENT) {
      return { ...baseSearch, status: ExamStatus.PUBLISHED };
    }

    if (role === Role.TEACHER) {
      return [
        {
          ...baseSearch,
          courseModule: {
            course: {
              teacher: {
                id: userId,
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

    if (role === Role.ADMIN) {
      return { ...baseSearch };
    }

    return { ...baseSearch, status: ExamStatus.PUBLISHED };
  }

  async findOne(
    userId: string,
    role: Role,
    options: FindOneOptions<Exam> = {},
  ): Promise<Exam> {
    const whereCondition = this.validateAndCreateCondition(userId, role, '');

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

    if (!exam) throw new BadRequestException("Can't create exam");
    await this.examRepository.save(exam);
    return exam;
  }

  async updateExam(
    userId: string,
    role: Role,
    id: string,
    updateExamDto: UpdateExamDto,
  ): Promise<Exam> {
    const examInData = await this.findOne(userId, role, { where: { id } });
    if (this.checkPermission(userId, role, examInData) === false)
      throw new ForbiddenException('Can not change this exam');
    if (
      examInData.status != ExamStatus.DRAFT &&
      updateExamDto.status == ExamStatus.DRAFT
    ) {
      throw new ForbiddenException("Can't change status to draft");
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
    if (!exam) throw new BadRequestException("Can't update exam");
    return await this.examRepository.findOne({
      where: { id },
      relations: ['courseModule'],
      select: {
        courseModule: this.selectPopulateCourseModule(),
      },
    });
  }

  async deleteExam(userId: string, role: Role, id: string): Promise<void> {
    try {
      const exam = await this.findOne(userId, role, { where: { id } });
      if (this.checkPermission(userId, role, exam) === false)
        throw new ForbiddenException('Can not change this exam');
      await this.examRepository.delete(id);
    } catch (error) {
      if (error instanceof Error) throw new NotFoundException('Exam not found');
    }
  }

  private selectPopulateCourseModule(): FindOptionsSelect<CourseModule> {
    return { id: true, title: true, description: true, orderIndex: true };
  }

  private checkPermission(userId: string, role: Role, exam: Exam): boolean {
    switch (role) {
      case Role.ADMIN:
        return true;
      case Role.TEACHER:
        return exam.courseModule?.course?.teacher?.id === userId;
      case Role.STUDENT:
        return false;
    }
  }
}
