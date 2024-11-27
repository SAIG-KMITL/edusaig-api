import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Pretest } from './pretest.entity';
import {
  FindOneOptions,
  FindOptionsSelect,
  FindOptionsWhere,
  ILike,
  Repository,
} from 'typeorm';
import { PaginatedPretestResponseDto } from './dtos/pretest-response.dto';
import { createPagination } from 'src/shared/pagination';
import { User } from 'src/user/user.entity';
import { QuestionType, Role } from 'src/shared/enums';
import { CreatePretestDto } from './dtos/create-pretest.dto';
import { UpdatePretestDto } from './dtos/update-pretest.dto';
import { UserService } from 'src/user/user.service';
import { UserBackgroundService } from 'src/user-background/user-background.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PretestDto } from './dtos/pretest.dto';
import { GLOBAL_CONFIG } from 'src/shared/constants/global-config.constant';
import { QuestionService } from 'src/question/question.service';
import { QuestionOptionService } from 'src/question-option/question-option.service';

@Injectable()
export class PretestService {
  constructor(
    @Inject('PretestRepository')
    private readonly pretestRepository: Repository<Pretest>,
    @Inject('UserRepository')
    private readonly userRepository: Repository<User>,
    private readonly userBackgroundService: UserBackgroundService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly questionService: QuestionService,
    private readonly questionOptionService: QuestionOptionService,
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
  ): Promise<PaginatedPretestResponseDto> {
    const { find } = await createPagination(this.pretestRepository, {
      page,
      limit,
    });

    const whereCondition = this.validateAndCreateCondition(
      userId,
      role,
      search,
    );
    const pretest = await find({
      where: whereCondition,
      relations: ['user'],
      select: {
        user: this.selectPopulateUser(),
      },
    }).run();

    return new PaginatedPretestResponseDto(
      pretest.data,
      pretest.meta.total,
      pretest.meta.pageSize,
      pretest.meta.currentPage,
    );
  }

  async findOne(
    userId: string,
    role: Role,
    options: FindOneOptions<Pretest> = {},
  ): Promise<Pretest> {
    const whereCondition = this.validateAndCreateCondition(userId, role, '');

    const where = Array.isArray(whereCondition)
      ? [
          { ...whereCondition[0], ...options.where },
          { ...whereCondition[1], ...options.where },
        ]
      : { ...whereCondition, ...options.where };

    const pretest = await this.pretestRepository.findOne({
      ...options,
      where,
      relations: ['user'],
      select: {
        user: this.selectPopulateUser(),
      },
    });

    if (!pretest) {
      throw new NotFoundException('Pretest not found');
    }

    return pretest;
  }

  private validateAndCreateCondition(
    userId: string,
    role: Role,
    search: string,
  ): FindOptionsWhere<Pretest> | FindOptionsWhere<Pretest>[] {
    const baseSearch = search ? { title: ILike(`%${search}%`) } : {};

    if (role === Role.ADMIN) {
      return {
        ...baseSearch,
      };
    }
    if (role === Role.STUDENT) {
      return {
        ...baseSearch,
        user: {
          id: userId,
        },
      };
    }
    return {
      ...baseSearch,
      user: {
        id: userId,
      },
    };
  }

  async createPretest(
    userId: string,
    createPretestDto: CreatePretestDto,
  ): Promise<Pretest> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: this.selectPopulateUser(),
    });

    if (!user) throw new NotFoundException('User not found');

    const pretest = await this.pretestRepository.create({
      ...createPretestDto,
      user,
    });

    if (!pretest) throw new BadRequestException("Can't create pretest");
    await this.pretestRepository.save(pretest);
    await this.createQuestionAndChoice(pretest.id, userId);
    return pretest;
  }

  async updatePretest(
    userId: string,
    role: Role,
    id: string,
    updatePretestDto: UpdatePretestDto,
  ): Promise<Pretest> {
    const pretestInData = await this.findOne(userId, role, { where: { id } });

    const pretest = await this.pretestRepository.update(id, updatePretestDto);
    if (!pretest) throw new BadRequestException("Can't update pretest");
    return await this.pretestRepository.findOne({
      where: { id },
      relations: ['user'],
      select: {
        user: this.selectPopulateUser(),
      },
    });
  }

  async deletePretest(
    userId: string,
    role: Role,
    id: string,
  ): Promise<Pretest> {
    try {
      const pretest = await this.findOne(userId, role, { where: { id } });
      return await this.pretestRepository.remove(pretest);
    } catch (error) {
      if (error instanceof Error)
        throw new NotFoundException('Pretest not found');
    }
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

  async fetchData(userId: string, pretestId: string): Promise<PretestDto> {
    const userBackground = await this.userBackgroundService.findOneByUserId(
      userId,
    );
    try {
      const requestBody = {
        id: pretestId,
        user: {
          id: userBackground.user.id,
          email: userBackground.user.email,
          points: userBackground.user.points,
          role: userBackground.user.role,
          createdAt: userBackground.user.createdAt,
          updatedAt: userBackground.user.updatedAt,
          fullname: userBackground.user.fullname,
        },
        occupation: {
          id: userBackground.occupation.id,
          title: userBackground.occupation.title,
          description: userBackground.occupation.description,
          createdAt: userBackground.occupation.createdAt,
          updatedAt: userBackground.occupation.updatedAt,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        topics:
          userBackground.topics.length > 0
            ? userBackground.topics.map((topic) => ({
                id: topic.id,
                title: topic.title,
                description: topic.description,
                level: topic.level,
                createdAt: topic.createdAt,
                updatedAt: topic.updatedAt,
              }))
            : [],
      };
      const response = await this.httpService.axiosRef.post(
        `${this.configService.get<string>(
          GLOBAL_CONFIG.AI_URL,
        )}/ai/generate-pretest/`,
        requestBody,
      );
      return { data: response.data };
    } catch (error) {
      throw new Error('Failed to fetch data or process request');
    }
  }

  async createQuestionAndChoice(
    pretestId: string,
    userId: string,
  ): Promise<void> {
    const fetchData = await this.fetchData(userId, pretestId);
    let orderIndex = 1;
    await Promise.all(
      fetchData.data.map(async (data) => {
        const createQuestionDto = {
          pretestId,
          question: data.question,
          type: QuestionType.PRETEST,
          points: 1,
          orderIndex: orderIndex++,
        };
        const question = await this.questionService.createQuestionForPretest(
          createQuestionDto,
        );
        await Promise.all(
          Object.entries(data.choices).map(([key, value]) => {
            const createQuestionOptionDto = {
              questionId: question.id,
              optionText: `${key}. ${value}`,
              isCorrect: key === data.answer,
              explanation: '',
            };
            return this.questionOptionService.createQuestionOptionPretest(
              createQuestionOptionDto,
            );
          }),
        );
      }),
    );
  }
}
