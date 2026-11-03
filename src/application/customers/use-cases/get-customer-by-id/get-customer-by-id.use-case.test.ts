import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ICustomerRepository } from '../../../../domain/customers/repositories/index.js';
import type { Customer } from '../../../../domain/customers/entities/index.js';
import { GetCustomerByIdUseCase } from './get-customer-by-id.use-case.js';

describe('GetCustomerByIdUseCase', () => {
  const findById = vi.fn();

  const customerRepository = {
    findById,
  } as unknown as ICustomerRepository;

  const useCase = new GetCustomerByIdUseCase(customerRepository);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve retornar o cliente quando encontrado', async () => {
    const customer = {
      id: 1,
      firstName: 'Diego',
      lastName: 'Santos',
      email: 'diego@example.com',
    } as Customer;

    findById.mockResolvedValue(customer);

    const result = await useCase.execute(1);

    expect(result).toEqual(customer);
  });

  it('deve retornar null quando o cliente não for encontrado', async () => {
    findById.mockResolvedValue(null);

    const result = await useCase.execute(999);

    expect(result).toBeNull();
  });

  it('deve encaminhar o ID ao repositório', async () => {
    findById.mockResolvedValue(null);

    await useCase.execute(10);

    expect(findById).toHaveBeenCalledOnce();
    expect(findById).toHaveBeenCalledWith(10);
  });

  it('deve propagar erros ocorridos no repositório', async () => {
    const error = new Error('Erro ao buscar cliente');

    findById.mockRejectedValue(error);

    await expect(useCase.execute(1)).rejects.toThrow('Erro ao buscar cliente');
  });
});
