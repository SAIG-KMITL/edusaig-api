import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class PaginateQueryDto {
  @ApiProperty({
    required: false,
    default: 1,
    description: 'Page number',
    type: Number,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiProperty({
    required: false,
    default: 10,
    description: 'Items per page',
    type: Number,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  limit: number = 10;

  @ApiProperty({
    required: false,
    default: '',
    description: 'Search',
    type: String,
  })
  @IsOptional()
  @IsString()
  search: string = '';
}
