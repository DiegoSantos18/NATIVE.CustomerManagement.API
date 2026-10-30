import { Prisma, PrismaClient } from '@prisma/client';
import { JsonFileReaderHelper } from '../../../src/infrastructure/utils/index.js';
import { BaseSeed } from '../common/index.js';
import type { CustomerSeedDTO } from './customer-dto.seed.js';

export class CustomerSeed extends BaseSeed {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async execute(deleteMany?: boolean): Promise<void> {
    console.log('🌱 A iniciar o processo de Seed de Clientes...');

    const customersData = this.getCustomersData();
    const customerIds = customersData.map((customer) => customer.id!);

    /**
     * Executa a remoção opcional e a inserção em uma única transação,
     * garantindo que os dados não fiquem parcialmente atualizados.
     *
     * Os IDs do JSON são preservados para manter a rastreabilidade
     * dos registros originados pelo Seed.
     */
    const operations = [
      ...(deleteMany
        ? [
            this.prisma.customer.deleteMany({
              where: {
                id: {
                  in: customerIds,
                },
              },
            }),
          ]
        : []),
      this.prisma.customer.createMany({
        data: customersData,
      }),
    ];

    const results = await this.prisma.$transaction(operations);
    const createResult = results[results.length - 1];

    if (deleteMany) {
      const deleteResult = results[0];

      console.log(`🧹 ${deleteResult.count} clientes anteriores do Seed removidos.`);
    }

    console.log(
      `✅ ${createResult.count} clientes inseridos com sucesso a partir do customers.json!`,
    );
  }

  /**
   * Lê os clientes do arquivo JSON e converte seus campos
   * para o formato esperado pelo Prisma.
   */
  private getCustomersData(): Prisma.CustomerCreateManyInput[] {
    const customers = JsonFileReaderHelper.read<CustomerSeedDTO[]>(
      'prisma/data/customers/customers.json',
    );

    return customers.map((item) => ({
      id: this.parseId(item.id),
      firstName: item.first_name ?? 'Unknown',
      lastName: item.last_name ?? null,
      email: item.email,
      gender: item.gender ?? null,
      company: item.company ?? null,
      city: item.city ?? null,
      title: item.title ?? null,
    }));
  }
}
