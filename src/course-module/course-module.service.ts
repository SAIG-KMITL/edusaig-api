import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createPagination } from 'src/shared/pagination';
import { FindOneOptions, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { CourseModule } from './course-module.entity';
import { PaginatedCourseModuleResponseDto } from './dtos/course-module-response.dto';
import { CreateCourseModuleDto } from './dtos/create-course-module.dto';
import { UpdateCourseModuleDto } from './dtos/update-course-module.dto';

@Injectable()
export class CourseModuleService {
  constructor(
    @Inject('CourseModuleRepository')
    private readonly courseModuleRepository: Repository<CourseModule>,
  ) {}

  async findAll({
    page = 1,
    limit = 20,
    search = '',
  }: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedCourseModuleResponseDto> {
    const { find } = await createPagination(this.courseModuleRepository, {
      page,
      limit,
    });

    const baseSearch = search ? { title: ILike(`%${search}%`) } : {};
    const whereCondition = { ...baseSearch };

    const courseModules = await find({
      where: whereCondition,
      relations: {
        course: true,
      },
    }).run();

    return courseModules;
  }

  async findOne(
    id: string,
    options: FindOneOptions<CourseModule>,
  ): Promise<CourseModule> {
    const baseWhere = options.where as FindOptionsWhere<CourseModule>;
    const whereCondition = { ...baseWhere, id };

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

  async findByCourseId(courseId: string): Promise<CourseModule[]> {
    const courseModules = await this.courseModuleRepository.find({
      where: { courseId },
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
    if (!createCourseModuleDto.orderIndex) {
      createCourseModuleDto.orderIndex =
        await this.validateAndGetNextOrderIndex(createCourseModuleDto.courseId);
    } else {
      const existingModule = await this.courseModuleRepository.findOne({
        where: {
          courseId: createCourseModuleDto.courseId,
          orderIndex: createCourseModuleDto.orderIndex,
        },
      });

      if (existingModule) {
        throw new BadRequestException(
          `Module with orderIndex ${createCourseModuleDto.orderIndex} already exists in this course`,
        );
      }
    }

    const courseModule = this.courseModuleRepository.create(
      createCourseModuleDto,
    );
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
        throw new BadRequestException(
          `Module with orderIndex ${updateCourseModuleDto.orderIndex} already exists in this course`,
        );
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
}
