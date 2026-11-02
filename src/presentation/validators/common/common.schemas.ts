import { z } from 'zod';

export const idParamSchema = z.coerce
  .number({ error: 'id deve ser um número.' })
  .int({ error: 'id deve ser um número inteiro.' })
  .min(1, { error: 'id deve ser maior ou igual a 1.' });

export const requiredStringSchema = (fieldName: string) =>
  z
    .string({ error: `${fieldName} deve ser um texto.` })
    .trim()
    .min(1, { error: `${fieldName} não pode estar vazio.` });

export const optionalNullableStringSchema = (fieldName: string) =>
  requiredStringSchema(fieldName).nullable().optional();

export const paginationSchema = z
  .object({
    page: z.number().int().min(1, 'page deve ser maior ou igual a 1.').default(1),
    pageSize: z.number().int().min(1).max(100).default(10),
  })
  .strict();

export const dataGridFilterSchema = z
  .object({
    field: z.string().optional(),
    operator: z.string().optional(),
    value: z
      .union([
        z.string(),
        z.number(),
        z.boolean(),
        z.array(z.union([z.string(), z.number(), z.boolean()])),
      ])
      .optional(),
  })
  .strict();

export const sortSchema = z
  .object({
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  })
  .strict();
