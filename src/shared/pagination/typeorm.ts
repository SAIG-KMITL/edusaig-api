import { BaseEntity, FindManyOptions, Repository } from 'typeorm';

class TypeORMPagination<T = BaseEntity> {
  constructor(
    private readonly repository: Repository<T>,
    private readonly queryOptions: FindManyOptions<T>,
    private readonly page: number,
    private readonly limit: number,
  ) {}

  protected format(data: [T[], number]) {
    const [result, total] = data;
    const lastPage = Math.ceil(total / this.limit);
    const nextPage = this.page + 1 > lastPage ? null : this.page + 1;
    const prevPage = this.page - 1 < 1 ? null : this.page - 1;

    const meta = {
      total,
      pageSize: Math.min(this.limit, total),
      currentPage: this.page,
      nextPage: nextPage,
      prevPage: prevPage,
      lastPage: lastPage,
    };

    return {
      data: result,
      meta,
    };
  }

  async run() {
    const data = await this.repository.findAndCount(this.queryOptions);
    return this.format(data);
  }
}
type Options = {
  readonly page?: number;
  readonly limit?: number;
};
export async function createPagination<T = BaseEntity>(
  repository: Repository<T>,
  { page = 1, limit = 20 }: Options,
) {
  const _take = limit || 10;
  const _page = page || 1;
  const _skip = (_page - 1) * _take;

  const find = (options: FindManyOptions<T>) => {
    return new TypeORMPagination(
      repository,
      Object.assign(options, {
        take: _take,
        skip: _skip,
      }),
      _page,
      _take,
    );
  };
  return { find };
}
