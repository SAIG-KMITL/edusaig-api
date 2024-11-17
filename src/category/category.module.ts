import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { categoryProviders } from './category.providers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';

@Module({
    imports: [
        DatabaseModule,
        TypeOrmModule.forFeature([Category]),
    ],
    controllers: [CategoryController],
    providers: [...categoryProviders, CategoryService],
    exports: [CategoryService],
})
export class CategoryModule { }
