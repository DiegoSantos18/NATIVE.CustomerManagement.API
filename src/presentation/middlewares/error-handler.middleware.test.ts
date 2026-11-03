import type { Request, Response, NextFunction } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConflictError } from '../../domain/common/errors/index.js';
import { errorHandlerMiddleware } from './error-handler.middleware.js';

describe('errorHandlerMiddleware', () => {
  const status = vi.fn().mockReturnThis();
  const json = vi.fn().mockReturnThis();
  const next = vi.fn();
  const response = { headersSent: false, status, json } as unknown as Response;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('retorna o status code correto (409) para erros baseados em AppError', () => {
    const error = new ConflictError('Já existe um registro com esses dados.');

    errorHandlerMiddleware(error, {} as Request, response, next as NextFunction);

    expect(status).toHaveBeenCalledWith(409);
    expect(json).toHaveBeenCalledWith({
      message: 'Já existe um registro com esses dados.',
    });
    expect(console.error).not.toHaveBeenCalled();
  });

  it('retorna 400 para JSON inválido', () => {
    const error = Object.assign(new SyntaxError('unexpected token'), {
      type: 'entity.parse.failed',
    });

    errorHandlerMiddleware(error, {} as Request, response, next as NextFunction);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ message: 'Corpo da requisição JSON inválido.' });
    expect(console.error).not.toHaveBeenCalled();
  });

  it('retorna erro genérico e registra a exceção não tratada', () => {
    const error = new Error('database connection details');

    errorHandlerMiddleware(error, {} as Request, response, next as NextFunction);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ message: 'Erro interno do servidor.' });
    expect(console.error).toHaveBeenCalledWith('Erro não tratado na API:', error);
  });

  it('encaminha erros se os headers da resposta já foram enviados', () => {
    const error = new Error('response already started');
    const responseWithSentHeaders = { headersSent: true } as Response;

    errorHandlerMiddleware(error, {} as Request, responseWithSentHeaders, next as NextFunction);

    expect(next).toHaveBeenCalledWith(error);
    expect(status).not.toHaveBeenCalled();
    expect(json).not.toHaveBeenCalled();
  });
});
