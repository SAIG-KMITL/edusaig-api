import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './course.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  async findAll(): Promise<Course[]> {
    return this.courseRepository.find({
      relations: ['teacher'],
    });
  }
  async findOne(id: string): Promise<Course> {
    const course = await this.courseRepository.findOne({ where: { id } });
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }

  async findByTeacher(teacherId: string): Promise<Course[]> {
    return this.courseRepository.find({ where: { teacherId } });
  }

  async create(courseData: Partial<Course>): Promise<Course> {
    console.log('Course Data : ', courseData);
    const course = await this.courseRepository.create(courseData);
    console.log('Course : ', course);
    return this.courseRepository.save(course);
  }

  async update(id: string, courseData: Partial<Course>): Promise<Course> {
    await this.courseRepository.update(id, courseData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.courseRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
  }
}
