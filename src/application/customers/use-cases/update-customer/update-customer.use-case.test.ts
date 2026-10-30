import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Customer } from '../../../../domain/customers/entities/index.js';
import type { CustomerUpdateData } from '../../../../domain/customers/types/index.js';
import type { ICustomerRepository } from '../../../../domain/customers/repositories/index.js';
import { UpdateCustomerUseCase } from './update-customer.use-case.js';

describe('UpdateCustomerUseCase', () => {
  const update = vi.fn();

  const customerRepository = {
    update,
  } as unknown as ICustomerRepository;

  const useCase = new UpdateCustomerUseCase(customerRepository);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve retornar o cliente atualizado', async () => {
    const customer = {
      id: 1,
      firstName: 'Diego',
      lastName: 'Santos',
      email: 'diego@example.com',
    } as Customer;

    const data: CustomerUpdateData = {
      firstName: 'Novo nome',
    };

    update.mockResolvedValue(customer);

    const result = await useCase.execute(1, data);

    expect(result).toEqual(customer);
  });

  it('deve encaminhar o ID e os dados ao repositório', async () => {
    const data: CustomerUpdateData = {
      firstName: 'Novo nome',
    };

    update.mockResolvedValue(null);

    await useCase.execute(10, data);

    expect(update).toHaveBeenCalledOnce();
    expect(update).toHaveBeenCalledWith(10, data);
  });

  it('deve retornar null quando o cliente não for encontrado', async () => {
    update.mockResolvedValue(null);

    const result = await useCase.execute(999, { firstName: 'Novo nome' });

    expect(result).toBeNull();
  });

  it('deve propagar erros ocorridos no repositório', async () => {
    const error = new Error('Erro ao atualizar cliente');

    update.mockRejectedValue(error);

    await expect(useCase.execute(1, { firstName: 'Novo nome' })).rejects.toThrow(
      'Erro ao atualizar cliente',
    );
  });
});
