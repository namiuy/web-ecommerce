import { Product } from './product';

export type ProductList = {
  id: number;
  section: string;
  indx: number;
  name: string;
  productIds: Array<string>;
  products: Array<Product>;
};
