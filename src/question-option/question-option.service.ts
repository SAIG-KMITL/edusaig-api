import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  FindOneOptions,
  FindOptionsSelect,
  FindOptionsWhere,
  ILike,
  Repository,
} from 'typeorm';
import { QuestionOption } from './question-option.entity';
import { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';
import { PaginatedQuestionOptionResponseDto } from './dtos/question-option-response.dto';
import { createPagination } from 'src/shared/pagination';
import { ExamStatus, Role } from 'src/shared/enums';
import { CreateQuestionOptionDto } from './dtos/create-question-option.dto';
import { Question } from 'src/question/question.entity';
import { UpdateQuestionOptionDto } from './dtos/update-question-option.dto';
@Injectable()
export class QuestionOptionService {
  constructor(
    @Inject('QuestionOptionRepository')
    private readonly questionOptionRepository: Repository<QuestionOption>,
    @Inject('QuestionRepository')
    private readonly questionRepository: Repository<Question>,
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
  ): Promise<PaginatedQuestionOptionResponseDto> {
    const { find } = await createPagination(this.questionOptionRepository, {
      page,
      limit,
    });

    const whereCondition = this.validateAndCreateCondition(request, search);
    const question = await find({
      where: whereCondition,
      relations: ['question'],
      select: {
        question: this.selectPopulateQuestion(),
      },
    }).run();

    return question;
  }

  async findOne(
    request: AuthenticatedRequest,
    options: FindOneOptions<QuestionOption> = {},
  ): Promise<QuestionOption> {
    const whereCondition = this.validateAndCreateCondition(request, '');

    const where = Array.isArray(whereCondition)
      ? [
          { ...whereCondition[0], ...options.where },
          { ...whereCondition[1], ...options.where },
        ]
      : { ...whereCondition, ...options.where };

    const question = await this.questionOptionRepository.findOne({
      ...options,
      where,
      relations: ['question'],
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
    request: AuthenticatedRequest,
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

    const whereCondition = this.validateAndCreateCondition(request, search);
    whereCondition['question'] = { id: questionId };

    const question = await this.questionRepository.findOne({
      where: { id: questionId },
    });

    if (!question) {
      throw new NotFoundException('Question not found.');
    }

    const questionOption = await find({
      where: whereCondition,
      relations: ['question'],
      select: {
        question: this.selectPopulateQuestion(),
      },
    }).run();
    return questionOption;
  }

  private validateAndCreateCondition(
    request: AuthenticatedRequest,
    search: string,
  ): FindOptionsWhere<QuestionOption> {
    const baseSearch = search ? { optionText: ILike(`%${search}%`) } : {};

    if (request.user.role === Role.STUDENT) {
      return {
        ...baseSearch,
        question: {
          exam: {
            status: ExamStatus.PUBLISHED,
          },
        },
      };
    }

    if (request.user.role === Role.TEACHER) {
      return {
        ...baseSearch,
        question: {
          exam: [
            {
              status: ExamStatus.PUBLISHED,
            },
            {
              courseModule: {
                course: {
                  teacher: { id: request.user.id },
                },
              },
            },
          ],
        },
      };
    }

    if (request.user.role === Role.ADMIN) {
      return { ...baseSearch };
    }

    return {
      ...baseSearch,
      question: {
        exam: {
          status: ExamStatus.PUBLISHED,
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
    });
    if (!question) {
      throw new NotFoundException('Question option not found.');
    }
    const questionOption = this.questionOptionRepository.create({
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
    request: AuthenticatedRequest,
    id: string,
    updateQuestionOptionDto: UpdateQuestionOptionDto,
  ): Promise<QuestionOption> {
    await this.findOne(request, { where: { id } });
    const questionOption = await this.questionOptionRepository.update(
      id,
      updateQuestionOptionDto,
    );
    if (!questionOption)
      throw new NotFoundException("Can't update question option");
    return await this.questionOptionRepository.findOne({
      where: { id },
      relations: ['question'],
      select: {
        question: this.selectPopulateQuestion(),
      },
    });
  }

  async deleteQuestionOption(
    request: AuthenticatedRequest,
    id: string,
  ): Promise<void> {
    try {
      await this.findOne(request, { where: { id } });
      await this.questionOptionRepository.delete(id);
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
    };
  }
}
