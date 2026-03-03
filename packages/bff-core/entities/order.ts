import { Address } from './address';
import { Person } from './person';
import { OrderItem } from './order-item';
import { Payment } from './payment';
import { Shipping } from './shipping';
import { Status } from './status';

export type Order = {
  id: string;
  number: string;
  user_mail: string;
  date: string;
  person: Partial<Person>;
  phone: string;
  address: Partial<Address>;
  payment: Payment;
  shipping: Shipping;
  status: Status;
  items: OrderItem[];
};
