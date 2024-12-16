import { ApiProperty } from '@nestjs/swagger';
import { ChapterResponseDto } from 'src/chapter/dtos/chapter-response.dto';
import { EnrollmentResponseDto } from 'src/enrollment/dtos/enrollment-response.dto';
import { PaginatedResponse } from 'src/shared/pagination/dtos/paginate-response.dto';
import { ProgressStatus } from '../enums/progress-status.enum';
import { Progress } from '../progress.entity';

export class ProgressResponseDto {
  @ApiProperty({
    description: 'Progress ID',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Enrollment data',
    type: EnrollmentResponseDto,
  })
  enrollment: EnrollmentResponseDto;

  @ApiProperty({
    description: 'Chapter data',
    type: ChapterResponseDto,
  })
  chapter: ChapterResponseDto;

  @ApiProperty({
    description: 'Progress status',
    enum: ProgressStatus,
  })
  status: ProgressStatus;

  @ApiProperty({
    description: 'Watch time',
    type: Number,
  })
  watchTime: number;

  @ApiProperty({
    description: 'Last accessed date',
    type: Date,
  })
  lastAccessedAt: Date;

  @ApiProperty({
    description: 'Completion date',
    type: Date,
    nullable: true,
  })
  completedAt: Date;

  @ApiProperty({
    description: 'Created date',
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Updated date',
    type: Date,
  })
  updatedAt: Date;

  constructor(progress: Progress) {
    this.id = progress.id;
    this.enrollment = new EnrollmentResponseDto(progress.enrollment);
    this.chapter = new ChapterResponseDto(progress.chapter);
    this.status = progress.status;
    this.watchTime = progress.watchTime;
    this.lastAccessedAt = progress.lastAccessedAt;
    this.completedAt = progress.completedAt;
    this.createdAt = progress.createdAt;
  }
}

export class PaginatedProgressResponseDto extends PaginatedResponse(
  ProgressResponseDto,
) {
  constructor(
    progress: Progress[],
    total: number,
    page: number,
    limit: number,
  ) {
    super(
      progress.map((progress) => new ProgressResponseDto(progress)),
      total,
      page,
      limit,
    );
  }
}
