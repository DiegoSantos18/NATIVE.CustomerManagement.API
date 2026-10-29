import { describe, expect, it } from 'vitest';
import { validateListCustomersQuery } from './list-customers-query.validator.js';

describe('validateListCustomersQuery', () => {
  it('deve usar os valores padrão de paginação', () => {
    const result = validateListCustomersQuery({});

    expect(result).toEqual({
      success: true,
      data: {
        pagination: {
          page: 1,
          pageSize: 10,
        },
        filters: {},
      },
    });
  });

  it('deve converter os parâmetros HTTP para o formato da aplicação', () => {
    const result = validateListCustomersQuery({
      page: '2',
      limit: '5',
      city: 'Caxias do Sul',
    });

    expect(result).toEqual({
      success: true,
      data: {
        pagination: {
          page: 2,
          pageSize: 5,
        },
        filters: {
          cities: ['Caxias do Sul'],
        },
      },
    });
  });

  it('deve remover espaços extras do nome da cidade', () => {
    const result = validateListCustomersQuery({
      city: '  Caxias do Sul  ',
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.filters).toEqual({
        cities: ['Caxias do Sul'],
      });
    }
  });

  it.each([
    { query: { page: '0' }, scenario: 'página menor que 1' },
    { query: { page: '1.5' }, scenario: 'página decimal' },
    { query: { limit: '0' }, scenario: 'limite menor que 1' },
    { query: { limit: '101' }, scenario: 'limite acima de 100' },
    { query: { limit: 'abc' }, scenario: 'limite não numérico' },
    { query: { city: '   ' }, scenario: 'cidade vazia' },
    { query: { unexpected: 'value' }, scenario: 'parâmetro desconhecido' },
  ])('deve rejeitar: $scenario', ({ query }) => {
    const result = validateListCustomersQuery(query);

    expect(result.success).toBe(false);
  });
});
