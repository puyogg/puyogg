import type { Sql } from 'postgres';
import { CustomerModel } from './customer.js';
import { OrderModel } from './order.js';

export const initModels = (sql: Sql) => {
  return {
    customerModel: new CustomerModel(sql),
    orderModel: new OrderModel(sql),
  } as const;
};
export type Models = ReturnType<typeof initModels>;
