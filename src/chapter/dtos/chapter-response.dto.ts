import { ApiProperty } from '@nestjs/swagger';
import { CourseModuleResponseDto } from 'src/course-module/dtos/course-module-response.dto';
import { PaginatedResponse } from 'src/shared/pagination/dtos/paginate-response.dto';
import { Chapter } from '../chapter.entity';

export class ChapterResponseDto {
  @ApiProperty({
    description: 'Chapter ID',
    type: String,
    example: '8d4887aa-28e7-4d0e-844c-28a8ccead003',
  })
  id: string;

  @ApiProperty({
    description: 'Chapter title',
    type: String,
    example: 'Introduction to Variables',
  })
  title: string;

  @ApiProperty({
    description: 'Chapter description',
    type: String,
    example: 'Learn about variables and data types in programming',
  })
  description: string;

  @ApiProperty({
    description: 'Chapter video URL',
    type: String,
    example: 'https://www.youtube.com/watch?v=8k-9mU5KfBQ',
  })
  videoUrl: string;

  @ApiProperty({
    description: 'Chapter content',
    type: String,
    example: 'This chapter covers the basics of programming',
  })
  content: string;

  @ApiProperty({
    description: 'Chapter summary',
    type: String,
    example: 'This chapter is an introduction to programming',
  })
  summary: string;

  @ApiProperty({
    description: 'Chapter duration',
    type: Number,
    example: 10,
  })
  duration: number;

  @ApiProperty({
    description: 'Chapter module',
    type: CourseModuleResponseDto,
    example: {
      id: '8d4887aa-28e7-4d0e-844c-28a8ccead003',
      title: 'Introduction to Programming',
      description: 'This module is an introduction to programming',
      orderIndex: 1,
      courseId: '8d4887aa-28e7-4d0e-844c-28a8ccead003',
    },
  })
  module: CourseModuleResponseDto;

  @ApiProperty({
    description: 'Chapter created date',
    type: Date,
    example: new Date(),
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Chapter updated date',
    type: Date,
    example: new Date(),
  })
  updatedAt: Date;

  constructor(chapter: Chapter) {
    this.id = chapter.id;
    this.title = chapter.title;
    this.description = chapter.description;
    this.videoUrl = chapter.videoUrl;
    this.content = chapter.content;
    this.summary = chapter.summary;
    this.duration = chapter.duration;
    this.createdAt = chapter.createdAt;
    this.updatedAt = chapter.updatedAt;
  }
}

export class PaginatedChapterResponseDto extends PaginatedResponse(
  ChapterResponseDto,
) {
  constructor(
    chapters: Chapter[],
    total: number,
    pageSize: number,
    currentPage: number,
  ) {
    const chapterDtos = chapters.map(
      (chapter) => new ChapterResponseDto(chapter),
    );
    super(chapterDtos, total, pageSize, currentPage);
  }
}
