import type { PaginationParams } from './pagination-params.js';

export interface QueryParams<TFilter = unknown> {
  pagination: PaginationParams;
  filters?: TFilter;
}
