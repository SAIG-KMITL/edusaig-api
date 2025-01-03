import { ExamAttemptStatus } from 'src/shared/enums';
import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponse } from 'src/shared/pagination/dtos/paginate-response.dto';
import { UserResponseDto } from 'src/user/dtos/user-response.dto';
import { ExamAttempt } from '../exam-attempt.entity';
import { PretestResponseDto } from 'src/pretest/dtos/pretest-response.dto';

export class ExamAttemptPretestResponseDto {
  @ApiProperty({
    description: 'Exam Attempy ID',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Pretest Data',
    type: PretestResponseDto,
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Exam title',
      description: 'Exam description',
      timeLimit: 20,
      passingScore: 3,
      maxAttempts: 1,
      createdAt: '2024-11-26T11:10:00.257Z',
      updatedAt: '2024-11-26T11:10:00.257Z',
    },
  })
  pretest: PretestResponseDto;

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

  constructor(examAttempt: ExamAttempt) {
    this.id = examAttempt.id;
    this.pretest = examAttempt.pretest;
    this.user = examAttempt.user;
    this.score = examAttempt.score;
    this.status = examAttempt.status;
    this.startedAt = examAttempt.startedAt;
    this.submittedAt = examAttempt.submittedAt;
  }
}

export class PaginatedExamAttemptPretestResponseDto extends PaginatedResponse(
  ExamAttemptPretestResponseDto,
) {
  constructor(
    examAttempt: ExamAttempt[],
    total: number,
    pageSize: number,
    currentPage: number,
  ) {
    const examAttemptDtos = examAttempt.map(
      (examAttempt) => new ExamAttemptPretestResponseDto(examAttempt),
    );
    super(examAttemptDtos, total, pageSize, currentPage);
  }
}
