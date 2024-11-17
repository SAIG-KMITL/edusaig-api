import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { EnrollmentStatus } from '../enums/enrollment-status.enum';

export class CreateEnrollmentDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: 'User ID',
    type: String,
    format: 'uuid',
  })
  userId: string;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: 'Course ID',
    type: String,
    format: 'uuid',
  })
  courseId: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Certificate issued status',
    type: Boolean,
    default: false,
  })
  certificateIssued?: boolean;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'Completion rate',
    type: Number,
    default: 0,
  })
  completionRate?: number;

  @IsOptional()
  @IsEnum(EnrollmentStatus)
  @ApiProperty({
    description: 'Enrollment status',
    enum: EnrollmentStatus,
    default: EnrollmentStatus.ACTIVE,
  })
  status?: EnrollmentStatus;

  @IsOptional()
  @ApiProperty({
    description: 'Enrollment date',
    type: Date,
    default: new Date(),
  })
  enrolledAt: Date;

  @IsOptional()
  @ApiProperty({
    description: 'Completion date',
    type: Date,
    required: false,
  })
  completedAt?: Date;
}
