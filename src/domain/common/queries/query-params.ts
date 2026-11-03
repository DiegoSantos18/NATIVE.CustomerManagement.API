import type { PaginationParams } from './pagination-params.js';
import type { SortParams } from './sort-params.js';

export interface QueryParams<TFilter = unknown, TSortField extends string = string> {
  pagination: PaginationParams;
  filters?: TFilter;
  sort?: SortParams<TSortField>;
}
