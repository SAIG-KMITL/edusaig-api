import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { CourseModuleController } from './course-module.controller';
import { courseModuleProviders } from './course-module.provider';
import { CourseModuleService } from './course-module.service';
import { CourseModule } from 'src/course/course.module';

@Module({
  imports: [DatabaseModule, CourseModule],
  controllers: [CourseModuleController],
  providers: [...courseModuleProviders, CourseModuleService],
  exports: [CourseModuleService],
})
export class CourseModuleModule {}
