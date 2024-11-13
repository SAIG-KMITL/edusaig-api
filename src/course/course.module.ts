import { Module } from "@nestjs/common";
import { CourseService } from "./course.service";
import { CourseController } from "./course.controller";
import { courseProviders } from "./course.provider";
import { DatabaseModule } from "src/database/database.module";
import { CategoryModule } from "src/category/category.module";


@Module({
    imports: [
        DatabaseModule,
        CategoryModule
    ],
    controllers: [CourseController],
    providers: [
        ...courseProviders, 
        CourseService,
    ],
    exports: [CourseService],
})
export class CourseModule { }