import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from './paginate-meta.dto';

export interface IBaseEntity {
  id: string;
}

export function PaginatedResponse<T extends IBaseEntity>(ItemType: Type<T>) {
  class PaginatedResponseClass {
    @ApiProperty({
      description: 'Array of items',
      type: [ItemType],
    })
    data: T[];

    @ApiProperty({
      description: 'Pagination metadata',
      type: PaginationMetaDto,
    })
    meta: PaginationMetaDto;

    constructor(
      items: T[],
      total: number,
      pageSize: number,
      currentPage: number,
    ) {
      this.data = items;
      this.meta = new PaginationMetaDto(total, pageSize, currentPage);
    }
  }

  return PaginatedResponseClass;
}
