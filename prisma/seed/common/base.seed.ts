import { PrismaClient } from '@prisma/client';

export abstract class BaseSeed {
  constructor(protected readonly prisma: PrismaClient) {}

  abstract execute(deleteMany?: boolean): Promise<void>;

  /**
   * Converte e valida o identificador recebido do arquivo de Seed.
   *
   * Garante que o ID seja um número inteiro positivo e seguro,
   * evitando identificadores inválidos durante a persistência.
   */
  protected parseId(id: string | number | null | undefined): number {
    if (id === null || id === undefined || String(id).trim() === '') {
      throw new Error('ID não informado ou inválido no arquivo de Seed.');
    }

    const parsedId = Number(id);

    if (!Number.isSafeInteger(parsedId) || parsedId <= 0) {
      throw new Error(`ID inválido encontrado no arquivo de Seed: ${id}`);
    }

    return parsedId;
  }
}
