import { z } from 'zod';
import type { QueryParams } from '../../../../domain/common/queries/index.js';
import type {
  CustomerFilters,
  CustomerSortField,
} from '../../../../domain/customers/queries/index.js';

// Define as regras de validação do corpo recebido pela API.
const searchCustomersBodySchema = z
  .object({
    pagination: z
      .object({
        page: z.preprocess(
          (value) => (value === undefined ? 1 : value),
          z.coerce
            .number({ error: 'page deve ser um número.' })
            .int({ error: 'page deve ser um número inteiro.' })
            .min(1, { error: 'page deve ser maior ou igual a 1.' }),
        ),

        pageSize: z.preprocess(
          (value) => (value === undefined ? 10 : value),
          z.coerce
            .number({ error: 'pageSize deve ser um número.' })
            .int({ error: 'pageSize deve ser um número inteiro.' })
            .min(1, { error: 'pageSize deve ser maior ou igual a 1.' })
            .max(100, { error: 'pageSize deve ser menor ou igual a 100.' }),
        ),
      })
      .strict()
      .default({
        page: 1,
        pageSize: 10,
      }),

    filters: z
      .object({
        cities: z
          .array(
            z
              .string({ error: 'Cada cidade deve ser um texto.' })
              .trim()
              .min(1, { error: 'A cidade não pode estar vazia.' }),
          )
          .optional(),
      })
      .strict()
      .default({}),
  })
  .strict();

// Define o formato esperado pela aplicação.
type SearchCustomersParams = QueryParams<CustomerFilters, CustomerSortField>;

type ValidationResult =
  { success: true; data: SearchCustomersParams } | { success: false; message: string };

export function validateSearchCustomersBody(body: unknown): ValidationResult {
  const result = searchCustomersBodySchema.safeParse(body);

  if (!result.success) {
    const issue = result.error.issues[0];

    return {
      success: false,
      message: issue?.message ?? 'O corpo da pesquisa é inválido.',
    };
  }

  return {
    success: true,
    data: {
      pagination: {
        page: result.data.pagination.page,
        pageSize: result.data.pagination.pageSize,
      },
      filters: Object.fromEntries(
        Object.entries(result.data.filters).filter(([, value]) => value !== undefined),
      ) as CustomerFilters,
    },
  };
}
