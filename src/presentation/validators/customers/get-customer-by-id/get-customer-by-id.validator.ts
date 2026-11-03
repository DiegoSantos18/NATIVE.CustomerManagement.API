import { z } from 'zod';
import { idParamSchema } from '../../common/common.schemas.js';
import { createValidator } from '../../common/validation.helper.js';

const getCustomerByIdSchema = z
  .object({
    id: idParamSchema,
  })
  .strict();

export const validateGetCustomerById = createValidator(
  getCustomerByIdSchema,
  'O identificador do cliente é inválido.',
  (data) => data.id,
);
