import { ApiProperty } from '@nestjs/swagger';
import { CourseResponseDto } from 'src/course/dtos';
import { PaginatedResponse } from 'src/shared/pagination/dtos/paginate-response.dto';
import { UserResponseDto } from 'src/user/dtos/user-response.dto';
import { Enrollment } from '../enrollment.entity';
import { EnrollmentStatus } from '../enums/enrollment-status.enum';

export class EnrollmentResponseDto {
  @ApiProperty({
    description: 'Enrollment ID',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'User data',
    type: UserResponseDto,
  })
  user: UserResponseDto;

  @ApiProperty({
    description: 'Course data',
    type: CourseResponseDto,
  })
  course: CourseResponseDto;

  @ApiProperty({
    description: 'Enrollment status',
    enum: EnrollmentStatus,
  })
  status: EnrollmentStatus;

  @ApiProperty({
    description: 'Completion rate',
    type: Number,
  })
  completionRate: number;

  @ApiProperty({
    description: 'Certificate issued status',
    type: Boolean,
  })
  certificateIssued: boolean;

  @ApiProperty({
    description: 'Enrollment date',
    type: Date,
  })
  enrolledAt: Date;

  @ApiProperty({
    description: 'Completion date',
    type: Date,
    nullable: true,
  })
  completedAt: Date;

  constructor(enrollment: Enrollment) {
    this.id = enrollment.id;
    this.user = new UserResponseDto(enrollment.user);
    this.course = new CourseResponseDto(enrollment.course);
    this.status = enrollment.status;
    this.completionRate = enrollment.completionRate;
    this.certificateIssued = enrollment.certificateIssued;
    this.enrolledAt = enrollment.enrolledAt;
    this.completedAt = enrollment.completedAt;
  }
}

export class PaginatedEnrollmentResponseDto extends PaginatedResponse(
  EnrollmentResponseDto,
) {
  constructor(
    enrollments: Enrollment[],
    total: number,
    pageSize: number,
    currentPage: number,
  ) {
    const enrollmentDtos = enrollments.map(
      (enrollment) => new EnrollmentResponseDto(enrollment),
    );
    super(enrollmentDtos, total, pageSize, currentPage);
  }
}
