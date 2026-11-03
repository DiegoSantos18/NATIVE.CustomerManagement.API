import type { PaginatedResult, QueryParams } from '../queries/index.js';

export interface IRepository<
  T,
  TId extends string | number = number,
  TCreate = T,
  TUpdate = Partial<T>,
  TFilter = unknown,
  TSortField extends string = string,
> {
  findById(id: TId): Promise<T | null>;
  findAll(params: QueryParams<TFilter, TSortField>): Promise<PaginatedResult<T>>;
  add(data: TCreate): Promise<T>;
  update(id: TId, data: TUpdate): Promise<T | null>;
  delete(id: TId): Promise<boolean>;
}
