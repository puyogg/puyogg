import { z } from 'zod';
import { Model } from '../types/model.js';
import type { Sql } from 'postgres';

export const Order = z.object({
  id: z.string().uuid(),
  customerId: z.string().uuid(),
  item: z.string(),
  quantity: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Order = z.infer<typeof Order>;

export const OrderCreate = Order.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type OrderCreate = z.infer<typeof OrderCreate>;

const OrderId = Order.pick({ id: true });
type OrderId = z.infer<typeof OrderId>;

export class OrderModel extends Model<typeof Order, typeof OrderCreate> {
  constructor(sql: Sql) {
    super(sql, 'order', Order, 'id');
  }

  async findByQuantity(quantity: number): Promise<OrderId[]> {
    const result = await this.sql<OrderId[]>`
      SELECT id
      FROM ${this.sql(this.tableName)}
      WHERE quantity = ${quantity}
    `;

    return result;
  }
}
