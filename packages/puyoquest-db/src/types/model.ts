import type { Sql } from 'postgres';
import { z } from 'zod';

/**
 * A base model/repository class for basic CRUD on any table.
 * This class takes 3 generics: Z, C, T:
 * - `Z`: A ZodObject
 * - `C`: (inferred) A ZodObject representing the "creation" type for the model. It should be a subset of Z.
 * - `T`: (inferred) The plain TypeScript version of Z.
 */
export abstract class Model<
  Z extends z.ZodObject<z.ZodRawShape>,
  C extends z.ZodObject<z.ZodRawShape> = Z,
  T extends z.infer<Z> | object | undefined = z.infer<Z>,
> {
  private modelKeys: string[];

  constructor(
    public sql: Sql,
    public tableName: string,
    private zodModel: Z,
    public primaryKey: string,
  ) {
    this.modelKeys = Object.keys(zodModel.shape);
  }

  async findOne(id: string | number): Promise<T | undefined> {
    const [result] = await this.sql<T[]>`
      SELECT *
      FROM ${this.sql(this.tableName)}
      WHERE ${this.sql(this.primaryKey)} = ${id}
    `;
    return result;
  }

  async findMany(ids: (string | number)[]): Promise<T[]> {
    const { sql, tableName } = this;

    return sql<T[]>`
      SELECT *
      FROM ${sql(tableName)}
      WHERE ${sql(this.primaryKey)} IN ${sql(ids)}
    `;
  }

  /** could this be undefined? */
  async create<Create extends z.infer<C>>(params: Create): Promise<T> {
    const [result] = await this.sql<T[]>`
      INSERT INTO ${this.sql(this.tableName)}
      ${this.sql(params as Record<string, unknown>)}
      RETURNING *  
    `;
    return result;
  }

  async updateOne<Update extends Partial<T>>(
    id: string | number,
    params: Update,
  ): Promise<T | undefined> {
    const [result] = await this.sql<T[]>`
      UPDATE ${this.sql(this.tableName)}
      SET ${this.sql(params as Record<string, unknown>)}
      WHERE ${this.sql(this.primaryKey)} = ${id}
      RETURNING *
    `;

    return result;
  }

  async deleteOne(id: string | number): Promise<number> {
    const [result] = await this.sql<{ count: string }[]>`
      WITH deleted AS (
        DELETE FROM ${this.sql(this.tableName)}
        WHERE ${this.sql(this.primaryKey)} = ${id}
        RETURNING *
      ) SELECT COUNT(*) FROM deleted
    `;

    return parseInt(result?.count ?? '0', 10);
  }
}
