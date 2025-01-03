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
import { QuestionService } from './question.service';
import {
  PaginatedQuestionResponseDto,
  QuestionResponseDto,
} from './dtos/question-response.dto';
import { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';
import { PaginateQueryDto } from 'src/shared/pagination/dtos/paginate-query.dto';
import { Roles } from 'src/shared/decorators/role.decorator';
import { Role } from 'src/shared/enums';
import { CreateQuestionDto } from './dtos/create-question.dto';
import { UpdateQuestionDto } from './dtos/update-question.dto';
import { PaginatedQuestionPretestResponseDto } from './dtos/question-pretest-response.dto';

@Controller('question')
@Injectable()
@ApiTags('Question')
@ApiBearerAuth()
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all questions',
    type: PaginatedQuestionResponseDto,
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
  ): Promise<PaginatedQuestionResponseDto> {
    return await this.questionService.findAll(
      request.user.id,
      request.user.role,
      {
        page: query.page,
        limit: query.limit,
        search: query.search,
      },
    );
  }

  @Get('/pretest')
  @Roles(Role.STUDENT, Role.ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all questions pretest',
    type: PaginatedQuestionPretestResponseDto,
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
  async findAllQuestionPretest(
    @Req() request: AuthenticatedRequest,
    @Query() query: PaginateQueryDto,
  ): Promise<PaginatedQuestionPretestResponseDto> {
    return await this.questionService.findAllQuestionPretest(
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
    description: 'Returns an question',
    type: QuestionResponseDto,
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
  ): Promise<QuestionResponseDto> {
    const question = await this.questionService.findOne(
      request.user.id,
      request.user.role,
      {
        where: { id },
      },
    );
    return new QuestionResponseDto(question);
  }

  @Get('pretest/:pretestId')
  @Roles(Role.STUDENT, Role.ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all questions pretest with pretest id',
    type: PaginatedQuestionPretestResponseDto,
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
  async findQuestionPretestByPretestId(
    @Req() request: AuthenticatedRequest,
    @Query() query: PaginateQueryDto,
    @Param(
      'pretestId',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    pretestId: string,
  ): Promise<PaginatedQuestionPretestResponseDto> {
    const question = await this.questionService.findQuestionPretestByPretestId(
      request.user.id,
      request.user.role,
      pretestId,
      {
        page: query.page,
        limit: query.limit,
        search: query.search,
      },
    );
    return question;
  }

  @Get('exam/:examId')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all questions in exam',
    type: PaginatedQuestionResponseDto,
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
      'examId',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    examId: string,
  ): Promise<PaginatedQuestionResponseDto> {
    return await this.questionService.findQuestionByExamId(
      request.user.id,
      request.user.role,
      examId,
      {
        page: query.page,
        limit: query.limit,
        search: query.search,
      },
    );
  }

  @Post()
  @Roles(Role.TEACHER)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create an question',
    type: QuestionResponseDto,
  })
  @HttpCode(HttpStatus.CREATED)
  async createQuestion(
    @Body() createQuestionDto: CreateQuestionDto,
  ): Promise<QuestionResponseDto> {
    const question = await this.questionService.createQuestion(
      createQuestionDto,
    );
    return new QuestionResponseDto(question);
  }

  @Patch(':id')
  @Roles(Role.TEACHER)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update an question',
    type: QuestionResponseDto,
  })
  async updateQuestion(
    @Req() request: AuthenticatedRequest,
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ): Promise<QuestionResponseDto> {
    const question = await this.questionService.updateQuestion(
      request.user.id,
      request.user.role,
      id,
      updateQuestionDto,
    );
    return new QuestionResponseDto(question);
  }

  @Delete(':id')
  @Roles(Role.TEACHER, Role.ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete an question',
    type: QuestionResponseDto,
  })
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
  ): Promise<QuestionResponseDto> {
    const question = await this.questionService.deleteQuestion(
      request.user.id,
      request.user.role,
      id,
    );

    return new QuestionResponseDto(question);
  }
}
