import type { PaginatedResult, QueryParams } from '../queries/index.js';

export interface IRepository<T, TId extends string | number = number, TFilter = unknown> {
  findById(id: TId): Promise<T | null>;
  findAll(params: QueryParams<TFilter>): Promise<PaginatedResult<T>>;
  save(entity: T): Promise<T>;
  delete(id: TId): Promise<boolean>;
}
