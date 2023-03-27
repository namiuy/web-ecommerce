import { Product } from './product';

export type ProductList = {
  id: number;
  section: string;
  indx: number;
  name: string;
  product_ids: Array<string>;
  products: Array<Product>;
};
