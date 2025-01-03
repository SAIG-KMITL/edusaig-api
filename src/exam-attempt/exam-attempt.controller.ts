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
import {
  ExamAttemptResponseDto,
  PaginatedExamAttemptResponseDto,
} from './dtos/exam-attempt-response.dto';
import { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';
import { PaginateQueryDto } from 'src/shared/pagination/dtos/paginate-query.dto';
import { ExamAttemptService } from './exam-attempt.service.dto';
import { Roles } from 'src/shared/decorators/role.decorator';
import { Role } from 'src/shared/enums';
import {
  CreateExamAttemptDto,
  CreateExamAttemptPretestDto,
} from './dtos/create-exam-attempt.dto';
import {
  UpdateExamAttemptDto,
  UpdateExamAttemptPretestDto,
} from './dtos/update-exam-attempt.dto';
import { Exam } from 'src/exam/exam.entity';
import {
  ExamAttemptPretestResponseDto,
  PaginatedExamAttemptPretestResponseDto,
} from './dtos/exam-attempt-pretest.dto';

@Controller('exam-attempt')
@ApiTags('ExamAttempt')
@ApiBearerAuth()
@Injectable()
export class ExamAttemptController {
  constructor(private readonly examAttemptService: ExamAttemptService) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all exam-attempt',
    type: PaginatedExamAttemptResponseDto,
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
  ): Promise<PaginatedExamAttemptResponseDto> {
    return await this.examAttemptService.findAll(
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all exam-attempt pretest',
    type: PaginatedExamAttemptPretestResponseDto,
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
  async findAllExamAttemptPretest(
    @Req() request: AuthenticatedRequest,
    @Query() query: PaginateQueryDto,
  ): Promise<PaginatedExamAttemptPretestResponseDto> {
    return await this.examAttemptService.findAllExamAttemptPretest(
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
    description: 'Returns an exam-attempt',
    type: ExamAttemptResponseDto,
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
  ): Promise<ExamAttemptResponseDto> {
    const exam = await this.examAttemptService.findOne(
      request.user.id,
      request.user.role,
      {
        where: { id },
      },
    );
    return new ExamAttemptResponseDto(exam);
  }

  @Get('/pretest/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns an exam-attempt pretest',
    type: ExamAttemptPretestResponseDto,
  })
  async findOneExamAttemptPretest(
    @Req() request: AuthenticatedRequest,
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    id: string,
  ): Promise<ExamAttemptPretestResponseDto> {
    const exam = await this.examAttemptService.findOneExamAttemptPrestest(
      request.user.id,
      request.user.role,
      {
        where: { id },
      },
    );
    return new ExamAttemptPretestResponseDto(exam);
  }

  @Post()
  @Roles(Role.STUDENT)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create an exam-attempt',
    type: ExamAttemptResponseDto,
  })
  @HttpCode(HttpStatus.CREATED)
  async createExamAttempt(
    @Req() request: AuthenticatedRequest,
    @Body() createExamAttemptDto: CreateExamAttemptDto,
  ): Promise<ExamAttemptResponseDto> {
    const exam = await this.examAttemptService.createExamAttempt(
      request.user.id,
      createExamAttemptDto,
    );
    return new ExamAttemptResponseDto(exam);
  }

  @Post('/pretest')
  @Roles(Role.STUDENT)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create an exam-attempt pretest',
    type: ExamAttemptPretestResponseDto,
  })
  @HttpCode(HttpStatus.CREATED)
  async createExamAttemptPretest(
    @Req() request: AuthenticatedRequest,
    @Body() createExamAttemptPretestDto: CreateExamAttemptPretestDto,
  ): Promise<ExamAttemptPretestResponseDto> {
    const exam = await this.examAttemptService.createExamAttemptPretest(
      request.user.id,
      createExamAttemptPretestDto,
    );
    return new ExamAttemptPretestResponseDto(exam);
  }

  @Patch(':id')
  @Roles(Role.STUDENT)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update an exam-attempt',
    type: ExamAttemptPretestResponseDto,
  })
  async updateExamAttemptPretest(
    @Req() request: AuthenticatedRequest,
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    id: string,
    @Body() updateExamAttemptPressDto: UpdateExamAttemptPretestDto,
  ): Promise<ExamAttemptPretestResponseDto> {
    const exam = await this.examAttemptService.updateExamAttempt(
      request.user.id,
      request.user.role,
      id,
      updateExamAttemptPressDto,
    );
    return new ExamAttemptPretestResponseDto(exam);
  }

  @Patch('/pretest/:id')
  @Roles(Role.STUDENT)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update an exam-attempt ptetest',
    type: ExamAttemptResponseDto,
  })
  async updateExamAttempt(
    @Req() request: AuthenticatedRequest,
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    id: string,
    @Body() updateExamAttemptDto: UpdateExamAttemptDto,
  ): Promise<ExamAttemptPretestResponseDto> {
    const exam = await this.examAttemptService.updateExamAttemptPretest(
      request.user.id,
      request.user.role,
      id,
      updateExamAttemptDto,
    );
    return new ExamAttemptPretestResponseDto(exam);
  }

  @Patch('/submit/:id')
  @Roles(Role.STUDENT)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update an exam-attempt',
    type: ExamAttemptResponseDto,
  })
  async submitExamAttempt(
    @Req() request: AuthenticatedRequest,
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    id: string,
  ): Promise<ExamAttemptResponseDto> {
    const exam = await this.examAttemptService.submittedExam(
      request.user.id,
      request.user.role,
      id,
    );
    return new ExamAttemptResponseDto(exam);
  }

  @Patch('/pretest/submit/:id')
  @Roles(Role.STUDENT)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update an exam-attempt pretest',
    type: ExamAttemptPretestResponseDto,
  })
  async submitExamAttemptPretest(
    @Req() request: AuthenticatedRequest,
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    id: string,
  ): Promise<ExamAttemptPretestResponseDto> {
    const exam = await this.examAttemptService.submittedExamPretest(
      request.user.id,
      request.user.role,
      id,
    );
    return new ExamAttemptPretestResponseDto(exam);
  }

  @Delete(':id')
  @Roles(Role.TEACHER, Role.ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete an exam',
    type: ExamAttemptResponseDto,
  })
  async deleteExamAttempt(
    @Req() request: AuthenticatedRequest,
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    id: string,
  ): Promise<ExamAttemptResponseDto> {
    const examAttempt = await this.examAttemptService.deleteExamAttempt(
      request.user.id,
      request.user.role,
      id,
    );
    return new ExamAttemptResponseDto(examAttempt);
  }

  @Delete('/pretest/:id')
  @Roles(Role.ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete an exam',
    type: ExamAttemptPretestResponseDto,
  })
  async deleteExamAttemptPretest(
    @Req() request: AuthenticatedRequest,
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    id: string,
  ): Promise<ExamAttemptPretestResponseDto> {
    const examAttempt = await this.examAttemptService.deleteExamAttemptPretest(
      request.user.id,
      request.user.role,
      id,
    );
    return new ExamAttemptPretestResponseDto(examAttempt);
  }
}
