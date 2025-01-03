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
import { QuestionOptionService } from './question-option.service';
import {
  PaginatedQuestionOptionResponseDto,
  QuestionOptionResponseDto,
} from './dtos/question-option-response.dto';
import { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';
import { PaginateQueryDto } from 'src/shared/pagination/dtos/paginate-query.dto';
import { Roles } from 'src/shared/decorators/role.decorator';
import { Role } from 'src/shared/enums';
import { CreateQuestionOptionDto } from './dtos/create-question-option.dto';
import { UpdateQuestionOptionDto } from './dtos/update-question-option.dto';
import { PaginatedQuestionOptionPretestResponseDto } from './dtos/question-option-pretest-response.dto';

@Controller('question-option')
@Injectable()
@ApiTags('QuestionOption')
@ApiBearerAuth()
export class QuestionOptionController {
  constructor(private readonly questionOptionService: QuestionOptionService) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all question options',
    type: PaginatedQuestionOptionResponseDto,
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
  ): Promise<PaginatedQuestionOptionResponseDto> {
    return await this.questionOptionService.findAll(
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
    description: 'Returns all question option pretest',
    type: PaginatedQuestionOptionPretestResponseDto,
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
  ): Promise<PaginatedQuestionOptionPretestResponseDto> {
    return await this.questionOptionService.findAllQuestionOptionPretest(
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
    description: 'Returns a question option',
    type: QuestionOptionResponseDto,
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
  ): Promise<QuestionOptionResponseDto> {
    const questionOption = await this.questionOptionService.findOne(
      request.user.id,
      request.user.role,
      {
        where: { id },
      },
    );
    return new QuestionOptionResponseDto(questionOption);
  }

  @Get('pretest/:questionId')
  @Roles(Role.STUDENT, Role.ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all question options in pretest id',
    type: PaginatedQuestionOptionPretestResponseDto,
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
  async findQuestionOptionPretestByQuestionId(
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
  ): Promise<PaginatedQuestionOptionPretestResponseDto> {
    return await this.questionOptionService.findQuestionOptionPretestByQuestionId(
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

  @Get('question/:questionId')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all question options in question',
    type: PaginatedQuestionOptionResponseDto,
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
  ): Promise<PaginatedQuestionOptionResponseDto> {
    return await this.questionOptionService.findQuestionOptionByQuestionId(
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

  @Post()
  @Roles(Role.TEACHER)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create an question option',
    type: QuestionOptionResponseDto,
  })
  @HttpCode(HttpStatus.CREATED)
  async createQuestionOption(
    @Body() createQuestionOptionDto: CreateQuestionOptionDto,
  ): Promise<QuestionOptionResponseDto> {
    const questionOption =
      await this.questionOptionService.createQuestionOption(
        createQuestionOptionDto,
      );
    return new QuestionOptionResponseDto(questionOption);
  }

  @Patch(':id')
  @Roles(Role.TEACHER)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update a question option',
    type: QuestionOptionResponseDto,
  })
  async updateQuestionOption(
    @Req() request: AuthenticatedRequest,
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    id: string,
    @Body() updateQuestionOptionDto: UpdateQuestionOptionDto,
  ): Promise<QuestionOptionResponseDto> {
    const questionOption =
      await this.questionOptionService.updateQuestionOption(
        request.user.id,
        request.user.role,
        id,
        updateQuestionOptionDto,
      );
    return new QuestionOptionResponseDto(questionOption);
  }

  @Delete(':id')
  @Roles(Role.TEACHER, Role.ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete a question option',
    type: QuestionOptionResponseDto,
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
  ): Promise<QuestionOptionResponseDto> {
    const questionOption =
      await this.questionOptionService.deleteQuestionOption(
        request.user.id,
        request.user.role,
        id,
      );

    return new QuestionOptionResponseDto(questionOption);
  }
}
