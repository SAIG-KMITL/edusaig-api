import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CourseStatus, Role } from 'src/shared/enums';
import { createPagination } from 'src/shared/pagination';
import { FindOneOptions, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { Course } from './course.entity';
import {
  CreateCourseDto,
  PaginatedCourseResponeDto,
  UpdateCourseDto,
} from './dtos/index';

@Injectable()
export class CourseService {
  constructor(
    @Inject('CourseRepository')
    private readonly courseRepository: Repository<Course>,
  ) {}

  async findAll({
    page = 1,
    limit = 20,
    search = '',
    userId,
    role,
  }: {
    page?: number;
    limit?: number;
    search?: string;
    userId: string;
    role: Role;
  }): Promise<PaginatedCourseResponeDto> {
    const { find } = await createPagination(this.courseRepository, {
      page,
      limit,
    });

    const baseSearch = search ? { title: ILike(`%${search}%`) } : {};
    const whereCondition = this.buildWhereCondition(userId, role, baseSearch);

    const courses = await find({
      where: whereCondition,
      relations: {
        teacher: true,
        category: true,
      },
    }).run();

    return courses;
  }

  async findOne(
    userId: string,
    role: Role,
    options: FindOneOptions<Course>,
  ): Promise<Course> {
    const baseWhere = options.where as FindOptionsWhere<Course>;
    const whereCondition = this.buildWhereCondition(userId, role, baseWhere);

    const course = await this.courseRepository.findOne({
      where: whereCondition,
      relations: {
        teacher: true,
        category: true,
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
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

      return this.courseRepository.save(course);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
    }
  }
  async update(
    id: string,
    userId: string,
    role: Role,
    updateCourseDto: UpdateCourseDto,
  ): Promise<Course> {
    const existingCourse = await this.courseRepository.findOne({
      where: { id },
      relations: {
        teacher: true,
        category: true,
      },
    });

    if (!existingCourse) {
      throw new NotFoundException('Course not found');
    }

    await this.validateUpdatePermissions(existingCourse, userId, role);
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

  async delete(id: string, userId: string, role: Role): Promise<void> {
    if (role === Role.TEACHER) await this.checkOwnership(id, userId);
    try {
      await this.courseRepository.delete(id);
    } catch (error) {
      if (error instanceof Error)
        throw new NotFoundException('Course not found');
    }
  }

  private async checkOwnership(id: string, userId: string): Promise<void> {
    const course = await this.courseRepository.findOne({ where: { id } });
    if (course.teacher.id !== userId)
      throw new BadRequestException("You don't own this course");
  }

  private buildWhereCondition(
    userId: string,
    role: Role,
    baseCondition: FindOptionsWhere<Course> = {},
  ): FindOptionsWhere<Course> | FindOptionsWhere<Course>[] {
    const conditions: Record<
      Role,
      () => FindOptionsWhere<Course> | FindOptionsWhere<Course>[]
    > = {
      [Role.STUDENT]: () => ({
        ...baseCondition,
        status: CourseStatus.PUBLISHED,
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

    const buildCondition = conditions[role];

    if (!buildCondition) {
      throw new BadRequestException('Invalid role');
    }

    return buildCondition();
  }

  private async validateUpdatePermissions(
    course: Course,
    userId: string,
    role: Role,
  ): Promise<void> {
    switch (role) {
      case Role.TEACHER:
        if (course.teacher.id !== userId) {
          throw new ForbiddenException('You can only update your own courses');
        }
        break;

      case Role.ADMIN:
        if (course.status !== CourseStatus.DRAFT) {
          throw new BadRequestException(
            'Admin can only update courses in draft status',
          );
        }
        break;

      default:
        throw new BadRequestException('Invalid role');
    }
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
}
