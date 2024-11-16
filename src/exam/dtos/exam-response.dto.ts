import { ExamStatus } from 'src/shared/enums';
import { Exam } from '../exam.entity';
import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponse } from 'src/shared/pagination/dtos/paginate-response.dto';
import { CourseModuleResponseDto } from 'src/course-module/dtos/course-module-response.dto';

export class ExamResponseDto {
  @ApiProperty({
    description: 'Exam ID',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Course Module Data',
    type: String,
    example: {
      id: 'b88d68fc-7437-4812-b4f6-e08f18bc09d1',
      title: 'Thai',
      description: 'This module is an introduction to programming',
      orderIndex: 1,
    },
  })
  courseModule: CourseModuleResponseDto;

  @ApiProperty({
    description: 'Exam title',
    type: String,
    example: 'Exam title',
  })
  title: string;

  @ApiProperty({
    description: 'Exam description',
    type: String,
    example: 'Exam description',
  })
  description: string;

  @ApiProperty({
    description: 'Timelimit to do exam.',
    type: Number,
    example: 20,
  })
  timeLimit: Number;

  @ApiProperty({
    description: 'Score to pass exam.',
    type: Number,
    example: 20,
  })
  passingScore: Number;

  @ApiProperty({
    description: 'Max attempts to do exam.',
    type: Number,
    example: 1,
  })
  maxAttempts: Number;

  @ApiProperty({
    description: 'Shuffle question',
    type: Boolean,
    example: false,
  })
  shuffleQuestions: Boolean;

  @ApiProperty({
    description: 'Exam status',
    type: String,
    enum: ExamStatus,
    example: ExamStatus.DRAFT,
  })
  status: ExamStatus;

  @ApiProperty({
    description: 'Exam created date',
    type: Date,
    example: new Date(),
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Exam updated date',
    type: Date,
    example: new Date(),
  })
  updatedAt: Date;

  constructor(exam: Exam) {
    this.id = exam.id;
    this.courseModule = exam.courseModule;
    this.title = exam.title;
    this.description = exam.description;
    this.timeLimit = exam.timeLimit;
    this.passingScore = exam.passingScore;
    this.maxAttempts = exam.maxAttempts;
    this.shuffleQuestions = exam.shuffleQuestions;
    this.status = exam.status;
    this.createdAt = exam.createdAt;
    this.updatedAt = exam.updatedAt;
  }
}

export class PaginatedExamResponseDto extends PaginatedResponse(
  ExamResponseDto,
) {
  constructor(
    exam: Exam[],
    total: number,
    pageSize: number,
    currentPage: number,
  ) {
    const examDtos = exam.map((exam) => new ExamResponseDto(exam));
    super(examDtos, total, pageSize, currentPage);
  }
}
