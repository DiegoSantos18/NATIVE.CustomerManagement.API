import type { NextFunction, Request, Response } from 'express';
import { CountCustomersByCityUseCase } from '../../../application/customers/use-cases/index.js';

export class CustomersController {
  constructor(private readonly countCustomersByCityUseCase: CountCustomersByCityUseCase) {}

  getTotalByCity = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.countCustomersByCityUseCase.execute();

      res.status(200).json(result);
    } catch (error: unknown) {
      next(error);
    }
  };
}
