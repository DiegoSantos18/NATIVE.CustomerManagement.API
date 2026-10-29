import type { PaginatedResult, QueryParams } from '../queries/index.js';

export interface IRepository<
  T,
  TId extends string | number = number,
  TFilter = unknown,
  TSortField extends string = string,
> {
  findById(id: TId): Promise<T | null>;
  findAll(params: QueryParams<TFilter, TSortField>): Promise<PaginatedResult<T>>;
  save(entity: T): Promise<T>;
  delete(id: TId): Promise<boolean>;
}
