import { Product } from './product';

export type ProductSearch = {
  products: Array<Product>;
  count: number;
  filters: {
    brandIds: Array<number>;
    categoryIds: Array<string>;
  };
};
