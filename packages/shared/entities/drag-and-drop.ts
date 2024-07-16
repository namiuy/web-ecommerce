import { Product } from './product';

export type ProductList = {
  id: number;
  section: string;
  indx: number;
  name: string;
  products: Product[];
  product_ids: string[];
};
