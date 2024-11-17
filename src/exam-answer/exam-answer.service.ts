import { Injectable, Inject } from '@nestjs/common';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { ExamAnswer } from './exam-answer.entity';
import { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';
import { PaginatedExamAnswerResponseDto } from './dtos/exam-answer-response.dto';
import { createPagination } from 'src/shared/pagination';
import { ExamStatus, Role } from 'src/shared/enums';

@Injectable()
export class ExamAnswerService {
  constructor(
    @Inject('ExamAnswerRepository')
    private readonly examAnswerRepository: Repository<ExamAnswer>,
  ) {}

  //   async findAll(
  //     request: AuthenticatedRequest,
  //     {
  //       page = 1,
  //       limit = 20,
  //       search = '',
  //     }: {
  //       page?: number;
  //       limit?: number;
  //       search?: string;
  //     },
  //   ): Promise<PaginatedExamAnswerResponseDto> {
  //     const { find } = await createPagination(this.examAnswerRepository, {
  //       page,
  //       limit,
  //     });

  //     const whereCondition = this.validateAndCreateCondition(request, search);
  //     const exam = await find({
  //       where: whereCondition,
  //     }).run();

  //     return exam;
  //   }

  //   private validateAndCreateCondition(
  //     request: AuthenticatedRequest,
  //     search: string,
  //   ): FindOptionsWhere<ExamAnswer> | FindOptionsWhere<ExamAnswer>[] {
  //     const baseSearch = search ? { answerText: ILike(`%${search}%`) } : {};

  //     if (request.user.role === Role.STUDENT) {
  //       return {
  //         ...baseSearch,
  //         question: { exam: { status: ExamStatus.PUBLISHED } },
  //       };
  //     }

  //     if (request.user.role === Role.TEACHER) {
  //       return [
  //         {
  //           ...baseSearch,
  //           question: {
  //             exam: {
  //               courseModule: {
  //                 course: {
  //                   teacher: {
  //                     id: request.user.id,
  //                   },
  //                 },
  //               },
  //             },
  //           },
  //         },
  //         {
  //           ...baseSearch,
  //           question: { exam: { status: ExamStatus.PUBLISHED } },
  //         },
  //       ];
  //     }

  //     if (request.user.role === Role.ADMIN) {
  //       return { ...baseSearch };
  //     }

  //     return { ...baseSearch, status: ExamStatus.PUBLISHED };
  //   }
}
