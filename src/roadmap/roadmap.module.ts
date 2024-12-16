import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseModule } from 'src/course-module/course-module.entity';
import { UserBackgroundModule } from 'src/user-background/user-background.module';
import { RoadmapController } from './roadmap.controller';
import { Roadmap } from './roadmap.entity';
import { RoadmapService } from './roadmap.service';
import { Course } from 'src/course/course.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Roadmap, Course]),
    HttpModule,
    ConfigModule,
    UserBackgroundModule,
    CourseModule,
  ],
  controllers: [RoadmapController],
  providers: [RoadmapService],
})
export class RoadmapModule {}
