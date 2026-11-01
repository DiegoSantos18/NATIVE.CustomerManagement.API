import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ICustomerRepository } from '../../../../domain/customers/repositories/index.js';
import { GetCustomerCitiesUseCase } from './get-customer-cities.use-case.js';

describe('GetCustomerCitiesUseCase', () => {
  const findDistinctCities = vi.fn();

  const customerRepository = {
    findDistinctCities,
  } as unknown as ICustomerRepository;

  const useCase = new GetCustomerCitiesUseCase(customerRepository);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve retornar a lista de cidades distintas', async () => {
    const expected = ['Caxias do Sul, RS', 'Porto Alegre, RS'];

    findDistinctCities.mockResolvedValue(expected);

    const result = await useCase.execute();

    expect(result).toEqual(expected);
    expect(findDistinctCities).toHaveBeenCalledOnce();
  });

  it('deve retornar uma lista vazia quando não houver cidades', async () => {
    findDistinctCities.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
    expect(findDistinctCities).toHaveBeenCalledOnce();
  });

  it('deve propagar erros ocorridos no repositório', async () => {
    const error = new Error('Erro ao consultar as cidades');

    findDistinctCities.mockRejectedValue(error);

    await expect(useCase.execute()).rejects.toThrow('Erro ao consultar as cidades');
  });
});
