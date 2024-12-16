import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCourseDto } from './index';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {

    @IsOptional()
    @IsString()
    @ApiProperty({
        description: 'Course thumbnail Key',
        type: String,
        example: '8d4887aa-28e7-4d0e-844c-28a8ccead003',
    })
    thumbnailKey: string;

}
