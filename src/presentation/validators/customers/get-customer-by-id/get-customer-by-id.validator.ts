import { z } from 'zod';

// Define as regras de validação do identificador recebido pela rota.
const getCustomerByIdSchema = z
  .object({
    id: z.coerce
      .number({ error: 'id deve ser um número.' })
      .int({ error: 'id deve ser um número inteiro.' })
      .min(1, { error: 'id deve ser maior ou igual a 1.' }),
  })
  .strict();

// Representa os dois resultados possíveis da validação.
type ValidationResult = { success: true; data: number } | { success: false; message: string };

export function validateGetCustomerById(params: Record<string, unknown>): ValidationResult {
  const result = getCustomerByIdSchema.safeParse(params);

  if (!result.success) {
    const issue = result.error.issues[0];

    return {
      success: false,
      message: issue?.message ?? 'O identificador do cliente é inválido.',
    };
  }

  return {
    success: true,
    data: result.data.id,
  };
}
