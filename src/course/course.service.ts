import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindOneOptions, FindOptionsWhere, ILike, Not, Repository } from 'typeorm';
import { Course } from './course.entity';
import {
  CreateCourseDto,
  PaginatedCourseResponeDto,
  UpdateCourseDto,
} from './dtos/index';
import { CourseStatus, Role } from 'src/shared/enums';
import { EnrollmentStatus } from 'src/enrollment/enums/enrollment-status.enum';
import { createPagination } from 'src/shared/pagination';

interface FindAllParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface FindAllWithOwnershipParams extends FindAllParams {
  userId: string;
  role: Role;
}

@Injectable()
export class CourseService {
  constructor(
    @Inject('CourseRepository')
    private readonly courseRepository: Repository<Course>,
  ) {}

  private readonly defaultRelations = {
    teacher: true,
    category: true,
  };

  private readonly defaultPagination = {
    page: 1,
    limit: 20,
  };

  async findAll({
    page = this.defaultPagination.page,
    limit = this.defaultPagination.limit,
    search = '',
  }: FindAllParams): Promise<PaginatedCourseResponeDto> {
    const { find } = await this.createPaginatedQuery({ page, limit });
    const whereClause = this.buildSearchClause(search, { 
      status: CourseStatus.PUBLISHED 
    });

    return find({
      where: whereClause,
      relations: this.defaultRelations,
    }).run();
  }

  async newArrival({
    page = this.defaultPagination.page,
    limit = this.defaultPagination.limit,
    search = '',
  }: FindAllParams): Promise<PaginatedCourseResponeDto> {
    const { find } = await this.createPaginatedQuery({ page, limit });
    const whereClause = this.buildSearchClause(search, { 
      status: CourseStatus.PUBLISHED 
    });

    return find({
      where: whereClause,
      relations: this.defaultRelations,
      order: {
        createdAt: 'DESC'
      }
    }).run();
  }
  

  async mostEnroll({
    page = this.defaultPagination.page,
    limit = this.defaultPagination.limit,
    search = '',
  }: FindAllParams): Promise<PaginatedCourseResponeDto> {
    const skip = (page - 1) * limit;
    
    const queryBuilder = this.courseRepository.createQueryBuilder('course')
      .leftJoinAndSelect('course.teacher', 'teacher')
      .leftJoinAndSelect('course.category', 'category')
      .leftJoin('course.enrollments', 'enrollment')
      .where('course.status = :status', { status: CourseStatus.PUBLISHED });
  
    if (search) {
      queryBuilder.andWhere('course.title ILIKE :search', { search: `%${search}%` });
    }
  
    const courses = await queryBuilder
      .groupBy('course.id, teacher.id, category.id')
      .addSelect('COUNT(enrollment.id)', 'enrollmentCount')
      .orderBy('COUNT(enrollment.id)', 'DESC')
      .skip(skip)
      .take(limit)
      .getRawAndEntities();
  
    const total = await queryBuilder.getCount();
  
    const transformedCourses = courses.entities.map((course, index) => ({
      ...course,
      enrollmentCount: parseInt(courses.raw[index].enrollmentCount)
    }));

    return new PaginatedCourseResponeDto(
      transformedCourses,
      total,
      limit,
      page
    );
  }
  
  
  async findAllWithOwnership({
    page = this.defaultPagination.page,
    limit = this.defaultPagination.limit,
    search = '',
    userId,
    role,
  }: FindAllWithOwnershipParams): Promise<PaginatedCourseResponeDto> {
    const { find } = await this.createPaginatedQuery({ page, limit });
    const baseSearch = this.buildSearchClause(search);
    const whereCondition = this.buildWhereCondition(userId, role, baseSearch);

    return find({
      where: whereCondition,
      relations: this.defaultRelations,
    }).run();
  }

  async getAllCourseByTeacherId({
    page = this.defaultPagination.page,
    limit = this.defaultPagination.limit,
    search = '',
    teacherId,
  }: FindAllParams & { teacherId: string }): Promise<PaginatedCourseResponeDto> {
    const { find } = await this.createPaginatedQuery({ page, limit });
    const whereClause = this.buildSearchClause(search, { 
      teacher: { id: teacherId }
    });

    return find({
      where: whereClause,
      relations: this.defaultRelations,
    }).run();
  }

  async findOne(options: FindOneOptions<Course>): Promise<Course> {
    const course = await this.courseRepository.findOne({
      ...options,
      relations: this.defaultRelations,
    });

    return this.ensureCourseExists(course);
  }

  async findOneWithOwnership(
    userId: string,
    role: Role,
    options: FindOneOptions<Course>,
  ): Promise<Course> {
    const baseWhere = options.where as FindOptionsWhere<Course>;
    const whereCondition = this.buildWhereCondition(userId, role, baseWhere);

    const course = await this.courseRepository.findOne({
      where: whereCondition,
      relations: this.defaultRelations,
    });

    return this.ensureCourseExists(course);
  }

  async create(
    userId: string,
    createCourseDto: CreateCourseDto,
  ): Promise<Course> {
    try {
      const course = this.courseRepository.create({
        ...createCourseDto,
        teacher: { id: userId },
        category: { id: createCourseDto.categoryId },
      });

      return await this.courseRepository.save(course);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const existingCourse = await this.findOne({ where: { id } });
    
    this.validateStatusTransition(
      existingCourse.status,
      updateCourseDto.status,
    );

    const updatedCourse = await this.courseRepository.save({
      ...existingCourse,
      ...updateCourseDto,
      category: { id: updateCourseDto.categoryId },
    });

    return updatedCourse;
  }

  async remove(id: string): Promise<Course> {
    const course = await this.findOne({ where: { id } });
    return await this.courseRepository.remove(course);
  }

  async validateOwnership(id: string, userId: string): Promise<void> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: { teacher: true },
    });
    this.ensureCourseExists(course);
    
    if (course.teacher.id !== userId) {
      throw new BadRequestException('You can only access your own courses');
    }
  }

  private async createPaginatedQuery({ page, limit }: { page: number; limit: number }) {
    return await createPagination(this.courseRepository, { page, limit });
  }

  private buildSearchClause(search: string, additionalCriteria = {}): FindOptionsWhere<Course> {
    return {
      ...additionalCriteria,
      ...(search ? { title: ILike(`%${search}%`) } : {}),
    };
  }

  private buildWhereCondition(
    userId: string,
    role: Role,
    baseCondition: FindOptionsWhere<Course> = {},
  ): FindOptionsWhere<Course> | FindOptionsWhere<Course>[] {
    const roleConditions: Record<
      Role,
      () => FindOptionsWhere<Course> | FindOptionsWhere<Course>[]
    > = {
      [Role.STUDENT]: () => ({
        ...baseCondition,
        status: CourseStatus.PUBLISHED,
        enrollments: {
          user: { id: userId },
          status: Not(EnrollmentStatus.DROPPED),
        },
      }),
      [Role.TEACHER]: () => [
        {
          ...baseCondition,
          status: CourseStatus.PUBLISHED,
        },
        {
          ...baseCondition,
          teacher: { id: userId },
        },
      ],
      [Role.ADMIN]: () => baseCondition,
    };

    const buildCondition = roleConditions[role];
    if (!buildCondition) {
      throw new BadRequestException('Invalid role');
    }

    return buildCondition();
  }

  private validateStatusTransition(
    currentStatus: CourseStatus,
    newStatus?: CourseStatus,
  ): void {
    if (!newStatus) return;

    if (
      currentStatus !== CourseStatus.DRAFT &&
      newStatus === CourseStatus.DRAFT
    ) {
      throw new BadRequestException(
        `Cannot change status back to draft when current status is ${currentStatus}`,
      );
    }
  }

  private ensureCourseExists(course: Course | null): Course {
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }
}