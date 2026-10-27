export interface IRepository<T> {
  findById(id: string | number): Promise<T | null>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<T>;
  delete(id: string | number): Promise<boolean>;
}
