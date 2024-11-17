import {
    BadRequestException,
    Injectable,
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
    ) { }

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

    async findOne(
        id: string,
        options: FindOneOptions<Enrollment>,
    ): Promise<Enrollment> {
        const baseWhere = options.where as FindOptionsWhere<Enrollment>;
        const whereCondition = { ...baseWhere, id };

        const enrollment = await this.enrollmentRepository.findOne({
            where: whereCondition,
            relations: {
                user: true,
                course: true,
            },
        });

        if (!enrollment) {
            throw new NotFoundException('Enrollment not found');
        }

        return enrollment;
    }

    async create(createEnrollmentDto: CreateEnrollmentDto): Promise<Enrollment> {
        const enrollment = this.enrollmentRepository.create(createEnrollmentDto);
        await this.enrollmentRepository.save(enrollment);

        return enrollment;
    }

    async update(
        id: string,
        updateEnrollmentDto: UpdateEnrollmentDto,
    ): Promise<Enrollment> {
        const enrollment = await this.findOne(id, {
            where: { status: EnrollmentStatus.ACTIVE },
        });
        this.enrollmentRepository.merge(enrollment, updateEnrollmentDto);
        await this.enrollmentRepository.save(enrollment);

        return enrollment;
    }

    async remove(id: string): Promise<void> {
        const enrollment = await this.findOne(id, {
            where: { id },
        });
        await this.enrollmentRepository.remove(enrollment);
    }
}
