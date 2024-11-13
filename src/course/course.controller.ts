import { Body, Controller, Delete, Get, HttpStatus, Injectable, Param, ParseUUIDPipe, Patch, Post, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CourseService } from "./course.service";
import { CourseResponseDto, CreateCourseDto, UpdateCourseDto } from "./dtos/index";
import { AuthenticatedRequest } from "src/auth/interfaces/authenticated-request.interface";
import { Roles } from "src/shared/decorators/role.decorator";
import { Role } from "src/shared/enums";

@Controller("course")
@ApiTags("Course")
@ApiBearerAuth()
@Injectable()
export class CourseController {
    constructor(private readonly courseService : CourseService) { }
    
    @Get()
    @ApiResponse({
        status: HttpStatus.OK,
        type: CourseResponseDto,
        description: 'Get all course',
        isArray: true,
    })
    async findAll(): Promise<CourseResponseDto[]> {
        const courses = await this.courseService.findAll();
        return courses.map((course) => new CourseResponseDto(course));
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
    ): Promise<CourseResponseDto> {
        const course = await this.courseService.create(request.user.id,createCourseDto);
        return new CourseResponseDto(course);
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
        const course = await this.courseService.update(id,request.user.id,request.user.role, updateCourseDto);
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