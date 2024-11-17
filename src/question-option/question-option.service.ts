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
      relations: ['question'],
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
              status: ExamStatus.PUBLISHED,
            },
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
    let question = null;
    if (updateQuestionOptionDto.questionId) {
      question = await this.questionRepository.findOne({
        where: { id: updateQuestionOptionDto.questionId },
        select: this.selectPopulateQuestion(),
      });

      if (!question) throw new NotFoundException('Question Not Found');
    }
    const updateQuestionOption = {
      ...updateQuestionOptionDto,
      ...(question ? { questionId: question.id } : {}),
    };
    const questionOption = await this.questionOptionRepository.update(
      id,
      updateQuestionOption,
    );
    if (!questionOption)
      throw new BadRequestException("Can't update question option");
    return await this.questionOptionRepository.findOne({
      where: { id },
      relations: ['question'],
      select: {
        question: this.selectPopulateQuestion(),
      },
    });
  }

  async deleteQuestionOption(
    userId: string,
    role: Role,
    id: string,
  ): Promise<void> {
    try {
      const questionOption = await this.findOne(userId, role, {
        where: { id },
      });
      if (this.checkPermission(userId, role, questionOption) === false)
        throw new ForbiddenException('Can not change this question option');
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
}
