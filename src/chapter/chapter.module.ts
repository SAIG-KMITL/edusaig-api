import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ChapterController } from './chapter.controller';
import { Chapter } from './chapter.entity';
import { chapterProviders } from './chapter.provider';
import { ChapterService } from './chapter.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ChapterController],
  providers: [...chapterProviders, ChapterService],
  exports: [ChapterService],
})
export class ChapterModule {}
