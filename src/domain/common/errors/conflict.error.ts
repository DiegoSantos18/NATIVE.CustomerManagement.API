import { AppError } from './app.error.js';

export class ConflictError extends AppError {
  constructor(message: string = 'Já existe um registro com esses dados.') {
    super(message, 409);
    this.name = 'ConflictError';
  }
}
