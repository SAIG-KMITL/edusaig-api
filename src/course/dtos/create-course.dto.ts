
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
import { CourseLevel,CourseStatus } from "src/shared/enums/index";
export class CreateCourseDto {
    @IsNotEmpty()
    @ApiProperty({
        description: 'Course title',
        type: String,
        example: 'Introduction to Programming',
    })
    title: string;

    @IsNotEmpty()
    @ApiProperty({
        description: 'Course description',
        type: String,
        example: 'This course is an introduction to programming',
    })
    description: string;
    @IsNotEmpty()
    @ApiProperty({
        description: 'Teacher ID',
        type: String,
        example: '123456',
    })
    teacherId: string;

    @IsNotEmpty()
    @ApiProperty({
        description: 'Course thumbnail',
        type: String,
        example: 'https://www.example.com/thumbnail.jpg',
    })
    thumbnail: string;

    @IsNotEmpty()
    @ApiProperty({
        description: 'Course duration',
        type: Number,
        example: 60,
    })
    duration: number;

    @IsNotEmpty()
    @IsEnum(CourseLevel, {message: `Invalid level. Level should be either ${CourseLevel.BEGINNER}, ${CourseLevel.INTERMEDIATE}, or ${CourseLevel.ADVANCED}`})
    @ApiProperty({
        description: 'Course level',
        type: String,
        example: 'beginner',
        enum: ['beginner', 'intermediate', 'advanced'],
    })
    level: CourseLevel;

    @IsNotEmpty()
    @ApiProperty({
        description: 'Course price',
        type: Number,
        example: 100,
    })
    price: number;

    @IsNotEmpty()
    @IsEnum(CourseStatus, {message: `Invalid status. Status should be either ${CourseStatus.DRAFT}, ${CourseStatus.PUBLISHED}, or ${CourseStatus.ARCHIVED}`})
    @IsNotEmpty()
    @ApiProperty({
        description: 'Course status',
        type: String,
        example: 'draft',
        enum: ['draft', 'published', 'archived'],
    })
    status: CourseStatus;
}