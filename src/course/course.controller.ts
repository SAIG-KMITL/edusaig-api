import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Injectable, Param, ParseUUIDPipe, Patch, Post, Query, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CourseService } from "./course.service";
import { CourseResponseDto, CreateCourseDto, PaginatedCourseResponeDto, UpdateCourseDto } from "./dtos/index";
import { AuthenticatedRequest } from "src/auth/interfaces/authenticated-request.interface";
import { Roles } from "src/shared/decorators/role.decorator";
import { Role } from "src/shared/enums";
import { PaginateQueryDto } from "src/shared/pagination/dtos/paginate-query.dto";
import { CategoryService } from "src/category/category.service";

@Controller("course")
@ApiTags("Course")
@ApiBearerAuth()
@Injectable()
export class CourseController {
    constructor(private readonly courseService : CourseService, private readonly categoryService : CategoryService) { }
    
    @Get()
    @ApiResponse({
        status: HttpStatus.OK,
        type: CourseResponseDto,
        description: 'Get all course',
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
    description: 'Search by email',
    })
    async findAll(
    @Req() request: AuthenticatedRequest,
    @Query() query: PaginateQueryDto,
    ): Promise<PaginatedCourseResponeDto> {
        return this.courseService.findAll({
            page: query.page,
            limit: query.limit,
            search: query.search,
            userId: request.user.id,
            role: request.user.role,
        });
    }

    @Get(':id')
    @ApiParam({
        name: 'id',
        type: String,
        description: 'Course id',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: CourseResponseDto,
        description: 'Get course by id',
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
    ): Promise<CourseResponseDto> {
        const course = await this.courseService.findOne(request.user.id,request.user.role,{ where: { id } });
        return new CourseResponseDto(course);
    }


    @Post()
    @Roles(Role.TEACHER)
    @ApiResponse({
        status: HttpStatus.CREATED,
        type: CourseResponseDto,
        description: 'Create course',
    })
    async create(
        @Req() request: AuthenticatedRequest,
        @Body() createCourseDto: CreateCourseDto,
    ) {
        const category = await this.categoryService.findOne({ where: { id: createCourseDto.categoryId } });

        if (!category) {
            throw new BadRequestException('Category not found');
        }
        const course = await this.courseService.create(request.user.id,createCourseDto);

        return course
    }

    @Patch(':id')
    @Roles(Role.TEACHER, Role.ADMIN)
    @ApiParam({
        name: 'id',
        type: String,
        description: 'Course id',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: CourseResponseDto,
        description: 'Update course by id',
    })
    async update(
        @Req() request: AuthenticatedRequest,
        @Body() updateCourseDto:UpdateCourseDto,
        @Param(
            'id',
            new ParseUUIDPipe({
                version: '4',
                errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            }),
        )
        id: string,

    ): Promise<CourseResponseDto> {
        const category = await this.categoryService.findOne({ 
            where: { id: updateCourseDto.categoryId } 
        });

        if (!category) {
            throw new BadRequestException('Category not found');
        }

        const course = await this.courseService.update(
            id,
            request.user.id,
            request.user.role,
            updateCourseDto
        );

        return new CourseResponseDto(course);
    }


    @Delete(':id')
    @Roles(Role.TEACHER, Role.ADMIN)
    @ApiParam({
        name: 'id',
        type: String,
        description: 'Course id',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Delete course by id',
    })
    async delete(
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
        await this.courseService.delete(id,request.user.id, request.user.role);
    }
}