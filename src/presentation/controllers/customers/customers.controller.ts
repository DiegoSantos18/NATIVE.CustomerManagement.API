import type { NextFunction, Request, Response } from 'express';
import { BaseController } from '../index.js';
import {
  CountCustomersByCityUseCase,
  GetCustomerByIdUseCase,
  ListCustomersUseCase,
  UpdateCustomerUseCase,
} from '../../../application/customers/use-cases/index.js';
import {
  validateListCustomersQuery,
  validateGetCustomerById,
  validateUpdateCustomer,
} from '../../validators/customers/index.js';

export class CustomersController extends BaseController {
  constructor(
    private readonly countCustomersByCityUseCase: CountCustomersByCityUseCase,
    private readonly listCustomersUseCase: ListCustomersUseCase,
    private readonly getCustomerByIdUseCase: GetCustomerByIdUseCase,
    private readonly updateCustomerUseCase: UpdateCustomerUseCase,
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

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validation = validateGetCustomerById(req.params);

      if (!validation.success) {
        this.badRequest(res, validation.message);
        return;
      }

      const result = await this.getCustomerByIdUseCase.execute(validation.data);

      if (!result) {
        this.notFound(res, 'Cliente não encontrado.');
        return;
      }

      this.ok(res, result);
    } catch (error: unknown) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const idValidation = validateGetCustomerById(req.params);

      if (!idValidation.success) {
        this.badRequest(res, idValidation.message);
        return;
      }

      const bodyValidation = validateUpdateCustomer(req.body);

      if (!bodyValidation.success) {
        this.badRequest(res, bodyValidation.message);
        return;
      }

      const result = await this.updateCustomerUseCase.execute(
        idValidation.data,
        bodyValidation.data,
      );

      if (!result) {
        this.notFound(res, 'Cliente não encontrado.');
        return;
      }

      this.ok(res, result);
    } catch (error: unknown) {
      next(error);
    }
  };
}
