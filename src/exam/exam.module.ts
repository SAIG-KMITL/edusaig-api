import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";
import { ExamController } from "./exam.controller";
import { ExamService } from "./exam.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Exam } from "./exam.entity";
import { examProviders } from "./exam.providers";

@Module({
    imports: [
        DatabaseModule,
        TypeOrmModule.forFeature([Exam]),
    ],
    controllers: [ExamController],
    providers: [
        ...examProviders,
        ExamService,
    ],
    exports: [ExamService]
})
export class ExamModule { }