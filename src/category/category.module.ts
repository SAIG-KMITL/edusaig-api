import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { categoryProviders } from './category.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [CategoryController],
  providers: [...categoryProviders, CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
