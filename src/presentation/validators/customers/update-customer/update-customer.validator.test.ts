import { describe, expect, it } from 'vitest';
import { validateUpdateCustomer } from './update-customer.validator.js';

describe('validateUpdateCustomer', () => {
  it('deve aceitar uma atualização parcial', () => {
    const result = validateUpdateCustomer({
      firstName: 'Diego',
    });

    expect(result).toEqual({
      success: true,
      data: {
        firstName: 'Diego',
      },
    });
  });

  it('deve remover espaços extras dos campos de texto', () => {
    const result = validateUpdateCustomer({
      firstName: '  Diego  ',
      city: '  Caxias do Sul  ',
      email: '  diego@example.com  ',
    });

    expect(result).toEqual({
      success: true,
      data: {
        firstName: 'Diego',
        city: 'Caxias do Sul',
        email: 'diego@example.com',
      },
    });
  });

  it('deve aceitar null nos campos opcionais nullable', () => {
    const result = validateUpdateCustomer({
      lastName: null,
      gender: null,
      company: null,
      city: null,
      title: null,
    });

    expect(result.success).toBe(true);
  });

  it.each(['firstName', 'email'])('deve rejeitar null no campo %s', (field) => {
    const result = validateUpdateCustomer({
      [field]: null,
    });

    expect(result.success).toBe(false);
  });

  it.each(['firstName', 'lastName', 'email', 'gender', 'company', 'city', 'title'])(
    'deve rejeitar texto vazio no campo %s',
    (field) => {
      const result = validateUpdateCustomer({
        [field]: '   ',
      });

      expect(result.success).toBe(false);
    },
  );

  it('deve rejeitar um endereço de e-mail inválido', () => {
    const result = validateUpdateCustomer({
      email: 'email-invalido',
    });

    expect(result.success).toBe(false);
  });

  it('deve rejeitar um objeto vazio', () => {
    const result = validateUpdateCustomer({});

    expect(result.success).toBe(false);
  });

  it('deve rejeitar propriedades desconhecidas', () => {
    const result = validateUpdateCustomer({
      firstName: 'Diego',
      id: 10,
    });

    expect(result.success).toBe(false);
  });

  it('deve rejeitar valores com tipos incompatíveis', () => {
    const result = validateUpdateCustomer({
      firstName: 123,
    });

    expect(result.success).toBe(false);
  });
});
