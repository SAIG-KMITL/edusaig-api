import { IsOptional, IsString } from '@nestjs/class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class updateCategoryDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'name of category',
    type: String,
    example: 'javascript',
  })
  title?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'description of category (optional)',
    type: String,
    example: 'high level programming language',
  })
  description?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '-',
    type: String,
    example: '-',
  })
  slug?: string;
}
