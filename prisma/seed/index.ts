import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
dotenvExpand.expand(dotenv.config());
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@prisma/client';
import { CustomerSeed } from './customers/index.js';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not defined.');
}

const connection = new URL(databaseUrl);

const adapter = new PrismaMariaDb({
  host: connection.hostname,
  port: Number(connection.port || 3306),
  user: decodeURIComponent(connection.username),
  password: decodeURIComponent(connection.password),
  database: connection.pathname.slice(1),
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 A iniciar o processo de Seed do banco de dados...');

  // Executa os seeders
  await new CustomerSeed(prisma).execute(true);
}

main()
  .catch((e) => {
    console.error('❌ Erro crítico durante a execução do seed:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
