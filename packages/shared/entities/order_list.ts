import { Order } from './order';

export type OrderList = {
  orders: Order[];
  result_count: number;
  error?: string;
};
