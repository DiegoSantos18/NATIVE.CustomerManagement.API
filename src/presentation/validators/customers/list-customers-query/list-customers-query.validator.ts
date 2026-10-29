import { z } from 'zod';

import type { QueryParams } from '../../../../domain/common/queries/index.js';
import type {
  CustomerFilters,
  CustomerSortField,
} from '../../../../domain/customers/queries/index.js';

// Define as regras de validação dos parâmetros recebidos pela API.
const listCustomersQuerySchema = z
  .object({
    // Usa 1 como padrão e exige um número inteiro positivo.
    page: z.preprocess(
      (value) => (value === undefined ? 1 : value),
      z.coerce
        .number({ error: 'page deve ser um número.' })
        .int({ error: 'page deve ser um número inteiro.' })
        .min(1, { error: 'page deve ser maior ou igual a 1.' }),
    ),

    // Usa 10 como padrão e limita o tamanho da página entre 1 e 100.
    limit: z.preprocess(
      (value) => (value === undefined ? 10 : value),
      z.coerce
        .number({ error: 'limit deve ser um número.' })
        .int({ error: 'limit deve ser um número inteiro.' })
        .min(1, { error: 'limit deve ser maior ou igual a 1.' })
        .max(100, { error: 'limit deve ser menor ou igual a 100.' }),
    ),

    // Aceita cidade opcional, remove espaços extras e rejeita texto vazio.
    city: z.preprocess(
      (value) => (value === undefined ? undefined : value),
      z
        .string({ error: 'city deve ser um texto.' })
        .trim()
        .min(1, { error: 'city não pode estar vazio.' })
        .optional(),
    ),
  })
  .strict();

// Define o formato dos parâmetros esperado pela aplicação.
type ListCustomersQueryParams = QueryParams<CustomerFilters, CustomerSortField>;

// Representa os dois resultados possíveis da validação.
type ValidationResult =
  { success: true; data: ListCustomersQueryParams } | { success: false; message: string };

export function validateListCustomersQuery(query: Record<string, unknown>): ValidationResult {
  // Valida os parâmetros sem lançar exceção em caso de entrada inválida.
  const result = listCustomersQuerySchema.safeParse(query);

  if (!result.success) {
    // Retorna a primeira mensagem de erro encontrada pelo Zod.
    const issue = result.error.issues[0];

    return {
      success: false,
      message: issue?.message ?? 'Os parâmetros de consulta são inválidos.',
    };
  }

  // Converte os parâmetros HTTP para o formato usado pela aplicação.
  return {
    success: true,
    data: {
      pagination: {
        page: result.data.page,
        pageSize: result.data.limit,
      },

      // Converte a cidade singular da URL para a lista de filtros do domínio.
      filters: result.data.city ? { cities: [result.data.city] } : {},
    },
  };
}
