import { z } from 'zod';
import type { CustomerUpdateData } from '../../../../domain/customers/types/index.js';
import { optionalNullableStringSchema, requiredStringSchema } from '../../common/common.schemas.js';
import { createValidator } from '../../common/validation.helper.js';

const updateCustomerSchema = z
  .object({
    firstName: requiredStringSchema('firstName').optional(),
    lastName: optionalNullableStringSchema('lastName'),
    email: requiredStringSchema('email')
      .pipe(z.email({ error: 'email deve ser um endereço de e-mail válido.' }))
      .optional(),
    gender: optionalNullableStringSchema('gender'),
    company: optionalNullableStringSchema('company'),
    city: optionalNullableStringSchema('city'),
    title: optionalNullableStringSchema('title'),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Informe ao menos um campo para atualizar.',
  });

export const validateUpdateCustomer = createValidator(
  updateCustomerSchema,
  'Os dados do cliente são inválidos.',
  (data) =>
    Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    ) as CustomerUpdateData,
);
