import { prismaClient } from '../../database/prisma-client.js';
import type { ICustomerRepository } from '../../../domain/customers/repositories/index.js';
import type { Customer } from '../../../domain/customers/entities/index.js';
import type { PaginatedResult, QueryParams } from '../../../domain/common/queries/index.js';

import type {
  CityCustomerCount,
  CustomerFilters,
} from '../../../domain/customers/queries/index.js';

export class PrismaCustomerRepository implements ICustomerRepository {
  private readonly prisma = prismaClient;

  async findById(id: number): Promise<Customer | null> {
    return this.prisma.customer.findUnique({
      where: { id },
    });
  }

  async findAll(params: QueryParams<CustomerFilters>): Promise<PaginatedResult<Customer>> {
    const { page, pageSize } = params.pagination;
    const { cities } = params.filters ?? {};

    const where = {
      ...(cities?.length ? { city: { in: cities } } : {}),
    };

    const [items, totalItems] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
          [params.sort?.sortBy ?? 'id']: params.sort?.sortOrder ?? 'asc',
        },
      }),
      this.prisma.customer.count({ where }),
    ]);

    return {
      items,
      page,
      pageSize,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
    };
  }

  async save(entity: Customer): Promise<Customer> {
    const data = {
      firstName: entity.firstName,
      lastName: entity.lastName,
      email: entity.email,
      gender: entity.gender,
      company: entity.company,
      city: entity.city,
      title: entity.title,
    };

    if (entity.id === undefined) {
      return this.prisma.customer.create({ data });
    }

    return this.prisma.customer.update({
      where: { id: entity.id },
      data,
    });
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.prisma.customer.deleteMany({
      where: { id },
    });

    return result.count > 0;
  }

  async countByCity(): Promise<CityCustomerCount[]> {
    const results = await this.prisma.customer.groupBy({
      by: ['city'],
      where: {
        city: { not: null },
      },
      _count: {
        _all: true,
      },
      orderBy: {
        city: 'asc',
      },
    });

    return results.flatMap((item) =>
      item.city === null
        ? []
        : [
            {
              city: item.city,
              customersTotal: item._count._all,
            },
          ],
    );
  }

  async findDistinctCities(): Promise<string[]> {
    const results = await this.prisma.customer.findMany({
      select: {
        city: true,
      },
      distinct: ['city'],
      where: {
        city: { not: null },
      },
      orderBy: {
        city: 'asc',
      },
    });

    return results.flatMap(({ city }) => (city === null ? [] : [city]));
  }
}
