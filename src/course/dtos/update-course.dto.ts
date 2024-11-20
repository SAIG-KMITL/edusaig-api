import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCourseDto } from './index';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {

    @IsOptional()
    @IsString()
    @ApiProperty({
        description: 'Course thumbnail',
        type: String,
        example: 'https://www.example.com/thumbnail.jpg',
    })
    thumbnail: string;

}
