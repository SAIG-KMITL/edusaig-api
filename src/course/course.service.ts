import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { FindOneOptions, Repository } from "typeorm";
import { Course } from "./course.entity";
import { UpdateCourseDto,CreateCourseDto } from "./dtos/index";



@Injectable()
export class CourseService {
    constructor(
        @Inject("CourseRepository")
        private readonly courseRepository: Repository<Course>,
    ) { }

    async findAll(): Promise<Course[]> {
        return this.courseRepository.find();
    }

    async findOne(options: FindOneOptions<Course>): Promise<Course> {
        const course = this.courseRepository.findOne(options);
        if (!course)
            throw new NotFoundException("Course not found");
        return course;
    }

    async create(createCourseDto: CreateCourseDto): Promise<Course> {
        try {
            return this.courseRepository.save(createCourseDto);
        } catch (error) {
            if (error instanceof Error) 
                throw new BadRequestException(error.message);
        }
    }

    async update(id: string,userId: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
        try {
            await this.checkOwnership(id, userId);
            await this.courseRepository.update(id, updateCourseDto);
            return await this.findOne({ where: { id } });
        } catch (error) {
            if (error instanceof Error)
                throw new NotFoundException("Course not found");
        }
    }

    async delete(id: string, userId : string): Promise<void> {
        try {
            await this.checkOwnership(id, userId);
            await this.courseRepository.delete(id);
        } catch (error) {
            if (error instanceof Error)
                throw new NotFoundException("Course not found");
        }
    }

    private async checkOwnership(id: string, teacherId: string): Promise<void> {
        const course = await this.findOne({ where: { id } });
        if (course.teacher.id !== teacherId)
            throw new BadRequestException("You don't own this course");
    }

}