import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createPagination } from 'src/shared/pagination';
import { FindOneOptions, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { CreateEnrollmentDto } from './dtos/create-enrollment.dto';
import { PaginatedEnrollmentResponseDto } from './dtos/enrollment-response.dto';
import { UpdateEnrollmentDto } from './dtos/update-enrollment.dto';
import { Enrollment } from './enrollment.entity';
import { EnrollmentStatus } from './enums/enrollment-status.enum';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
  ) {}

  async findAll({
    page = 1,
    limit = 20,
  }: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedEnrollmentResponseDto> {
    const { find } = await createPagination(this.enrollmentRepository, {
      page,
      limit,
    });

    const enrollments = await find({
      relations: {
        user: true,
        course: true,
      },
    }).run();

    return enrollments;
  }

  async findOne(where: FindOptionsWhere<Enrollment>): Promise<Enrollment> {
    const options: FindOneOptions<Enrollment> = {
      where,
      relations: {
        user: true,
        course: true,
      },
    };

    const enrollment = await this.enrollmentRepository.findOne(options);

    if (!enrollment) throw new NotFoundException('Enrollment not found');

    return enrollment;
  }

  async findAllByUser(
    userId: string,
    {
      page = 1,
      limit = 20,
    }: {
      page?: number;
      limit?: number;
    },
  ): Promise<PaginatedEnrollmentResponseDto> {
    const { find } = await createPagination(this.enrollmentRepository, {
      page,
      limit,
    });

    const enrollments = await find({
      where: {
        user: { id: userId },
      },
      relations: {
        user: true,
        course: true,
      },
    }).run();

    return enrollments;
  }

  async create(createEnrollmentDto: CreateEnrollmentDto): Promise<Enrollment> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: {
        user: { id: createEnrollmentDto.userId },
        course: { id: createEnrollmentDto.courseId },
      },
    });
    if (enrollment) throw new ConflictException('Enrollment already exists');
    try {
      const createdEnrollment =
        this.enrollmentRepository.create(createEnrollmentDto);
      return await this.enrollmentRepository.save({
        ...createdEnrollment,
        user: { id: createEnrollmentDto.userId },
        course: { id: createEnrollmentDto.courseId },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(
    id: string,
    updateEnrollmentDto: UpdateEnrollmentDto,
  ): Promise<Enrollment> {
    const enrollment = await this.findOne({
      status: EnrollmentStatus.ACTIVE,
      id,
    });
    this.enrollmentRepository.merge(enrollment, updateEnrollmentDto);
    await this.enrollmentRepository.save(enrollment);
    return enrollment;
  }

  async remove(id: string): Promise<void> {
    const enrollment = await this.findOne({
      id,
    });
    await this.enrollmentRepository.remove(enrollment);
  }
}
