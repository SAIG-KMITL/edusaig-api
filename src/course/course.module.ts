import { Module } from '@nestjs/common';
import { CategoryModule } from 'src/category/category.module';
import { DatabaseModule } from 'src/database/database.module';
import { CourseController } from './course.controller';
import { courseProviders } from './course.provider';
import { CourseService } from './course.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './course.entity';
import { FileModule } from 'src/file/file.module';

@Module({
  imports: [DatabaseModule, CategoryModule, TypeOrmModule.forFeature([Course]), FileModule],
  controllers: [CourseController],
  providers: [...courseProviders, CourseService],
  exports: [CourseService],
})
export class CourseModule {}
