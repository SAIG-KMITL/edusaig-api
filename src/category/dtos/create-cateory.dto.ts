import { IsNotEmpty, IsOptional, IsString } from '@nestjs/class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsNotEmpty()
  slug: string;
}
