import { z } from 'zod';
import { Model } from '../types/model.js';
import { Sql } from 'postgres';

export const Customer = z.object({
  id: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  age: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Customer = z.infer<typeof Customer>;

export const CustomerCreate = Customer.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type CustomerCreate = z.infer<typeof CustomerCreate>;

export class CustomerModel extends Model<typeof Customer, typeof CustomerCreate> {
  constructor(sql: Sql) {
    super(sql, 'customer', Customer, 'id');
  }
}
