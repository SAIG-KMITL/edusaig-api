import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from 'src/user/dtos/user-response.dto';
import { Pretest } from '../pretest.entity';
import { PaginatedResponse } from 'src/shared/pagination/dtos/paginate-response.dto';

export class PretestResponseDto {
  @ApiProperty({
    description: 'Pretest ID',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

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
    example: 3,
  })
  passingScore: Number;

  @ApiProperty({
    description: 'Max attempts to do exam.',
    type: Number,
    example: 1,
  })
  maxAttempts: Number;

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

  constructor(pretest: Pretest) {
    this.id = pretest.id;
    this.user = pretest.user;
    this.title = pretest.title;
    this.description = pretest.description;
    this.timeLimit = pretest.timeLimit;
    this.passingScore = pretest.passingScore;
    this.maxAttempts = pretest.maxAttempts;
    this.createdAt = pretest.createdAt;
    this.updatedAt = pretest.updatedAt;
  }
}

export class PaginatedPretestResponseDto extends PaginatedResponse(
  PretestResponseDto,
) {
  constructor(
    pretest: Pretest[],
    total: number,
    pageSize: number,
    currentPage: number,
  ) {
    const pretestDtos = pretest.map(
      (pretest) => new PretestResponseDto(pretest),
    );
    super(pretestDtos, total, pageSize, currentPage);
  }
}
