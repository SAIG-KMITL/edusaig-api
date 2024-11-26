import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import {
  FindOneOptions,
  FindOptionsSelect,
  FindOptionsWhere,
  ILike,
  Not,
  Repository,
} from 'typeorm';
import { QuestionOption } from './question-option.entity';
import { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';
import { PaginatedQuestionOptionResponseDto } from './dtos/question-option-response.dto';
import { createPagination } from 'src/shared/pagination';
import { CourseStatus, ExamStatus, QuestionType, Role } from 'src/shared/enums';
import { CreateQuestionOptionDto } from './dtos/create-question-option.dto';
import { Question } from 'src/question/question.entity';
import { UpdateQuestionOptionDto } from './dtos/update-question-option.dto';
import { PaginatedQuestionOptionPretestResponseDto } from './dtos/question-option-pretest-response.dto';
@Injectable()
export class QuestionOptionService {
  constructor(
    @Inject('QuestionOptionRepository')
    private readonly questionOptionRepository: Repository<QuestionOption>,
    @Inject('QuestionRepository')
    private readonly questionRepository: Repository<Question>,
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
  ): Promise<PaginatedQuestionOptionResponseDto> {
    const { find } = await createPagination(this.questionOptionRepository, {
      page,
      limit,
    });

    const whereCondition = this.validateAndCreateCondition(
      userId,
      role,
      search,
    );
    const question = await find({
      where: whereCondition,
      relations: [
        'question',
        'question.exam',
        'question.exam.courseModule',
        'question.exam.courseModule.course',
        'question.exam.courseModule.course.teacher',
      ],
      select: {
        question: this.selectPopulateQuestion(),
      },
    }).run();

    return question;
  }

  async findOne(
    userId: string,
    role: Role,
    options: FindOneOptions<QuestionOption> = {},
  ): Promise<QuestionOption> {
    const whereCondition = this.validateAndCreateCondition(userId, role, '');

    const where = Array.isArray(whereCondition)
      ? [
          { ...whereCondition[0], ...options.where },
          { ...whereCondition[1], ...options.where },
        ]
      : { ...whereCondition, ...options.where };

    const question = await this.questionOptionRepository.findOne({
      ...options,
      where,
      relations: [
        'question',
        'question.exam',
        'question.exam.courseModule',
        'question.exam.courseModule.course',
        'question.exam.courseModule.course.teacher',
      ],
      select: {
        question: this.selectPopulateQuestion(),
      },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    return question;
  }

  async findQuestionOptionByQuestionId(
    userId: string,
    role: Role,
    questionId: string,
    {
      page = 1,
      limit = 20,
      search = '',
    }: {
      page?: number;
      limit?: number;
      search?: string;
    },
  ): Promise<PaginatedQuestionOptionResponseDto> {
    const { find } = await createPagination(this.questionOptionRepository, {
      page,
      limit,
    });

    const whereCondition = this.validateAndCreateCondition(
      userId,
      role,
      search,
    );
    whereCondition['question'] = {
      id: questionId,
      type: Not(QuestionType.PRETEST),
    };

    const question = await this.questionRepository.findOne({
      where: { id: questionId },
    });

    if (!question) {
      throw new NotFoundException('Question not found.');
    }

    const questionOption = await find({
      where: whereCondition,
      relations: [
        'question',
        'question.exam',
        'question.exam.courseModule',
        'question.exam.courseModule.course',
        'question.exam.courseModule.course.teacher',
      ],
      select: {
        question: this.selectPopulateQuestion(),
      },
    }).run();
    return questionOption;
  }

  private validateAndCreateCondition(
    userId: string,
    role: Role,
    search: string,
  ): FindOptionsWhere<QuestionOption> {
    const baseSearch = search ? { optionText: ILike(`%${search}%`) } : {};

    if (role === Role.STUDENT) {
      return {
        ...baseSearch,
        question: {
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
        },
      };
    }

    if (role === Role.TEACHER) {
      return {
        ...baseSearch,
        question: {
          exam: [
            {
              courseModule: {
                course: {
                  teacher: { id: userId },
                },
              },
            },
          ],
        },
      };
    }

    if (role === Role.ADMIN) {
      return { ...baseSearch };
    }

    return {
      ...baseSearch,
      question: {
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
      },
    };
  }

  async createQuestionOption(
    createQuestionOptionDto: CreateQuestionOptionDto,
  ): Promise<QuestionOption> {
    const question = await this.questionRepository.findOne({
      where: { id: createQuestionOptionDto.questionId },
      select: this.selectPopulateQuestion(),
      relations: [
        'exam',
        'exam.courseModule',
        'exam.courseModule.course',
        'exam.courseModule.course.teacher',
      ],
    });
    if (!question) {
      throw new NotFoundException('Question option not found.');
    }
    const questionOption = await this.questionOptionRepository.create({
      ...createQuestionOptionDto,
      question,
    });
    if (!questionOption) {
      throw new BadRequestException('Question option not create.');
    }
    await this.questionOptionRepository.save(questionOption);
    return questionOption;
  }

  async createQuestionOptionPretest(
    createQuestionOptionDto: CreateQuestionOptionDto,
  ): Promise<QuestionOption> {
    const question = await this.questionRepository.findOne({
      where: { id: createQuestionOptionDto.questionId },
      select: this.selectPopulateQuestion(),
      relations: ['pretest', 'pretest.user'],
    });
    if (!question) {
      throw new NotFoundException('Question option not found.');
    }
    const questionOption = await this.questionOptionRepository.create({
      ...createQuestionOptionDto,
      question,
    });
    if (!questionOption) {
      throw new BadRequestException('Question option not create.');
    }
    await this.questionOptionRepository.save(questionOption);
    return questionOption;
  }

  async updateQuestionOption(
    userId: string,
    role: Role,
    id: string,
    updateQuestionOptionDto: UpdateQuestionOptionDto,
  ): Promise<QuestionOption> {
    const questionOptionInData = await this.findOne(userId, role, {
      where: { id },
    });
    if (this.checkPermission(userId, role, questionOptionInData) === false)
      throw new ForbiddenException('Can not change this question option');
    const questionOption = await this.questionOptionRepository.update(
      id,
      updateQuestionOptionDto,
    );
    if (!questionOption)
      throw new BadRequestException("Can't update question option");
    return await this.questionOptionRepository.findOne({
      where: { id },
      relations: [
        'question',
        'question.exam',
        'question.exam.courseModule',
        'question.exam.courseModule.course',
        'question.exam.courseModule.course.teacher',
      ],
      select: {
        question: this.selectPopulateQuestion(),
      },
    });
  }

  async deleteQuestionOption(
    userId: string,
    role: Role,
    id: string,
  ): Promise<QuestionOption> {
    try {
      const questionOption = await this.findOne(userId, role, {
        where: { id },
      });
      if (this.checkPermission(userId, role, questionOption) === false)
        throw new ForbiddenException('Can not change this question option');
      return await this.questionOptionRepository.remove(questionOption);
    } catch (error) {
      if (error instanceof Error)
        throw new NotFoundException('Question option not found');
    }
  }

  private selectPopulateQuestion(): FindOptionsSelect<Question> {
    return {
      id: true,
      question: true,
      type: true,
      points: true,
      orderIndex: true,
      exam: {
        id: true,
        courseModule: {
          id: true,
          course: {
            id: true,
            teacher: {
              id: true,
            },
          },
        },
      },
    };
  }

  private checkPermission(
    userId: string,
    role: Role,
    questionOption: QuestionOption,
  ): boolean {
    switch (role) {
      case Role.ADMIN:
        return true;
      case Role.TEACHER:
        return (
          questionOption.question?.exam?.courseModule?.course?.teacher?.id ===
          userId
        );
      case Role.STUDENT:
        return false;
    }
  }

  async findAllQuestionOptionPretest(
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
  ): Promise<PaginatedQuestionOptionPretestResponseDto> {
    const { find } = await createPagination(this.questionOptionRepository, {
      page,
      limit,
    });

    const whereCondition = this.validateAndCreateConditionForPretest(
      userId,
      role,
      search,
    );
    const question = await find({
      where: whereCondition,
      relations: ['question', 'question.pretest', 'question.pretest.user'],
      select: {
        question: this.selectPopulateQuestionForPretest(),
      },
    }).run();

    return question;
  }

  async findQuestionOptionPretestByQuestionId(
    userId: string,
    role: Role,
    questionId: string,
    {
      page = 1,
      limit = 20,
      search = '',
    }: {
      page?: number;
      limit?: number;
      search?: string;
    },
  ): Promise<PaginatedQuestionOptionPretestResponseDto> {
    const { find } = await createPagination(this.questionOptionRepository, {
      page,
      limit,
    });

    const whereCondition = this.validateAndCreateConditionForPretest(
      userId,
      role,
      search,
    );
    whereCondition['question'] = { id: questionId, type: QuestionType.PRETEST };

    const question = await this.questionRepository.findOne({
      where: { id: questionId },
    });

    if (!question) {
      throw new NotFoundException('Question not found.');
    }

    const questionOption = await find({
      where: whereCondition,
      relations: ['question', 'question.pretest', 'question.pretest.user'],
      select: {
        question: this.selectPopulateQuestionForPretest(),
      },
    }).run();
    return questionOption;
  }

  private validateAndCreateConditionForPretest(
    userId: string,
    role: Role,
    search: string,
  ): FindOptionsWhere<QuestionOption> {
    const baseSearch = search ? { optionText: ILike(`%${search}%`) } : {};

    if (role === Role.STUDENT) {
      return {
        ...baseSearch,
        question: {
          pretest: {
            user: {
              id: userId,
            },
          },
        },
      };
    }

    if (role === Role.ADMIN) {
      return { ...baseSearch };
    }

    return {
      ...baseSearch,
      question: {
        pretest: {
          user: {
            id: userId,
          },
        },
      },
    };
  }

  private selectPopulateQuestionForPretest(): FindOptionsSelect<Question> {
    return {
      id: true,
      question: true,
      type: true,
      points: true,
      orderIndex: true,
      pretest: {
        id: true,
        timeLimit: true,
        title: true,
        description: true,
        passingScore: true,
        maxAttempts: true,
        user: {
          id: true,
          username: true,
          fullname: true,
          role: true,
          email: true,
          profileKey: true,
        },
      },
    };
  }
}
