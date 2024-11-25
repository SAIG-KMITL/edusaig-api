import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import {
  FindOneOptions,
  FindOptionsSelect,
  FindOptionsWhere,
  ILike,
  IsNull,
  Not,
  Repository,
} from 'typeorm';
import { ExamAttempt } from './exam-attempt.entity';
import { PaginatedExamAttemptResponseDto } from './dtos/exam-attempt-response.dto';
import { createPagination } from 'src/shared/pagination';
import {
  CourseStatus,
  ExamAttemptStatus,
  ExamStatus,
  Role,
} from 'src/shared/enums';
import { CreateExamAttemptDto } from './dtos/create-exam-attempt.dto';
import { Exam } from 'src/exam/exam.entity';
import { UpdateExamAttemptDto } from './dtos/update-exam-attempt.dto';
import { User } from 'src/user/user.entity';

@Injectable()
export class ExamAttemptService {
  constructor(
    @Inject('ExamAttemptRepository')
    private readonly examAttemptRepository: Repository<ExamAttempt>,
    @Inject('ExamRepository')
    private readonly examRepository: Repository<Exam>,
    @Inject('UserRepository')
    private readonly userRepository: Repository<User>,
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
  ): Promise<PaginatedExamAttemptResponseDto> {
    const { find } = await createPagination(this.examAttemptRepository, {
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
      relations: ['exam', 'user'],
      select: {
        user: this.selectPopulateUser(),
        exam: this.selectPopulateExam(),
      },
    }).run();

    return exam;
  }

  private validateAndCreateCondition(
    userId: string,
    role: Role,
    search: string,
  ): FindOptionsWhere<ExamAttempt> | FindOptionsWhere<ExamAttempt>[] {
    const baseSearch = search ? { id: ILike(`%${search}%`) } : {};

    if (role === Role.ADMIN) {
      return { ...baseSearch };
    }

    if (role === Role.STUDENT) {
      return {
        ...baseSearch,
        userId: userId,
        exam: {
          status: ExamStatus.PUBLISHED,
          courseModule: {
            course: {
              status: CourseStatus.PUBLISHED,
              enrollments: {
                user: {
                  id: userId,
                },
              },
            },
          },
        },
      };
    }

    if (role === Role.TEACHER) {
      return {
        ...baseSearch,
        exam: {
          courseModule: {
            course: {
              teacher: {
                id: userId,
              },
            },
          },
        },
      };
    }

    return {
      ...baseSearch,
      userId: userId,
      exam: {
        status: ExamStatus.PUBLISHED,
        courseModule: {
          course: {
            status: CourseStatus.PUBLISHED,
            enrollments: {
              user: {
                id: userId,
              },
            },
          },
        },
      },
    };
  }

  async findOne(
    userId: string,
    role: Role,
    options: FindOneOptions<ExamAttempt> = {},
  ): Promise<ExamAttempt> {
    const whereCondition = this.validateAndCreateCondition(userId, role, '');

    const where = Array.isArray(whereCondition)
      ? [
          { ...whereCondition[0], ...options.where },
          { ...whereCondition[1], ...options.where },
        ]
      : { ...whereCondition, ...options.where };

    const exam = await this.examAttemptRepository.findOne({
      ...options,
      where,
      relations: ['exam', 'user'],
      select: {
        user: this.selectPopulateUser(),
        exam: this.selectPopulateExam(),
      },
    });

    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    return exam;
  }

  async createExamAttempt(
    userId: string,
    createExamAttemptDto: CreateExamAttemptDto,
  ): Promise<ExamAttempt> {
    const exam = await this.examRepository.findOne({
      where: { id: createExamAttemptDto.examId },
      select: this.selectPopulateExam(),
    });
    if (!exam) {
      throw new NotFoundException('Exam not found.');
    }
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: this.selectPopulateUser(),
    });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    if (user.role != Role.STUDENT)
      throw new ForbiddenException('User is not student.');
    if (
      (await this.countExamAttempts(createExamAttemptDto.examId, userId)) >=
      exam.maxAttempts
    )
      throw new ForbiddenException(
        "Can't create exam-attempt more than max attempt",
      );
    const examAttempt = await this.examAttemptRepository.create({
      ...createExamAttemptDto,
      exam,
      user,
    });
    if (!examAttempt) throw new NotFoundException("Can't create exam-attempt");
    await this.examAttemptRepository.save(examAttempt);
    return examAttempt;
  }

  async updateExamAttempt(
    userId: string,
    role: Role,
    id: string,
    updateExamAttemptDto: UpdateExamAttemptDto,
  ): Promise<ExamAttempt> {
    const examAttemptInData = await this.findOne(userId, role, {
      where: { id },
    });
    if (
      examAttemptInData.status != ExamAttemptStatus.IN_PROGRESS &&
      updateExamAttemptDto.status == ExamAttemptStatus.IN_PROGRESS
    ) {
      throw new ForbiddenException("Can't change status to in progress");
    }
    const examAttempt = await this.examAttemptRepository.update(
      id,
      updateExamAttemptDto,
    );
    if (!examAttempt)
      throw new BadRequestException("Can't update exam-attempt");
    return await this.examAttemptRepository.findOne({
      where: { id },
      relations: ['exam', 'user'],
      select: {
        user: this.selectPopulateUser(),
        exam: this.selectPopulateExam(),
      },
    });
  }

  async deleteExamAttempt(
    userId: string,
    role: Role,
    id: string,
  ): Promise<ExamAttempt> {
    try {
      const examAttempt = await this.findOne(userId, role, { where: { id } });
      await this.examAttemptRepository.delete(id);
      return examAttempt;
    } catch (error) {
      if (error instanceof Error)
        throw new NotFoundException('Exam-attempt not found');
    }
  }

  async submittedExam(
    userId: string,
    role: Role,
    id: string,
  ): Promise<ExamAttempt> {
    const examAttemptInData = await this.findOne(userId, role, {
      where: { id },
    });

    examAttemptInData.submittedAt = new Date();

    await this.examAttemptRepository.update(id, examAttemptInData);

    const updatedExamAttempt = await this.findOne(userId, role, {
      where: { id },
    });

    return updatedExamAttempt;
  }

  async countExamAttempts(examId: string, userId: string): Promise<number> {
    const count = await this.examAttemptRepository
      .createQueryBuilder('examAttempt')
      .where('examAttempt.examId = :examId AND examAttempt.userId = :userId', {
        examId,
        userId,
      })
      .getCount();

    return count;
  }

  private selectPopulateExam(): FindOptionsSelect<Exam> {
    return {
      id: true,
      title: true,
      description: true,
      timeLimit: true,
      passingScore: true,
      maxAttempts: true,
      shuffleQuestions: true,
      status: true,
    };
  }

  private selectPopulateUser(): FindOptionsSelect<User> {
    return {
      id: true,
      username: true,
      fullname: true,
      role: true,
      email: true,
      profileKey: true,
    };
  }
}
