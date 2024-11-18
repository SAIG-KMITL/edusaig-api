import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty({
    description: 'Total number of items',
    type: Number,
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Number of items per page',
    type: Number,
    example: 10,
  })
  pageSize: number;

  @ApiProperty({
    description: 'Current page number',
    type: Number,
    example: 1,
  })
  currentPage: number;

  @ApiProperty({
    description: 'Next page number (null if no next page)',
    type: Number,
    nullable: true,
    example: 2,
  })
  nextPage: number | null;

  @ApiProperty({
    description: 'Previous page number (null if no previous page)',
    type: Number,
    nullable: true,
    example: null,
  })
  prevPage: number | null;

  @ApiProperty({
    description: 'Last page number',
    type: Number,
    example: 10,
  })
  lastPage: number;

  constructor(total: number, pageSize: number, currentPage: number) {
    this.total = total;
    this.pageSize = pageSize;
    this.currentPage = currentPage;
    this.lastPage = Math.ceil(total / pageSize);
    this.nextPage = currentPage < this.lastPage ? currentPage + 1 : null;
    this.prevPage = currentPage > 1 ? currentPage - 1 : null;
  }
}
