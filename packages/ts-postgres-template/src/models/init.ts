import type { Sql } from 'postgres';
import { CustomerModel } from './customer.js';
import { OrderModel } from './order.js';

export interface Models {
  customerModel: CustomerModel;
  orderModel: OrderModel;
}

export const initModels = (sql: Sql): Models => {
  return {
    customerModel: new CustomerModel(sql),
    orderModel: new OrderModel(sql),
  };
};
