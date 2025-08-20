export interface AbstractRepository<T> {
  create(data: Partial<T>): Promise<T>;
  findAll?(where: any): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  update(id: string, data: Partial<T>): Promise<T>;
  remove(id: string): Promise<void>;
}
