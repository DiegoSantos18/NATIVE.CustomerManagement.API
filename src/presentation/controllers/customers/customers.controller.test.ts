import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextFunction, Request, Response } from 'express';

import {
  CountCustomersByCityUseCase,
  ListCustomersUseCase,
} from '../../../application/customers/use-cases/index.js';
import { CustomersController } from './customers.controller.js';

describe('CustomersController', () => {
  const executarContagem = vi.fn();
  const executarListagem = vi.fn();

  const casoDeUsoContagem = {
    execute: executarContagem,
  } as unknown as CountCustomersByCityUseCase;

  const casoDeUsoListagem = {
    execute: executarListagem,
  } as unknown as ListCustomersUseCase;

  const controller = new CustomersController(casoDeUsoContagem, casoDeUsoListagem);

  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;

  const next = vi.fn() as NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve retornar 200 com os clientes e metadados da paginação', async () => {
    const resultadoEsperado = {
      items: [],
      page: 1,
      pageSize: 10,
      totalItems: 0,
      totalPages: 0,
    };

    executarListagem.mockResolvedValue(resultadoEsperado);

    await controller.getAll({ query: {} } as Request, res, next);

    expect(executarListagem).toHaveBeenCalledOnce();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(resultadoEsperado);
    expect(next).not.toHaveBeenCalled();
  });

  it('deve retornar 400 quando os parâmetros forem inválidos', async () => {
    await controller.getAll({ query: { page: '0' } } as unknown as Request, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'page deve ser maior ou igual a 1.',
    });
    expect(executarListagem).not.toHaveBeenCalled();
  });

  it('deve encaminhar erros da listagem para o middleware', async () => {
    const erro = new Error('Erro ao listar clientes');
    executarListagem.mockRejectedValue(erro);

    await controller.getAll({ query: {} } as Request, res, next);

    expect(next).toHaveBeenCalledWith(erro);
  });

  it('deve retornar 200 com a contagem de clientes por cidade', async () => {
    const resultadoEsperado = [
      { city: 'Caxias do Sul', customersTotal: 10 },
      { city: 'Porto Alegre', customersTotal: 25 },
    ];

    executarContagem.mockResolvedValue(resultadoEsperado);

    await controller.getTotalByCity({} as Request, res, next);

    expect(executarContagem).toHaveBeenCalledOnce();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(resultadoEsperado);
    expect(next).not.toHaveBeenCalled();
  });

  it('deve encaminhar erros da contagem para o middleware', async () => {
    const erro = new Error('Erro ao consultar o banco de dados');
    executarContagem.mockRejectedValue(erro);

    await controller.getTotalByCity({} as Request, res, next);

    expect(next).toHaveBeenCalledWith(erro);
  });
});
