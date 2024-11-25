import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ChapterController } from './chapter.controller';
import { Chapter } from './chapter.entity';
import { chapterProviders } from './chapter.provider';
import { ChapterService } from './chapter.service';
import { CourseModuleModule } from 'src/course-module/course-module.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseModule } from 'src/course-module/course-module.entity';
import { ChatRoomModule } from 'src/chat-room/chat-room.module';
import { EnrollmentModule } from 'src/enrollment/enrollment.module';
import { FileModule } from 'src/file/file.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    DatabaseModule,
    CourseModuleModule,
    TypeOrmModule.forFeature([Chapter, CourseModule]),
    ChatRoomModule,
    EnrollmentModule,
    FileModule,
    HttpModule
  ],
  controllers: [ChapterController],
  providers: [...chapterProviders, ChapterService],
  exports: [ChapterService],
})
export class ChapterModule {}
