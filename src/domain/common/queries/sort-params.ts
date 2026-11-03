export type SortOrder = 'asc' | 'desc';

export interface SortParams<TField extends string> {
  sortBy?: TField;
  sortOrder?: SortOrder;
}
