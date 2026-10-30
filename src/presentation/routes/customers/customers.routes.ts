import { Router } from 'express';
import type { CustomersController } from '../../controllers/customers/index.js';

export function createCustomersRoutes(customersController: CustomersController): Router {
  const router = Router();

  router.get('/total-by-city', customersController.getTotalByCity);
  router.get('/:id', customersController.getById);
  router.put('/:id', customersController.update);
  router.get('/', customersController.getAll);

  return router;
}
