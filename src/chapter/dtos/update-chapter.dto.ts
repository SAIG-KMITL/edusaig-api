import { PartialType } from '@nestjs/mapped-types';
import { CreateChapterDto } from './create-chapter.dto';
import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateChapterDto extends PartialType(CreateChapterDto) {

    @IsOptional()
    @IsNumber()
    @ApiProperty({
      description: 'Chapter order index',
      type: Number,
      example: 1,
    })
    orderIndex: number;
}
