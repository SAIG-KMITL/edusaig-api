import { PartialType } from '@nestjs/mapped-types';
import { CreateChapterDto } from './create-chapter.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateChapterDto extends PartialType(CreateChapterDto) {
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'Chapter order index',
    type: Number,
    example: 1,
  })
  orderIndex?: number;
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Chapter video key',
    type: String,
    example: '8d4887aa-28e7-4d0e-844c-28a8ccead003',
  })
  videoKey?: string;


}
