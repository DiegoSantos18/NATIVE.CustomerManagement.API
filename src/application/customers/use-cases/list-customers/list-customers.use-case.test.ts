import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ICustomerRepository } from '../../../../domain/customers/repositories/index.js';
import { ListCustomersUseCase } from './list-customers.use-case.js';

describe('ListCustomersUseCase', () => {
  const findAll = vi.fn();

  const customerRepository = {
    findAll,
  } as unknown as ICustomerRepository;

  const useCase = new ListCustomersUseCase(customerRepository);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve retornar os clientes e os metadados da paginação', async () => {
    const paginatedResult = {
      items: [],
      page: 2,
      pageSize: 5,
      totalItems: 12,
      totalPages: 3,
    };

    findAll.mockResolvedValue(paginatedResult);

    const result = await useCase.execute({
      pagination: {
        page: 2,
        pageSize: 5,
      },
      filters: {
        cities: ['Caxias do Sul'],
      },
    });

    expect(result).toEqual(paginatedResult);
  });

  it('deve encaminhar os parâmetros ao repositório', async () => {
    findAll.mockResolvedValue({
      items: [],
      page: 1,
      pageSize: 10,
      totalItems: 0,
      totalPages: 0,
    });

    const params = {
      pagination: {
        page: 1,
        pageSize: 10,
      },
      filters: {},
    };

    await useCase.execute(params);

    expect(findAll).toHaveBeenCalledOnce();
    expect(findAll).toHaveBeenCalledWith(params);
  });

  it('deve propagar erros ocorridos no repositório', async () => {
    const error = new Error('Erro ao listar clientes');

    findAll.mockRejectedValue(error);

    await expect(
      useCase.execute({
        pagination: {
          page: 1,
          pageSize: 10,
        },
        filters: {},
      }),
    ).rejects.toThrow('Erro ao listar clientes');
  });
});
