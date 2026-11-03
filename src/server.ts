import path from 'path';
import { createServer } from 'node:http';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { container } from './infrastructure/di/container.js';
import {
  registerCustomersModule,
  registerRealtimeModule,
} from './infrastructure/di/modules/index.js';
import { CustomersController } from './presentation/controllers/customers/index.js';
import { createCustomersRoutes } from './presentation/routes/customers/customers.routes.js';
import { errorHandlerMiddleware } from './presentation/middlewares/error-handler.middleware.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Global middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const httpServer = createServer(app);
const socketServer = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});
registerRealtimeModule(container, socketServer);
registerCustomersModule(container);

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'NATIVE API is running',
  });
});

app.get('/', (_req, res) => {
  res.status(200).type('html').send(`
    <!doctype html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>API - Native IP | Gestão de Clientes</title>
      </head>
      <body>✅ NATIVE API is running!</body>
    </html>`);
});

// TODO: Configurar Swagger UI aqui futuramente
// app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Routes
app.use('/customers', createCustomersRoutes(container.get(CustomersController)));

// 404 Handler
app.use((_req, res) => {
  res.status(404).json({ message: 'Rota não encontrada.' });
});

// 500 Error Handler Global
app.use(errorHandlerMiddleware);

// Inicializa HTTP e Socket.IO no mesmo servidor
httpServer.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
