import { describe, expect, it } from 'vitest';
import { validateSearchCustomersBody } from './search-customers-body.validator.js';

describe('validateSearchCustomersBody', () => {
  it('deve utilizar os valores padrão de paginação e filtros', () => {
    const result = validateSearchCustomersBody({});

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

  it('deve validar paginação e múltiplas cidades', () => {
    const result = validateSearchCustomersBody({
      pagination: {
        page: 2,
        pageSize: 5,
      },
      filters: {
        cities: ['Caxias do Sul', 'Porto Alegre'],
      },
    });

    expect(result).toEqual({
      success: true,
      data: {
        pagination: {
          page: 2,
          pageSize: 5,
        },
        filters: {
          cities: ['Caxias do Sul', 'Porto Alegre'],
        },
      },
    });
  });

  it('deve aplicar valores padrão quando a paginação estiver vazia', () => {
    const result = validateSearchCustomersBody({
      pagination: {},
    });

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

  it('deve remover espaços extras dos nomes das cidades', () => {
    const result = validateSearchCustomersBody({
      filters: {
        cities: ['  Caxias do Sul  ', ' Porto Alegre '],
      },
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.filters).toEqual({
        cities: ['Caxias do Sul', 'Porto Alegre'],
      });
    }
  });

  it.each([
    { body: { pagination: { page: 0 } }, scenario: 'página menor que 1' },
    { body: { pagination: { page: 1.5 } }, scenario: 'página decimal' },
    { body: { pagination: { pageSize: 0 } }, scenario: 'tamanho menor que 1' },
    { body: { pagination: { pageSize: 101 } }, scenario: 'tamanho acima de 100' },
    { body: { pagination: { pageSize: 'abc' } }, scenario: 'tamanho não numérico' },
    { body: { filters: { cities: ['   '] } }, scenario: 'cidade vazia' },
    { body: { filters: { cities: ['Caxias do Sul', 123] } }, scenario: 'cidade não textual' },
    { body: { unexpected: 'value' }, scenario: 'propriedade desconhecida' },
    { body: { filters: { unknown: true } }, scenario: 'filtro desconhecido' },
    { body: { pagination: { unknown: 1 } }, scenario: 'propriedade de paginação desconhecida' },
  ])('deve rejeitar: $scenario', ({ body }) => {
    const result = validateSearchCustomersBody(body);

    expect(result.success).toBe(false);
  });

  it('deve rejeitar um body que não seja um objeto', () => {
    const result = validateSearchCustomersBody(null);

    expect(result.success).toBe(false);
  });
});
