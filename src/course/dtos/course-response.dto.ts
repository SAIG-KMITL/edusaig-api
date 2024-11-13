import { ApiProperty } from "@nestjs/swagger";
import { UserResponseDto } from "src/user/dtos/user-response.dto";
import { Course } from "../course.entity";
import { CourseLevel, CourseStatus } from "src/shared/enums";

export class CourseResponseDto {
    @ApiProperty(
        {
            description: 'Course ID',
            type: String,
            example: '8d4887aa-28e7-4d0e-844c-28a8ccead003',
        })
    id: string;

    @ApiProperty(
        {
            description: 'Course title',
            type: String,
            example: 'Introduction to Programming',
        })
    title: string;

    @ApiProperty(
        {
            description: 'Course description',
            type: String,
            example: 'This course is an introduction to programming',
        })
    description: string;

    @ApiProperty(
        {
            description: 'Teacher Data',
            type: UserResponseDto,
            example: {
                id: '8d4887aa-28e7-4d0e-844c-28a8ccead003',
                email: 'johndoe@gmail.com',
                role: 'teacher',
                createdAt: new Date(),
                updatedAt: new Date(),
                fullname: 'John Doe',
            }
        })
    teacherData: UserResponseDto;
    @ApiProperty(
        {
            description: 'Course thumbnail',
            type: String,
            example: 'https://www.example.com/thumbnail.jpg',
        })
    thumbnail: string;

    @ApiProperty(
        {
            description: 'Course duration',
            type: Number,
            example: 60,
        })
    duration: number;

    @ApiProperty(
        {
            description: 'Course level',
            type: String,
            example: CourseLevel.BEGINNER,
            enum: CourseLevel,
        })
    level: CourseLevel;

    @ApiProperty(
        {
            description: 'Course price',
            type: Number,
            example: 100,
        })
    price: number;

    @ApiProperty(
        {
            description: 'Course status',
            type: String,
            example: CourseStatus.DRAFT,
            enum: CourseStatus,
        })
    status: CourseStatus;

    @ApiProperty(
        {
            description: 'Course created date',
            type: Date,
            example: new Date(),
        })
    createdAt: Date;

    @ApiProperty(
        {
            description: 'Course updated date',
            type: Date,
            example: new Date(),
        })
    updatedAt: Date;


    constructor(course: Course) {
        this.id = course.id;
        this.title = course.title;
        this.description = course.description;
        this.teacherData = new UserResponseDto(course.teacher);
        this.thumbnail = course.thumbnail;
        this.duration = course.duration;
        this.level = course.level;
        this.price = course.price;
        this.status = course.status;
        this.createdAt = course.createdAt;
        this.updatedAt = course.updatedAt;
    }

}