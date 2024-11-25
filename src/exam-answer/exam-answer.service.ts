import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
  ConflictException,
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
import { ExamAnswer } from './exam-answer.entity';
import { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';
import { PaginatedExamAnswerResponseDto } from './dtos/exam-answer-response.dto';
import { createPagination } from 'src/shared/pagination';
import { CourseStatus, ExamStatus, QuestionType, Role } from 'src/shared/enums';
import { CreateExamAnswerDto } from './dtos/create-exam-answer.dto';
import { Question } from 'src/question/question.entity';
import { ExamAttempt } from 'src/exam-attempt/exam-attempt.entity';
import { QuestionOption } from 'src/question-option/question-option.entity';
import { UpdateExamAnswerDto } from './dtos/update-exam-answer.dto';

@Injectable()
export class ExamAnswerService {
  constructor(
    @Inject('ExamAnswerRepository')
    private readonly examAnswerRepository: Repository<ExamAnswer>,
    @Inject('ExamAttemptRepository')
    private readonly examAttemptRepository: Repository<ExamAttempt>,
    @Inject('QuestionRepository')
    private readonly questionRepository: Repository<Question>,
    @Inject('QuestionOptionRepository')
    private readonly questionOptionRepository: Repository<QuestionOption>,
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
  ): Promise<PaginatedExamAnswerResponseDto> {
    const { find } = await createPagination(this.examAnswerRepository, {
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
      relations: ['examAttempt', 'question', 'selectedOption'],
      select: {
        examAttempt: this.selectPopulateExamAttempt(),
        question: this.selectPopulateQuestion(),
        selectedOption: this.selectPopulateSelectedOption(),
      },
    }).run();

    return exam;
  }

  private validateAndCreateCondition(
    userId: string,
    role: Role,
    search: string,
  ): FindOptionsWhere<ExamAnswer> | FindOptionsWhere<ExamAnswer>[] {
    const baseSearch = search ? { answerText: ILike(`%${search}%`) } : {};

    if (role === Role.STUDENT) {
      return [
        {
          ...baseSearch,
          examAttempt: {
            userId,
          },
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
        },
      ];
    }

    if (role === Role.TEACHER) {
      return [
        {
          ...baseSearch,
          question: {
            exam: {
              courseModule: {
                course: {
                  teacher: {
                    id: userId,
                  },
                },
              },
            },
          },
        },
      ];
    }

    if (role === Role.ADMIN) {
      return { ...baseSearch };
    }

    return [
      {
        ...baseSearch,
        examAttempt: {
          userId,
        },
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
      },
    ];
  }

  async findOne(
    userId: string,
    role: Role,
    options: FindOneOptions<ExamAnswer> = {},
  ): Promise<ExamAnswer> {
    const whereCondition = this.validateAndCreateCondition(userId, role, '');

    const where = Array.isArray(whereCondition)
      ? [
          { ...whereCondition[0], ...options.where },
          { ...whereCondition[1], ...options.where },
        ]
      : { ...whereCondition, ...options.where };

    const examAnswer = await this.examAnswerRepository.findOne({
      ...options,
      where,
      relations: ['examAttempt', 'question', 'selectedOption'],
      select: {
        examAttempt: this.selectPopulateExamAttempt(),
        question: this.selectPopulateQuestion(),
        selectedOption: this.selectPopulateSelectedOption(),
      },
    });

    if (!examAnswer) {
      throw new NotFoundException('Exam answer not found');
    }

    return examAnswer;
  }

  async findExamAnswerByQuestionId(
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
  ): Promise<PaginatedExamAnswerResponseDto> {
    const { find } = await createPagination(this.examAnswerRepository, {
      page,
      limit,
    });

    const whereCondition = this.validateAndCreateCondition(
      userId,
      role,
      search,
    );
    whereCondition['question'] = { id: questionId };

    const question = await this.questionRepository.findOne({
      where: { id: questionId },
    });

    if (!question) {
      throw new NotFoundException('Question not found.');
    }

    return await find({
      where: whereCondition,
      relations: ['examAttempt', 'question', 'selectedOption'],
      select: {
        examAttempt: this.selectPopulateExamAttempt(),
        question: this.selectPopulateQuestion(),
        selectedOption: this.selectPopulateSelectedOption(),
      },
    }).run();
  }

  async findExamAnswerBySelectedOptionId(
    userId: string,
    role: Role,
    selectedOptionId: string,
    {
      page = 1,
      limit = 20,
      search = '',
    }: {
      page?: number;
      limit?: number;
      search?: string;
    },
  ): Promise<PaginatedExamAnswerResponseDto> {
    const { find } = await createPagination(this.examAnswerRepository, {
      page,
      limit,
    });

    const whereCondition = this.validateAndCreateCondition(
      userId,
      role,
      search,
    );
    whereCondition['selectedOption'] = { id: selectedOptionId };

    const selectedOption = await this.questionOptionRepository.findOne({
      where: { id: selectedOptionId },
    });

    if (!selectedOption) {
      throw new NotFoundException('Selected option not found.');
    }

    return await find({
      where: whereCondition,
      relations: ['examAttempt', 'question', 'selectedOption'],
      select: {
        examAttempt: this.selectPopulateExamAttempt(),
        question: this.selectPopulateQuestion(),
        selectedOption: this.selectPopulateSelectedOption(),
      },
    }).run();
  }

  async createExamAnswer(
    createExamAnswerDto: CreateExamAnswerDto,
  ): Promise<ExamAnswer> {
    const selectedOption = await this.questionOptionRepository.findOne({
      where: { id: createExamAnswerDto.selectedOptionId },
      select: this.selectPopulateSelectedOption(),
    });

    if (!selectedOption)
      throw new NotFoundException('Not Found SelectedOption');

    const question = await this.questionRepository.findOne({
      where: { id: selectedOption.questionId },
      select: this.selectPopulateQuestion(),
    });

    if (!question) throw new NotFoundException('Not Found Question');

    const examAttempt = createExamAnswerDto.examAttemptId
      ? await this.examAttemptRepository.findOne({
          where: { id: createExamAnswerDto.examAttemptId },
          select: this.selectPopulateExamAttempt(),
        })
      : null;

    const examAnswer = await this.examAnswerRepository.create({
      ...createExamAnswerDto,
      selectedOption,
      question,
      examAttempt,
    });

    if (!examAnswer) throw new NotFoundException("Can't create exam");
    try {
      await this.examAnswerRepository.save(examAnswer);
      return examAnswer;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          'An exam answer for this question and selected option already exists.',
        );
      }
      throw error;
    }
  }

  async updateExamAnswer(
    userId: string,
    role: Role,
    id: string,
    updateExamAnswerDto: UpdateExamAnswerDto,
  ): Promise<ExamAnswer> {
    const examAnswerInData = await this.findOne(userId, role, {
      where: { id },
    });
    if (!examAnswerInData) throw new NotFoundException('Exam answer not found');

    let examAttempt = null;
    if (updateExamAnswerDto.examAttemptId) {
      examAttempt = await this.examAttemptRepository.findOne({
        where: { id: updateExamAnswerDto.examAttemptId },
        select: this.selectPopulateExamAttempt(),
      });
      if (!examAttempt) {
        throw new NotFoundException('Exam attempt not found');
      }
    }

    const updateExamAnswer = {
      ...updateExamAnswerDto,
      ...(examAttempt ? { examAttemptId: examAttempt.id } : {}),
    };

    const examAnswer = await this.examAnswerRepository.update(
      id,
      updateExamAnswer,
    );
    if (!examAnswer) throw new BadRequestException("Can't update exam answer");
    return await this.examAnswerRepository.findOne({
      where: { id },
      relations: ['examAttempt', 'question', 'selectedOption'],
      select: {
        examAttempt: this.selectPopulateExamAttempt(),
        question: this.selectPopulateQuestion(),
        selectedOption: this.selectPopulateSelectedOption(),
      },
    });
  }

  async deleteExamAnswer(
    userId: string,
    role: Role,
    id: string,
  ): Promise<ExamAnswer> {
    try {
      const examAnswer = await this.findOne(userId, role, { where: { id } });
      return await this.examAnswerRepository.remove(examAnswer);
    } catch (error) {
      if (error instanceof Error)
        throw new NotFoundException('Exam answer not found');
    }
  }

  private selectPopulateExamAttempt(): FindOptionsSelect<ExamAttempt> {
    return {
      id: true,
      score: true,
      status: true,
      startedAt: true,
      submittedAt: true,
    };
  }

  private selectPopulateQuestion(): FindOptionsSelect<Question> {
    return {
      id: true,
      question: true,
      type: true,
      points: true,
      orderIndex: true,
    };
  }

  private selectPopulateSelectedOption(): FindOptionsSelect<QuestionOption> {
    return {
      id: true,
      isCorrect: true,
      explanation: true,
      questionId: true,
    };
  }
}
