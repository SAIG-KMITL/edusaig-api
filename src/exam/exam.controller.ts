import {
    Controller,
    Injectable,
    Get,
    Param,
    ParseUUIDPipe,
    HttpStatus,
    Post,
    Body,
    Patch,
    Delete,
    HttpCode,
    Query,
    Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { ExamService } from './exam.service';
import { ExamResponseDto, PaginatedExamResponseDto } from './dtos/exam-response.dto';
import { Roles } from 'src/shared/decorators/role.decorator';
import { Role } from 'src/shared/enums';
import { CreateExamDto } from './dtos/create-exam.dto';
import { PaginateQueryDto } from 'src/shared/pagination/dtos/paginate-query.dto';
import { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';
import { UpdateExamDto } from './dtos/update-exam.dto';

@Controller('exam')
@ApiTags('Exam')
@ApiBearerAuth()
@Injectable()
export class ExamController {
    constructor(private readonly examService: ExamService) { }

    @Get()
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns all exams',
        type: ExamResponseDto,
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
    async findAll(@Req() request: AuthenticatedRequest, @Query() query: PaginateQueryDto): Promise<PaginatedExamResponseDto> {
        return await this.examService.findAll(request, {
            page: query.page,
            limit: query.limit,
            search: query.search,
        });
    }

    @Get(':id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns an exam',
        type: ExamResponseDto,
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
    ): Promise<ExamResponseDto> {
        const exam = await this.examService.findOne(request, { where: { id } });
        return new ExamResponseDto(exam);
    }

    @Post()
    @Roles(Role.TEACHER)
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Create an exam',
        type: ExamResponseDto,
    })
    async createExam(@Body() createExamDto: CreateExamDto
    ): Promise<ExamResponseDto> {
        const exam = await this.examService.createExam(createExamDto);
        return new ExamResponseDto(exam);
    }

    @Patch(':id')
    @Roles(Role.TEACHER)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Update an exam',
        type: ExamResponseDto,
    })
    async updateExam(@Req() request: AuthenticatedRequest, @Param(
        'id',
        new ParseUUIDPipe({
            version: '4',
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    id: string, @Body() updateExamDto: UpdateExamDto
    ): Promise<ExamResponseDto> {
        const exam = await this.examService.updateExam(request, id, updateExamDto);
        return new ExamResponseDto(exam);
    }

    @Delete(':id')
    @Roles(Role.TEACHER)
    @Roles(Role.ADMIN)
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Delete an exam',
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteExam(@Req() request: AuthenticatedRequest, @Param(
        'id',
        new ParseUUIDPipe({
            version: '4',
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    id: string,
    ): Promise<{ massage: string }> {
        await this.examService.deleteExam(request, id);
        return { massage: 'Exam deleted successfully' };
    }
}