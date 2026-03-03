import { Result } from '../types';
import { Product, ProductSearch, ProductRelated } from '../entities';
export type SearchFilters = {
    brand?: number;
    category?: string;
    words?: Array<string>;
};
export type ProductSearchSortBy = 'rel' | 'plo' | 'phi';
export type IProductRepository = {
    add: (product: Product) => Promise<Result<Product>>;
    get: (id: string) => Promise<Result<Product>>;
    getByIds: (ids: Array<string>) => Promise<Result<Array<Product>>>;
    search: (filters: SearchFilters, sortBy: ProductSearchSortBy, index: number) => Promise<Result<ProductSearch>>;
    related: (id: string) => Promise<Result<ProductRelated>>;
    update: (product: Product) => Promise<Result<Product>>;
    delete: (id: string) => Promise<Result<boolean>>;
};
//# sourceMappingURL=product.repository.d.ts.map