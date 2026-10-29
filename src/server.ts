import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { container } from './infrastructure/di/container.js';
import { CustomersController } from './presentation/controllers/customers/index.js';
import { createCustomersRoutes } from './presentation/routes/customers/customers.routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Global middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'NATIVE API is running',
  });
});

// Create Routes
app.use('/customers', createCustomersRoutes(container.get(CustomersController)));

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
