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
import { ExamStatus, QuestionType, Role } from 'src/shared/enums';
import { UpdateExamDto } from './dtos/update-exam.dto';
import { CourseModule } from 'src/course-module/course-module.entity';
import { QuestionService } from 'src/question/question.service';
import { QuestionOptionService } from 'src/question-option/question-option.service';
import { HttpService } from '@nestjs/axios';
import { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';
import { UserService } from 'src/user/user.service';
import { EnrollmentService } from 'src/enrollment/enrollment.service';
import { PretestDto } from './dtos/pretest.dto';
import { Question } from 'src/question/question.entity';

@Injectable()
export class ExamService {
  constructor(
    @Inject('ExamRepository')
    private readonly examRepository: Repository<Exam>,
    @Inject('CourseModuleRepository')
    private readonly courseModuleRepository: Repository<CourseModule>,
    private readonly questionService: QuestionService,
    private readonly questionOptionService: QuestionOptionService,
    private readonly httpService: HttpService,
    private readonly userService: UserService,
    private readonly enrollService: EnrollmentService,
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
      relations: [
        'courseModule',
        'courseModule.course',
        'courseModule.course.teacher',
      ],
      select: {
        courseModule: this.selectPopulateCourseModule(),
      },
    }).run();

    return new PaginatedExamResponseDto(
      exam.data,
      exam.meta.total,
      exam.meta.pageSize,
      exam.meta.currentPage,
    );
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
      relations: [
        'courseModule',
        'courseModule.course',
        'courseModule.course.teacher',
      ],
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
      relations: ['course', 'course.teacher'],
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

    const exam = await this.examRepository.update(id, updateExamDto);
    if (!exam) throw new BadRequestException("Can't update exam");
    return await this.examRepository.findOne({
      where: { id },
      relations: [
        'courseModule',
        'courseModule.course',
        'courseModule.course.teacher',
      ],
      select: {
        courseModule: this.selectPopulateCourseModule(),
      },
    });
  }

  async deleteExam(userId: string, role: Role, id: string): Promise<Exam> {
    try {
      const exam = await this.findOne(userId, role, { where: { id } });
      if (this.checkPermission(userId, role, exam) === false)
        throw new ForbiddenException('Can not change this exam');
      await this.examRepository.delete(id);
      return exam;
    } catch (error) {
      if (error instanceof Error) throw new NotFoundException('Exam not found');
    }
  }

  private selectPopulateCourseModule(): FindOptionsSelect<CourseModule> {
    return {
      id: true,
      title: true,
      description: true,
      orderIndex: true,
      course: {
        id: true,
        teacher: {
          id: true,
        },
      },
    };
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

  async fetchData(examId: string, userId: string): Promise<PretestDto> {
    const api = 'https://ai.edusaig.com/ai';
    const user = await this.userService.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Not Found User');
    const exam = await this.examRepository.findOne({ where: { id: examId } });
    if (!exam) throw new NotFoundException('Not Found this exam');
    const enrollments = await this.enrollService.findEnrollmentByUserId(userId);
    try {
      const requestBody = {
        id: exam.id,
        user: {
          id: user.id,
          email: user.email,
          points: user.points,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          fullname: user.fullname,
        },
        occupation: {
          id: exam.id,
          title: exam.title,
          description: exam.description,
          createdAt: exam.createdAt,
          updatedAt: exam.updatedAt,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        ...(enrollments.length > 0 && {
          topics: enrollments.map((enrollment) => ({
            id: enrollment.id,
            title: enrollment.course.title,
            description: enrollment.course.description,
            level: enrollment.course.level,
            createdAt: enrollment.createdAt,
            updatedAt: enrollment.updatedAt,
          })),
        }),
      };

      const response = await this.httpService.axiosRef.post(
        `${api}/generate-pretest/`,
        requestBody,
      );
      return { data: response.data };
    } catch (error) {
      throw new Error('Failed to fetch data or process request');
    }
  }

  async createQuestionAndChoice(
    examId: string,
    userId: string,
  ): Promise<Question[]> {
    let questions = [];
    const fetchData = await this.fetchData(examId, userId);
    let orderIndex = (await this.questionService.getMaxOrderIndex(examId)) + 1;
    await Promise.all(
      fetchData.data.map(async (data) => {
        const createQuestionDto = {
          examId,
          question: data.question,
          type: QuestionType.PRETEST,
          points: 1,
          orderIndex: orderIndex++,
        };

        const question = await this.questionService.createQuestion(
          createQuestionDto,
        );

        questions.push(question);

        await Promise.all(
          Object.entries(data.choices).map(([key, value]) => {
            const createQuestionOptionDto = {
              questionId: question.id,
              optionText: `${key}. ${value}`,
              isCorrect: key === data.answer,
              explanation: '',
            };

            return this.questionOptionService.createQuestionOption(
              createQuestionOptionDto,
            );
          }),
        );
      }),
    );

    return questions;
  }
}
