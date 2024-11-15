import { Module } from '@nestjs/common';
import { CourseModule } from 'src/course/course.module';
import { DatabaseModule } from 'src/database/database.module';
import { CourseModuleController } from './course-module.controller';
import { courseModuleProviders } from './course-module.provider';
import { CourseModuleService } from './course-module.service';

@Module({
  imports: [DatabaseModule, CourseModule],
  controllers: [CourseModuleController],
  providers: [...courseModuleProviders, CourseModuleService
  ],
  exports: [CourseModuleService],
})
export class CourseModuleModule {}
