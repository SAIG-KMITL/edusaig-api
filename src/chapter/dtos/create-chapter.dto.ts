import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateChapterDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Chapter title',
    type: String,
    example: 'Introduction to Programming',
  })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Chapter description',
    type: String,
    example: 'This chapter is an introduction to programming',
  })
  description: string;


  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Chapter content',
    type: String,
    example: 'This chapter covers the basics of programming',
  })
  content: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'Chapter duration',
    type: Number,
    example: 10,
  })
  duration: number;

  @IsNotEmpty()
  @IsUUID(4)
  @ApiProperty({
    description: 'Module ID',
    type: String,
    example: '8d4887aa-28e7-4d0e-844c-28a8ccead003',
  })
  moduleId: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    description: 'Chapter preview',
    type: Boolean,
    example: true,
  })
  isPreview: boolean;
}
