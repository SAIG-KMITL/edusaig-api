import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { Repository, FindOneOptions, ILike, FindOptionsWhere, FindOptionsSelect } from "typeorm";
import { Exam } from "./exam.entity";
import { CreateExamDto } from "./dtos/create-exam.dto";
import { PaginatedExamResponseDto } from "./dtos/exam-response.dto";
import { createPagination } from "src/shared/pagination";
import { ExamStatus, Role } from "src/shared/enums";
import { AuthenticatedRequest } from "src/auth/interfaces/authenticated-request.interface";
import { UpdateExamDto } from "./dtos/update-exam.dto";

@Injectable()
export class ExamService {
    constructor(
        @Inject('ExamRepository')
        private readonly examRepository: Repository<Exam>,
    ) { }

    async findAll(request: AuthenticatedRequest, {
        page = 1,
        limit = 20,
        search = '',
    }: {
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<PaginatedExamResponseDto> {
        const { find } = await createPagination(this.examRepository, {
            page,
            limit,
        });

        const whereCondition = this.validateAndCreateCondition(request, search)
        const exam = await find({
            where: whereCondition,
            relations: {
                // Only load courseModule relation, not course or teacher
                courseModule: true,
            },
        }).run();

        return exam;
    }

    private validateAndCreateCondition(request: AuthenticatedRequest, search: string): FindOptionsWhere<Exam> {
        const baseSearch = search ? { title: ILike(`%${search}%`) } : {};

        if (request.user.role === Role.STUDENT) {
            return { ...baseSearch, status: ExamStatus.PUBLISHED };
        }

        if (request.user.role === Role.TEACHER) {
            return {
                ...baseSearch,
                courseModule: {
                    course: {
                        teacher: {
                            id: request.user.id,
                        }
                    }
                }
            };
        }

        if (request.user.role === Role.ADMIN) {
            return { ...baseSearch };
        }

        return { ...baseSearch, status: ExamStatus.PUBLISHED };
    }

    async findOne(request: AuthenticatedRequest, options: FindOneOptions<Exam> = {}): Promise<Exam> {
        const whereCondition = this.validateAndCreateCondition(request, '');

        const exam = await this.examRepository.findOne({
            ...options,
            where: whereCondition,
            relations: {
                courseModule: true,
            },
        });

        if (!exam) {
            throw new NotFoundException('Exam not found');
        }

        return exam;
    }

    async createExam(createExamDto: CreateExamDto): Promise<Exam> {
        const ExamModule = this.examRepository.create(createExamDto);
        await this.examRepository.save(ExamModule);
        if (!ExamModule)
            throw new NotFoundException("Can't create exam");
        return ExamModule;
    }

    async updateExam(request: AuthenticatedRequest, id: string, updateExamDto: UpdateExamDto): Promise<Exam> {
        const examInData = await this.findOne(request, { where: { id } })
        if (examInData.status != ExamStatus.DRAFT && updateExamDto.status == ExamStatus.DRAFT) {
            throw new NotFoundException("Can't change status to draft");
        }
        const exam = await this.examRepository.update(id, updateExamDto);
        if (!exam)
            throw new NotFoundException("Can't update exam");
        return await this.examRepository.findOne({ where: { id } });
    }

    async deleteExam(request: AuthenticatedRequest, id: string): Promise<void> {
        try {
            if (await this.findOne(request, { where: { id } })) {
                await this.examRepository.delete(id);
            }
        } catch (error) {
            if (error instanceof Error) throw new NotFoundException('Exam not found');
        }
    }
}