import { z } from 'zod';
import { paginationSchema, dataGridFilterSchema, sortSchema } from '../../common/common.schemas.js';
import { createValidator } from '../../common/validation.helper.js';

const filtersSchema = dataGridFilterSchema.extend({
  cities: z.array(z.string().trim().min(1)).optional(),
});

const searchCustomersBodySchema = z
  .object({
    pagination: paginationSchema.default({ page: 1, pageSize: 10 }),
    filters: filtersSchema.default({}),
    sort: sortSchema.optional(),
  })
  .strict();

export const validateSearchCustomersBody = createValidator(
  searchCustomersBodySchema,
  'Dados inválidos.',
);
