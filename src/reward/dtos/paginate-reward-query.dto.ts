import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { Type } from '../enums/type.enum';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginateQueryDto } from 'src/shared/pagination/dtos/paginate-query.dto';

class TypeQueryDto {
  @ApiProperty({
    name: 'type',
    enum: Type,
    required: false,
    description: `sort by type (${Type.BADGE} ${Type.CERTIFICATE} or ${Type.ITEM})`,
  })
  @IsOptional()
  @IsEnum(Type, {
    message: `type must be ${Type.BADGE} ${Type.CERTIFICATE} or ${Type.ITEM}`,
  })
  type: Type;
}

export class PaginateRewardQueryDto extends IntersectionType(
  PaginateQueryDto,
  TypeQueryDto,
) {}
