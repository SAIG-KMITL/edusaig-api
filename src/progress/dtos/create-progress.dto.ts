import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { ProgressStatus } from '../enums/progress-status.enum';

export class CreateProgressDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: 'Enrollment ID',
    type: String,
  })
  enrollmentId: string;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: 'Chapter ID',
    type: String,
  })
  chapterId: string;

  @IsOptional()
  @IsEnum(ProgressStatus)
  @ApiProperty({
    description: 'Progress status',
    enum: ProgressStatus,
    default: ProgressStatus.ACTIVE,
  })
  status?: ProgressStatus;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'Watch time',
    type: Number,
    default: 0,
  })
  watchTime?: number;

  @IsOptional()
  @ApiProperty({
    description: 'Last accessed date',
    type: Date,
    default: new Date(),
  })
  lastAccessedAt?: Date;

  @IsOptional()
  @ApiProperty({
    description: 'Completion date',
    type: Date,
  })
  completedAt?: Date;
}
