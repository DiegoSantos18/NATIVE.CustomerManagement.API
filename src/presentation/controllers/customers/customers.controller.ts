import type { NextFunction, Request, Response } from 'express';

import {
  CountCustomersByCityUseCase,
  ListCustomersUseCase,
} from '../../../application/customers/use-cases/index.js';
import { BaseController } from '../index.js';
import { validateListCustomersQuery } from '../../validators/customers/index.js';

export class CustomersController extends BaseController {
  constructor(
    private readonly countCustomersByCityUseCase: CountCustomersByCityUseCase,
    private readonly listCustomersUseCase: ListCustomersUseCase,
  ) {
    super();
  }

  getTotalByCity = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.countCustomersByCityUseCase.execute();

      this.ok(res, result);
    } catch (error: unknown) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validation = validateListCustomersQuery(req.query);

      if (!validation.success) {
        this.badRequest(res, validation.message);
        return;
      }

      const result = await this.listCustomersUseCase.execute(validation.data);

      this.ok(res, result);
    } catch (error: unknown) {
      next(error);
    }
  };
}
