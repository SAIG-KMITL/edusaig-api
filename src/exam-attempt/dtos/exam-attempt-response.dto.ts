import { ExamAttemptStatus } from 'src/shared/enums';
import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponse } from 'src/shared/pagination/dtos/paginate-response.dto';
import { ExamResponseDto } from 'src/exam/dtos/exam-response.dto';
import { UserResponseDto } from 'src/user/dtos/user-response.dto';
import { ExamAttempt } from '../exam-attempt.entity';

export class ExamAttemptResponseDto {
  @ApiProperty({
    description: 'Exam Attempy ID',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Exam Data',
    type: String,
    example: {
      id: 'ce2fd59a-28ea-4192-bfc6-c2347450ab7e',
      title: 'Biology',
      description: 'This course is an introduction to biology',
      timeLimit: 20,
      passingScore: 50,
      maxAttempts: 1,
      shuffleQuestions: false,
      status: 'archived',
    },
  })
  exam: ExamResponseDto;

  @ApiProperty({
    description: 'User Data',
    type: String,
    example: {
      id: '389d1065-b898-4249-9d3d-e17e100336a7',
      username: 'johndoe',
      fullname: 'John Doe',
      role: 'student',
      email: 'johndoe@gmail.com',
      profileKey: null,
    },
  })
  user: UserResponseDto;

  @ApiProperty({
    description: 'Score',
    type: String,
    example: 0,
  })
  score: number;

  @ApiProperty({
    description: 'Exam attempt status',
    type: String,
    example: ExamAttemptStatus.IN_PROGRESS,
    enum: ExamAttemptStatus,
  })
  status: ExamAttemptStatus;

  @ApiProperty({
    description: 'Exam attempt start at',
    type: Date,
    example: new Date(),
  })
  startedAt: Date;

  @ApiProperty({
    description: 'Exam attempt submit at',
    type: Date,
    example: new Date(),
  })
  submittedAt: Date;

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

  constructor(examAttempt: ExamAttempt) {
    this.id = examAttempt.id;
    this.exam = examAttempt.exam;
    this.user = examAttempt.user;
    this.score = examAttempt.score;
    this.status = examAttempt.status;
    this.startedAt = examAttempt.startedAt;
    this.submittedAt = examAttempt.submittedAt;
    this.createdAt = examAttempt.createdAt;
    this.updatedAt = examAttempt.updatedAt;
  }
}

export class PaginatedExamAttemptResponseDto extends PaginatedResponse(
  ExamAttemptResponseDto,
) {
  constructor(
    examAttempt: ExamAttempt[],
    total: number,
    pageSize: number,
    currentPage: number,
  ) {
    const examAttemptDtos = examAttempt.map(
      (examAttempt) => new ExamAttemptResponseDto(examAttempt),
    );
    super(examAttemptDtos, total, pageSize, currentPage);
  }
}
