import { IsNotEmpty, IsOptional, IsString } from '@nestjs/class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'name of category',
    type: String,
    example: 'javascript',
  })
  title: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'description of category (optional)',
    type: String,
    example: 'high level programming language',
  })
  description?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '-',
    type: String,
    example: '-',
  })
  slug: string;
}
