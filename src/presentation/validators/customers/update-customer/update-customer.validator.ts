import { z } from 'zod';
import type { CustomerUpdateData } from '../../../../domain/customers/types/index.js';

// Define os campos permitidos para atualização de um cliente.
const updateCustomerSchema = z
  .object({
    firstName: z
      .string({ error: 'firstName deve ser um texto.' })
      .trim()
      .min(1, { error: 'firstName não pode estar vazio.' })
      .optional(),

    lastName: z
      .string({ error: 'lastName deve ser um texto.' })
      .trim()
      .min(1, { error: 'lastName não pode estar vazio.' })
      .nullable()
      .optional(),

    email: z
      .string({ error: 'email deve ser um texto.' })
      .trim()
      .pipe(z.email({ error: 'email deve ser um endereço de e-mail válido.' }))
      .optional(),

    gender: z
      .string({ error: 'gender deve ser um texto.' })
      .trim()
      .min(1, { error: 'gender não pode estar vazio.' })
      .nullable()
      .optional(),

    company: z
      .string({ error: 'company deve ser um texto.' })
      .trim()
      .min(1, { error: 'company não pode estar vazio.' })
      .nullable()
      .optional(),

    city: z
      .string({ error: 'city deve ser um texto.' })
      .trim()
      .min(1, { error: 'city não pode estar vazio.' })
      .nullable()
      .optional(),

    title: z
      .string({ error: 'title deve ser um texto.' })
      .trim()
      .min(1, { error: 'title não pode estar vazio.' })
      .nullable()
      .optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Informe ao menos um campo para atualizar.',
  });

// Representa os dois resultados possíveis da validação.
type ValidationResult =
  { success: true; data: CustomerUpdateData } | { success: false; message: string };

export function validateUpdateCustomer(body: unknown): ValidationResult {
  const result = updateCustomerSchema.safeParse(body);

  if (!result.success) {
    const issue = result.error.issues[0];

    return {
      success: false,
      message: issue?.message ?? 'Os dados do cliente são inválidos.',
    };
  }

  return {
    success: true,
    data: Object.fromEntries(
      Object.entries(result.data).filter(([, value]) => value !== undefined),
    ) as CustomerUpdateData,
  };
}
