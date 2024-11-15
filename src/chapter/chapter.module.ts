import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ChapterController } from './chapter.controller';
import { Chapter } from './chapter.entity';
import { chapterProviders } from './chapter.provider';
import { ChapterService } from './chapter.service';
import { CourseModuleModule } from 'src/course-module/course-module.module';

@Module({
  imports: [DatabaseModule, CourseModuleModule],
  controllers: [ChapterController],
  providers: [...chapterProviders, ChapterService],
  exports: [ChapterService],
})
export class ChapterModule {}
