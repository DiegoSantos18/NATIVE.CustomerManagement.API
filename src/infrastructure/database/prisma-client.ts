import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
dotenvExpand.expand(dotenv.config());
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@prisma/client';

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

export const prismaClient = new PrismaClient({ adapter });
