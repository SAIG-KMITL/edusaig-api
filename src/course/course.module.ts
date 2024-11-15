import { Module } from '@nestjs/common';
import { CategoryModule } from 'src/category/category.module';
import { DatabaseModule } from 'src/database/database.module';
import { CourseController } from './course.controller';
import { courseProviders } from './course.provider';
import { CourseService } from './course.service';
import { CourseOwnershipGuard } from 'src/shared/guards/course-ownership.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './course.entity';
import { Chapter } from 'src/chapter/chapter.entity';
import { CourseModule as CourseModuleEntity } from '../course-module/course-module.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([CourseModuleEntity, Course, Chapter]), CategoryModule],
  controllers: [CourseController],
  providers: [...courseProviders, CourseService,CourseOwnershipGuard

  ],
  exports: [CourseService],
})
export class CourseModule { }
