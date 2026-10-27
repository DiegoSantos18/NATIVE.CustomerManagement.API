import { PrismaClient } from '@prisma/client';

export abstract class BaseSeed {
  constructor(protected readonly prisma: PrismaClient) {}

  abstract execute(deleteMany?: boolean): Promise<void>;
}
