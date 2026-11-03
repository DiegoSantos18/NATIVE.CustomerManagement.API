import type { ErrorRequestHandler } from 'express';
import { AppError } from '../../domain/common/errors/index.js';

type RequestError = Error & {
  type?: string;
};

export const errorHandlerMiddleware: ErrorRequestHandler = (error: unknown, _req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  // Trata automaticamente qualquer erro de domínio que herde de AppError (Conflict, NotFound, etc.)
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  const requestError = error as RequestError;

  if (requestError?.type === 'entity.parse.failed') {
    res.status(400).json({ message: 'Corpo da requisição JSON inválido.' });
    return;
  }

  if (requestError?.type === 'entity.too.large') {
    res.status(413).json({ message: 'Corpo da requisição excede o limite permitido.' });
    return;
  }

  // Registra o erro inesperado no servidor de forma segura e devolve resposta genérica
  console.error('Erro não tratado na API:', error);
  res.status(500).json({ message: 'Erro interno do servidor.' });
};
