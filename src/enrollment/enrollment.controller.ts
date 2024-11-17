import {
    BadRequestException,
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
import {
    ApiBearerAuth,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';
import { Roles } from 'src/shared/decorators/role.decorator';
import { Role } from 'src/shared/enums';
import { PaginateQueryDto } from 'src/shared/pagination/dtos/paginate-query.dto';
import { CreateEnrollmentDto } from './dtos/create-enrollment.dto';
import {
    EnrollmentResponseDto,
    PaginatedEnrollmentResponseDto,
} from './dtos/enrollment-response.dto';
import { UpdateEnrollmentDto } from './dtos/update-enrollment.dto';
import { EnrollmentService } from './enrollment.service';

@Controller('enrollment')
@ApiTags('Enrollment')
@ApiBearerAuth()
@Injectable()
export class EnrollmentController {
    constructor(private readonly enrollmentService: EnrollmentService) { }

    @Get()
    @ApiResponse({
        status: HttpStatus.OK,
        type: EnrollmentResponseDto,
        description: 'Get all enrollments',
        isArray: true,
    })
    async findAll(
        @Query() query: PaginateQueryDto,
    ): Promise<PaginatedEnrollmentResponseDto> {
        return this.enrollmentService.findAll(query);
    }

    @Get(':id')
    @ApiParam({
        name: 'id',
        type: String,
        description: 'Enrollment ID',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: EnrollmentResponseDto,
        description: 'Get enrollment by ID',
    })
    async findOne(
        @Param(
            'id',
            new ParseUUIDPipe({
                version: '4',
                errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            }),
        )
        id: string,
    ): Promise<EnrollmentResponseDto> {
        return await this.enrollmentService.findOne({ id });
    }

    @Post()
    @Roles(Role.STUDENT)
    @ApiResponse({
        status: HttpStatus.CREATED,
        type: EnrollmentResponseDto,
        description: 'Create enrollment',
    })
    async create(
        @Body() createEnrollmentDto: CreateEnrollmentDto,
        @Req() req: AuthenticatedRequest,
    ): Promise<EnrollmentResponseDto> {
        return await this.enrollmentService.create(createEnrollmentDto);
    }

    @Patch(':id')
    @Roles(Role.STUDENT)
    @ApiParam({
        name: 'id',
        type: String,
        description: 'Enrollment ID',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: EnrollmentResponseDto,
        description: 'Update enrollment by ID',
    })
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateEnrollmentDto: UpdateEnrollmentDto,
    ): Promise<EnrollmentResponseDto> {
        return await this.enrollmentService.update(id, updateEnrollmentDto);
    }

    @Delete(':id')
    @Roles(Role.STUDENT)
    @ApiParam({
        name: 'id',
        type: String,
        description: 'Enrollment ID',
    })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Delete enrollment by ID',
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
        return await this.enrollmentService.remove(id);
    }
}
