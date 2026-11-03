import type { Customer } from '../entities/index.js';

/**
 * Utilitários de tipos do TypeScript:
 *
 * - Pick<T, K>: cria um tipo contendo somente as propriedades selecionadas.
 * - Omit<T, K>: cria um tipo removendo as propriedades selecionadas.
 * - Partial<T>: torna todas as propriedades de um tipo opcionais.
 */
export type CustomerUpdateData = Partial<Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>>;
