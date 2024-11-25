import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ExamAnswerService } from './exam-answer.service';
import {
  ExamAnswerResponseDto,
  PaginatedExamAnswerResponseDto,
} from './dtos/exam-answer-response.dto';
import { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';
import { PaginateQueryDto } from 'src/shared/pagination/dtos/paginate-query.dto';
import { Roles } from 'src/shared/decorators/role.decorator';
import { Role } from 'src/shared/enums';
import { CreateExamAnswerDto } from './dtos/create-exam-answer.dto';
import { UpdateExamAnswerDto } from './dtos/update-exam-answer.dto';

@Controller('exam-answer')
@ApiTags('ExamAnswer')
@ApiBearerAuth()
@Injectable()
export class ExamAnswerController {
  constructor(private readonly examAnswerService: ExamAnswerService) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all exam answers',
    type: PaginatedExamAnswerResponseDto,
    isArray: true,
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'search',
    type: String,
    required: false,
    description: 'Search by title',
  })
  async findAll(
    @Req() request: AuthenticatedRequest,
    @Query() query: PaginateQueryDto,
  ): Promise<PaginatedExamAnswerResponseDto> {
    return await this.examAnswerService.findAll(
      request.user.id,
      request.user.role,
      {
        page: query.page,
        limit: query.limit,
        search: query.search,
      },
    );
  }

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns an exam answer',
    type: ExamAnswerResponseDto,
  })
  async findOne(
    @Req() request: AuthenticatedRequest,
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    id: string,
  ): Promise<ExamAnswerResponseDto> {
    const examAnswer = await this.examAnswerService.findOne(
      request.user.id,
      request.user.role,
      {
        where: { id },
      },
    );
    return new ExamAnswerResponseDto(examAnswer);
  }

  @Get('question/:questionId')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all exam answer in question',
    type: PaginatedExamAnswerResponseDto,
    isArray: true,
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'search',
    type: String,
    required: false,
    description: 'Search by title',
  })
  async findQuestionByExamId(
    @Req() request: AuthenticatedRequest,
    @Query() query: PaginateQueryDto,
    @Param(
      'questionId',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    questionId: string,
  ): Promise<PaginatedExamAnswerResponseDto> {
    return await this.examAnswerService.findExamAnswerByQuestionId(
      request.user.id,
      request.user.role,
      questionId,
      {
        page: query.page,
        limit: query.limit,
        search: query.search,
      },
    );
  }

  @Get('selected-option/:selectedOptionId')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all exam answer in selectedOption',
    type: PaginatedExamAnswerResponseDto,
    isArray: true,
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'search',
    type: String,
    required: false,
    description: 'Search by title',
  })
  async findQuestionByselectedOptionId(
    @Req() request: AuthenticatedRequest,
    @Query() query: PaginateQueryDto,
    @Param(
      'selectedOptionId',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    selectedOptionId: string,
  ): Promise<PaginatedExamAnswerResponseDto> {
    return await this.examAnswerService.findExamAnswerBySelectedOptionId(
      request.user.id,
      request.user.role,
      selectedOptionId,
      {
        page: query.page,
        limit: query.limit,
        search: query.search,
      },
    );
  }

  @Post()
  @Roles(Role.STUDENT)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create an exam answer',
    type: ExamAnswerResponseDto,
  })
  @HttpCode(HttpStatus.CREATED)
  async createExamAnswer(
    @Body() createExamAnswerDto: CreateExamAnswerDto,
  ): Promise<ExamAnswerResponseDto> {
    const examAnswer = await this.examAnswerService.createExamAnswer(
      createExamAnswerDto,
    );
    return new ExamAnswerResponseDto(examAnswer);
  }

  @Patch(':id')
  @Roles(Role.STUDENT)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update an exam answer',
    type: ExamAnswerResponseDto,
  })
  async updateExamAnswer(
    @Req() request: AuthenticatedRequest,
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    id: string,
    @Body() updateExamAnswerDto: UpdateExamAnswerDto,
  ): Promise<ExamAnswerResponseDto> {
    const examAnswer = await this.examAnswerService.updateExamAnswer(
      request.user.id,
      request.user.role,
      id,
      updateExamAnswerDto,
    );
    return new ExamAnswerResponseDto(examAnswer);
  }

  @Delete(':id')
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Delete an exam',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteExam(
    @Req() request: AuthenticatedRequest,
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    id: string,
  ): Promise<void> {
    await this.examAnswerService.deleteExamAnswer(
      request.user.id,
      request.user.role,
      id,
    );
  }
}
