import { ApiProperty } from '@nestjs/swagger';
import { CourseResponseDto } from 'src/course/dtos';
import { PaginatedResponse } from 'src/shared/pagination/dtos/paginate-response.dto';
import { UserResponseDto } from 'src/user/dtos/user-response.dto';
import { Roadmap } from '../roadmap.entity';

export class RoadmapResponseDto {
  @ApiProperty({
    description: 'Roadmap ID',
    type: String,
    example: '8d4887aa-28e7-4d0e-844c-28a8ccead003',
  })
  id: string;

  @ApiProperty({
    description: 'Roadmap duration',
    type: String,
    example: '2 months',
  })
  duration: string;

  @ApiProperty({
    description: 'Roadmap priority',
    type: Number,
    example: 1,
  })
  priority: number;

  @ApiProperty({
    description: 'Roadmap user',
    type: UserResponseDto,
  })
  user: UserResponseDto;

  @ApiProperty({
    description: 'Roadmap courses',
    type: [CourseResponseDto],
  })
  courses: CourseResponseDto[];

  @ApiProperty({
    description: 'Roadmap creation date',
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Roadmap update date',
    type: Date,
  })
  updatedAt: Date;

  constructor(roadmap: Roadmap) {
    this.id = roadmap.id;
    this.duration = roadmap.duration;
    this.priority = roadmap.priority;
    this.user = new UserResponseDto(roadmap.user);
    this.courses = roadmap.courses.map(
      (course) => new CourseResponseDto(course),
    );
    this.createdAt = roadmap.createdAt;
    this.updatedAt = roadmap.updatedAt;
  }
}

export class PaginatedRoadmapResponseDto extends PaginatedResponse(
  RoadmapResponseDto,
) {
  constructor(
    roadmaps: RoadmapResponseDto[],
    total: number,
    pageSize: number,
    currentPage: number,
  ) {
    super(roadmaps, total, pageSize, currentPage);
  }
}
