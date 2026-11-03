import type { DataGridFilterParams } from '../../common/queries/index.js';

export interface CustomerFilters extends DataGridFilterParams {
  cities?: string[];
}
