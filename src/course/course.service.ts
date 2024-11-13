import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { Course } from "./course.entity";
import { UpdateCourseDto,CreateCourseDto } from "./dtos/index";
import { CourseStatus, Role } from "src/shared/enums";



@Injectable()
export class CourseService {
    constructor(
        @Inject("CourseRepository")
        private readonly courseRepository: Repository<Course>,
    ) { }

    async findAll(): Promise<Course[]> {
        return this.courseRepository.find({
            relations: {
                teacher: true,
            },
        });
    }

    async findOne(
        userId: string,
        role: Role,
        options: FindOneOptions<Course>
    ): Promise<Course> {
        switch (role) {
            case Role.STUDENT:
                options.where = {
                    ...(options.where as FindOptionsWhere<Course>),
                    status: CourseStatus.PUBLISHED
                };
                break;
    
            case Role.TEACHER:
                options.where = [
                    {
                        ...(options.where as FindOptionsWhere<Course>),
                        status: CourseStatus.PUBLISHED
                    },
                    {
                        ...(options.where as FindOptionsWhere<Course>),
                        teacher: { id: userId }
                    }
                ];
                break;
    
            case Role.ADMIN:
                break;
    
            default:
                throw new BadRequestException("Invalid role");
        }
    
        const course = await this.courseRepository.findOne({
            where: options.where,
            relations: {
                teacher: true
            }
        });
    
        if (!course) {
            throw new NotFoundException("Course not found");
        }
        
        return course;
    }

    async create(userId: string, createCourseDto: CreateCourseDto): Promise<Course> {
        try {
            return this.courseRepository.save({ ...createCourseDto, teacher: { id: userId }
            });
        } catch (error) {
            if (error instanceof Error) 
                throw new BadRequestException(error.message);
        }
    }

    async update(id: string,userId: string,role: Role, updateCourseDto: UpdateCourseDto): Promise<Course> {
        const status = await this.checkCourseStatus(id);
        

        switch (role) {
            case Role.TEACHER:
                await this.checkOwnership(id, userId);
                break;
            case Role.ADMIN:
                if (status !== CourseStatus.DRAFT)
                    throw new BadRequestException("Only draft courses can be updated by an admin");
            default:
                throw new BadRequestException("Invalid role");
        }


        if (status !== CourseStatus.DRAFT && updateCourseDto.status === CourseStatus.DRAFT)
            throw new BadRequestException("You can't update the status of a published or archived course to draft"); 

        try {
            await this.courseRepository.update(id, updateCourseDto);
            return await this.courseRepository.findOne({ where: { id },
                relations : {
                    teacher: true,
                }
            });
        } catch (error) {
            if (error instanceof Error)
                throw new NotFoundException("Course not found");
        }
    }

    async delete(id: string, userId : string ,role: Role): Promise<void> {
        if (role === Role.TEACHER)
            await this.checkOwnership(id, userId);
        try {
            await this.courseRepository.delete(id);
        } catch (error) {
            if (error instanceof Error)
                throw new NotFoundException("Course not found");
        }
    }

    private async checkOwnership(id: string, userId: string): Promise<void> {
        const course = await this.courseRepository.findOne({ where: { id } });
        if (course.teacher.id !== userId)
            throw new BadRequestException("You don't own this course");
    }
    private async checkCourseStatus(id: string): Promise<CourseStatus> {   
        const course = await this.courseRepository.findOne({ where: { id } });
        return course.status;
    }
}
