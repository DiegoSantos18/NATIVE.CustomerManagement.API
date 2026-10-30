import { describe, expect, it } from 'vitest';

import { validateGetCustomerById } from './get-customer-by-id.validator.js';

describe('validateGetCustomerById', () => {
  it('deve converter o ID recebido como string para número', () => {
    const result = validateGetCustomerById({ id: '152' });

    expect(result).toEqual({
      success: true,
      data: 152,
    });
  });

  it('deve aceitar o menor ID válido', () => {
    const result = validateGetCustomerById({ id: '1' });

    expect(result).toEqual({
      success: true,
      data: 1,
    });
  });

  it.each([
    { params: { id: 'abc' }, scenario: 'ID não numérico' },
    { params: { id: '1.5' }, scenario: 'ID decimal' },
    { params: { id: '0' }, scenario: 'ID igual a zero' },
    { params: { id: '-1' }, scenario: 'ID negativo' },
    { params: {}, scenario: 'ID ausente' },
    { params: { id: '1', unexpected: 'value' }, scenario: 'parâmetro inesperado' },
  ])('deve rejeitar: $scenario', ({ params }) => {
    const result = validateGetCustomerById(params);

    expect(result.success).toBe(false);
  });
});
