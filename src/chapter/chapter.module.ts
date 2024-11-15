import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ChapterController } from './chapter.controller';
import { Chapter } from './chapter.entity';
import { chapterProviders } from './chapter.provider';
import { ChapterService } from './chapter.service';
import { CourseModuleModule } from 'src/course-module/course-module.module';
import { CourseOwnershipGuard } from 'src/shared/guards/course-ownership.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'src/course/course.entity';
import { CourseModule as CourseModuleEntity } from 'src/course-module/course-module.entity';
@Module({
  imports: [DatabaseModule, CourseModuleModule, TypeOrmModule.forFeature([Chapter, Course, CourseModuleEntity])],
  controllers: [ChapterController],
  providers: [...chapterProviders, ChapterService, CourseOwnershipGuard,
  ],
  exports: [ChapterService],
})
export class ChapterModule { }
