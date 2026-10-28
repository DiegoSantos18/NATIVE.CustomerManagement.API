import { PrismaClient } from '@prisma/client';
import { BaseSeed } from '../common/index.js';
import { JsonFileReader } from '../../../src/infrastructure/utils/index.js';
import type { CustomerDTO } from '../../../src/application/customers/dtos/index.js';

export class CustomerSeed extends BaseSeed {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async execute(deleteMany?: boolean): Promise<void> {
    if (deleteMany) {
      await this.prisma.customer.deleteMany();
      console.log('🧹 Clientes limpos com sucesso.');
    }

    console.log('🌱 A iniciar o processo de Seed de Clientes...');
    const customers = JsonFileReader.read<CustomerDTO[]>('prisma/data/customers/customers.json');
    let totalCount = 0;

    for (const item of customers) {
      await this.prisma.customer.create({
        data: {
          firstName: item.firstName ?? 'Unknown',
          lastName: item.lastName ?? null,
          email: item.email,
          gender: item.gender ?? null,
          company: item.company ?? null,
          city: item.city ?? null,
          title: item.title ?? null,
        },
      });
      totalCount++;
    }

    console.log(`✅ ${totalCount} clientes inseridos com sucesso a partir do customers.json!`);
  }
}
