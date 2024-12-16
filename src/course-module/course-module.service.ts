import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createPagination } from 'src/shared/pagination';
import { FindOneOptions, FindOptionsWhere, ILike, Not, Repository } from 'typeorm';
import { CourseModule } from './course-module.entity';
import { PaginatedCourseModuleResponseDto } from './dtos/course-module-response.dto';
import { CreateCourseModuleDto } from './dtos/create-course-module.dto';
import { UpdateCourseModuleDto } from './dtos/update-course-module.dto';
import { CourseStatus, Role } from 'src/shared/enums';
import { EnrollmentStatus } from 'src/enrollment/enums/enrollment-status.enum';

@Injectable()
export class CourseModuleService {
  constructor(
    @Inject('CourseModuleRepository')
    private readonly courseModuleRepository: Repository<CourseModule>,
  ) { }

  async findAll({
    page = 1,
    limit = 20,
    search = '',
  }: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedCourseModuleResponseDto> {
    const { find } = await createPagination(this.courseModuleRepository, { page, limit });
    const baseSearch = {
      course : {
        status: CourseStatus.PUBLISHED
      },
      ...(search ? { title: ILike(`%${search}%`) } : {}),
    };
    const courseModules = await find({
      where: baseSearch,
      relations: {
        course: true,
      },
      
    }).run();
    return courseModules
  }
  async findOne(
    options: FindOneOptions<CourseModule>,
  ): Promise<CourseModule> {
    const courseModule = await this.courseModuleRepository.findOne({
      ...options,
      relations: {
        course: true,
      },
      where: {
        ...options.where,
        course: {
          status: CourseStatus.PUBLISHED
        },
      },
    });
    
    if (!courseModule) throw new NotFoundException('Course Module not found');
    return courseModule;
  }

  async findByCourseId(courseId: string): Promise<CourseModule[]> {
    const courseModules = await this.courseModuleRepository.find({
      where: { 
        course: {
          id: courseId,
          status: CourseStatus.PUBLISHED
        }
      },
      relations: {
        course: true,
      },
    });

    return courseModules;
  }
  async validateAndGetNextOrderIndex(courseId: string): Promise<number> {
    const existingModules = await this.courseModuleRepository.find({
      where: { courseId },
      order: { orderIndex: 'DESC' },
    });

    const orderIndices = existingModules.map((module) => module.orderIndex);
    const hasDuplicates = new Set(orderIndices).size !== orderIndices.length;

    if (hasDuplicates) {
      throw new BadRequestException(
        'Duplicate orderIndex values detected in course modules',
      );
    }

    return existingModules.length > 0 ? existingModules[0].orderIndex + 1 : 1;
  }

  async create(
    createCourseModuleDto: CreateCourseModuleDto,
  ): Promise<CourseModule> {
    let orderIndex = await this.validateAndGetNextOrderIndex(
      createCourseModuleDto.courseId,
    );
    const courseModule = this.courseModuleRepository.create({
      ...createCourseModuleDto,
      orderIndex: orderIndex,
    });
    await this.courseModuleRepository.save(courseModule);

    return courseModule;
  }

  async reorderModules(courseId: string, startIndex: number): Promise<void> {
    const modulesToReorder = await this.courseModuleRepository.find({
      where: { courseId },
      order: { orderIndex: 'ASC' },
    });

    for (let i = 0; i < modulesToReorder.length; i++) {
      modulesToReorder[i].orderIndex = i + 1;
    }

    await this.courseModuleRepository.save(modulesToReorder);
  }

  async update(
    id: string,
    updateCourseModuleDto: UpdateCourseModuleDto,
  ): Promise<CourseModule> {
    const courseModule = await this.courseModuleRepository.findOne({
      where: { id },
    });

    if (!courseModule) {
      throw new BadRequestException('Course module not found');
    }
    if (updateCourseModuleDto.orderIndex != null) {
      await this.validateOrderIndex(
        courseModule.courseId,
        updateCourseModuleDto.orderIndex,
      );
    }
    if (
      updateCourseModuleDto.orderIndex &&
      updateCourseModuleDto.orderIndex !== courseModule.orderIndex
    ) {
      const existingModule = await this.courseModuleRepository.findOne({
        where: {
          courseId: courseModule.courseId,
          orderIndex: updateCourseModuleDto.orderIndex,
        },
      });

      if (existingModule) {
        await this.courseModuleRepository.update(existingModule.id, {
          orderIndex: courseModule.orderIndex,
        });
      }
    }

    Object.assign(courseModule, updateCourseModuleDto);
    await this.courseModuleRepository.save(courseModule);

    return courseModule;
  }

  async remove(id: string): Promise<CourseModule> {
    const courseModule = await this.courseModuleRepository.findOne({
      where: { id },
    });

    if (!courseModule) {
      throw new BadRequestException('Course module not found');
    }

    const result = await this.courseModuleRepository.remove(courseModule);

    await this.reorderModules(courseModule.courseId, courseModule.orderIndex);

    return result;
  }
  private async validateOrderIndex(
    courseId: string,
    orderIndex: number,
  ): Promise<void> {
    const existingModules = await this.courseModuleRepository.find({
      where: { courseId },
      order: { orderIndex: 'ASC' },
    });
    if (existingModules.length === 0) {
      if (orderIndex !== 1) {
        throw new BadRequestException(
          'Order index should be 1 when there are no modules in the course',
        );
      }
      return;
    }
    const minIndex = 1;
    const maxIndex = existingModules[existingModules.length - 1].orderIndex;

    if (orderIndex < minIndex || orderIndex > maxIndex) {
      throw new BadRequestException(`Order index is invalid`);
    }
  }
  async validateOwnership(id: string, userId: string): Promise<void> {
    const courseModule = await this.courseModuleRepository.findOne({
      where: { id },
      relations: { course: { teacher: true } },
    });
    if (!courseModule) throw new NotFoundException('Course Module not found');
    if (courseModule.course.teacher.id !== userId)
      throw new BadRequestException('You can only access your own courses');
  }
  private buildWhereCondition(
    userId: string,
    role: Role,
    baseCondition: FindOptionsWhere<CourseModule> = {},
  ) {
    const conditions: Record<
      Role,
      () => FindOptionsWhere<CourseModule> | FindOptionsWhere<CourseModule>[]
    > = {
      [Role.STUDENT]: () => ({
        ...baseCondition,
        course: {
          status: CourseStatus.PUBLISHED,
          enrollments: {
            user: { id: userId },
            status: Not(EnrollmentStatus.DROPPED),
          },
        },
      }),
      [Role.TEACHER]: () => [
        {
          ...baseCondition,
          course: {
            status: CourseStatus.PUBLISHED,
          },
        },
        {
          ...baseCondition,
          course: {
            teacher: {
              id: userId,
            },
          },
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

  async findAllWithOwnership({
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
  }): Promise<PaginatedCourseModuleResponseDto> {
    const { find } = await createPagination(this.courseModuleRepository, {
      page,
      limit,
    });

    const baseSearch = search ? { title: ILike(`%${search}%`) } : {};
    const whereCondition = this.buildWhereCondition(userId, role, baseSearch);

    const courseModules = await find({
      where: whereCondition,
      relations: {
        course: true,
      },
    }).run();

    return courseModules;
  }

  async findOneWithOwnership(
    userId: string,
    role: Role,
    options: FindOneOptions<CourseModule>,
  ): Promise<CourseModule> {
    const baseWhere = options.where as FindOptionsWhere<CourseModule>;
    const whereCondition = this.buildWhereCondition(userId, role, baseWhere);

    const courseModule = await this.courseModuleRepository.findOne({
      where: whereCondition,
      relations: {
        course: true,
      },
    });

    if (!courseModule) {
      throw new NotFoundException('Course Module not found');
    }

    return courseModule;
  }
}
