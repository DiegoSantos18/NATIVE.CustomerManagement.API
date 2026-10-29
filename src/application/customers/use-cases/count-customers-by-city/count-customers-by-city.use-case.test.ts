import { describe, expect, it, vi } from 'vitest';
import type { ICustomerRepository } from '../../../../domain/customers/repositories/index.js';
import { CountCustomersByCityUseCase } from './count-customers-by-city.use-case.js';

describe('CountCustomersByCityUseCase', () => {
  it('deve retornar a quantidade de clientes agrupada por cidade', async () => {
    const esperado = [
      { city: 'Caxias do Sul', customersTotal: 10 },
      { city: 'Porto Alegre', customersTotal: 25 },
    ];

    const repositorioClientes = {
      countByCity: vi.fn().mockResolvedValue(esperado),
    } as unknown as ICustomerRepository;

    const casoDeUso = new CountCustomersByCityUseCase(repositorioClientes);

    const resultado = await casoDeUso.execute();

    expect(resultado).toEqual(esperado);
    expect(repositorioClientes.countByCity).toHaveBeenCalledOnce();
  });

  it('deve retornar uma lista vazia quando não houver clientes', async () => {
    const repositorioClientes = {
      countByCity: vi.fn().mockResolvedValue([]),
    } as unknown as ICustomerRepository;

    const casoDeUso = new CountCustomersByCityUseCase(repositorioClientes);

    const resultado = await casoDeUso.execute();

    expect(resultado).toEqual([]);
    expect(repositorioClientes.countByCity).toHaveBeenCalledOnce();
  });

  it('deve propagar erros ocorridos no repositório', async () => {
    const repositorioClientes = {
      countByCity: vi.fn().mockRejectedValue(new Error('Erro ao consultar o banco de dados')),
    } as unknown as ICustomerRepository;

    const casoDeUso = new CountCustomersByCityUseCase(repositorioClientes);

    await expect(casoDeUso.execute()).rejects.toThrow('Erro ao consultar o banco de dados');
  });
});
