import { Address } from './address';
import { OrderItem } from './order-item';
import { Payment } from './payment';
import { Person } from './person';
import { Shipping } from './shipping';
// import { Status } from './status';

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
  // status: Status;
  status: string;
  items: OrderItem[];
  error?: string;
};
