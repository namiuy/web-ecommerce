import { Product } from './product';

export type ProductSearchSortBy = 'rel' | 'plo' | 'phi';

export type ProductSearchFilters = {
  brandIds: Array<number>;
  categoryIds: Array<string>;
};

export type ProductSearch = {
  products: Array<Product>;
  filters: ProductSearchFilters;
};

export type ProductSearchOptions = {
  filters?: ProductSearchFilters;
  sortBy?: ProductSearchSortBy;
};
