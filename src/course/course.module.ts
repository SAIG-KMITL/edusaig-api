import { Module } from "@nestjs/common";
import { CourseService } from "./course.service";
import { CourseController } from "./course.controller";
import { courseProviders } from "./course.provider";
import { DatabaseModule } from "src/database/database.module";

@Module({
    imports: [
        DatabaseModule,
    ],
    controllers: [CourseController],
    providers: [
        ...courseProviders, 
        CourseService
    ],
    exports: [CourseService],
})
export class CourseModule { }