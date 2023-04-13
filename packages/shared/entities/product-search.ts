import { Product } from './product';

export type ProductSearchFilters = {
  brandIds: Array<number>;
  categoryIds: Array<string>;
};

export type ProductSearch = {
  products: Array<Product>;
  filters: ProductSearchFilters;
};
