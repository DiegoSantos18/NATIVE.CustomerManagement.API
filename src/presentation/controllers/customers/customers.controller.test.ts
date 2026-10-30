import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextFunction, Request, Response } from 'express';
import { CustomersController } from './customers.controller.js';
import {
  CountCustomersByCityUseCase,
  GetCustomerByIdUseCase,
  ListCustomersUseCase,
  UpdateCustomerUseCase,
} from '../../../application/customers/use-cases/index.js';

describe('CustomersController', () => {
  const executarContagem = vi.fn();
  const executarConsultaPorId = vi.fn();
  const executarListagem = vi.fn();
  const executarAtualizacao = vi.fn();

  const casoDeUsoContagem = {
    execute: executarContagem,
  } as unknown as CountCustomersByCityUseCase;

  const casoDeUsoConsultaPorId = {
    execute: executarConsultaPorId,
  } as unknown as GetCustomerByIdUseCase;

  const casoDeUsoListagem = {
    execute: executarListagem,
  } as unknown as ListCustomersUseCase;

  const casoDeUsoAtualizacao = {
    execute: executarAtualizacao,
  } as unknown as UpdateCustomerUseCase;

  const controller = new CustomersController(
    casoDeUsoContagem,
    casoDeUsoListagem,
    casoDeUsoConsultaPorId,
    casoDeUsoAtualizacao,
  );

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

  describe('getById', () => {
    it('deve retornar 200 com o cliente encontrado', async () => {
      const clienteEsperado = {
        id: 152,
        firstName: 'Diego',
        lastName: 'Santos',
        email: 'diego@example.com',
      };

      executarConsultaPorId.mockResolvedValue(clienteEsperado);

      await controller.getById({ params: { id: '152' } } as unknown as Request, res, next);

      expect(executarConsultaPorId).toHaveBeenCalledWith(152);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(clienteEsperado);
      expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar 400 quando o ID for inválido', async () => {
      await controller.getById({ params: { id: 'abc' } } as unknown as Request, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'id deve ser um número.',
      });
      expect(executarConsultaPorId).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar 404 quando o cliente não for encontrado', async () => {
      executarConsultaPorId.mockResolvedValue(null);

      await controller.getById({ params: { id: '152' } } as unknown as Request, res, next);

      expect(executarConsultaPorId).toHaveBeenCalledWith(152);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Cliente não encontrado.',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve encaminhar erros da consulta para o middleware', async () => {
      const erro = new Error('Erro ao consultar cliente');
      executarConsultaPorId.mockRejectedValue(erro);

      await controller.getById({ params: { id: '152' } } as unknown as Request, res, next);

      expect(next).toHaveBeenCalledWith(erro);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('deve retornar 200 com o cliente atualizado', async () => {
      const clienteAtualizado = {
        id: 152,
        firstName: 'Diego Atualizado',
        lastName: 'Santos',
        email: 'diego@example.com',
      };

      executarAtualizacao.mockResolvedValue(clienteAtualizado);

      await controller.update(
        {
          params: { id: '152' },
          body: { firstName: 'Diego Atualizado' },
        } as unknown as Request,
        res,
        next,
      );

      expect(executarAtualizacao).toHaveBeenCalledOnce();
      expect(executarAtualizacao).toHaveBeenCalledWith(152, {
        firstName: 'Diego Atualizado',
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(clienteAtualizado);
      expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar 400 quando o ID for inválido', async () => {
      await controller.update(
        {
          params: { id: 'abc' },
          body: { firstName: 'Diego' },
        } as unknown as Request,
        res,
        next,
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(executarAtualizacao).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar 400 quando o corpo for inválido', async () => {
      await controller.update(
        {
          params: { id: '152' },
          body: {},
        } as unknown as Request,
        res,
        next,
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(executarAtualizacao).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar 404 quando o cliente não for encontrado', async () => {
      executarAtualizacao.mockResolvedValue(null);

      await controller.update(
        {
          params: { id: '152' },
          body: { firstName: 'Diego' },
        } as unknown as Request,
        res,
        next,
      );

      expect(executarAtualizacao).toHaveBeenCalledWith(152, {
        firstName: 'Diego',
      });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Cliente não encontrado.',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve encaminhar erros da atualização para o middleware', async () => {
      const erro = new Error('Erro ao atualizar cliente');
      executarAtualizacao.mockRejectedValue(erro);

      await controller.update(
        {
          params: { id: '152' },
          body: { firstName: 'Diego' },
        } as unknown as Request,
        res,
        next,
      );

      expect(next).toHaveBeenCalledWith(erro);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
