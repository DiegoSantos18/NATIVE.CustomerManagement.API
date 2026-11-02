import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { container } from './infrastructure/di/container.js';
import { CustomersController } from './presentation/controllers/customers/index.js';
import { createCustomersRoutes } from './presentation/routes/customers/customers.routes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
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
