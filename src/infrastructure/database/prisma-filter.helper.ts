import type { DataGridFilterParams } from '../../domain/common/queries/index.js';

export function buildDataGridWhereClause<TWhereInput extends object>(
  filters?: DataGridFilterParams,
  allowedFields: readonly string[] = [],
): TWhereInput {
  const where: Record<string, unknown> = {};

  if (!filters?.field || !filters?.operator) {
    return where as TWhereInput;
  }

  const { field, operator, value } = filters;

  if (allowedFields.length > 0 && !allowedFields.includes(field)) {
    return where as TWhereInput;
  }

  switch (operator) {
    case 'contains':
      where[field] = { contains: value };
      break;
    case 'doesNotContain':
      where[field] = { not: { contains: value } };
      break;
    case 'equals':
    case 'is':
    case '=':
      where[field] = value;
      break;
    case 'notEquals':
    case 'doesNotEqual':
    case 'not':
    case '!=':
      where[field] = { not: value };
      break;
    case 'startsWith':
      where[field] = { startsWith: value };
      break;
    case 'endsWith':
      where[field] = { endsWith: value };
      break;
    case 'isEmpty':
      where[field] = { equals: '' };
      break;
    case 'isNotEmpty':
      where[field] = { not: '' };
      break;
    case 'isAnyOf':
      where[field] = { in: Array.isArray(value) ? value : [value] };
      break;
    default:
      if (value !== undefined && value !== '') {
        where[field] = value;
      }
      break;
  }

  return where as TWhereInput;
}
