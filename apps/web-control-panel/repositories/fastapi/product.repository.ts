import {
  IProductRepository,
  Product,
  ProductSearch,
  ProductRelated,
  SearchFilters,
  ProductSearchSortBy,
  Result,
  createSuccessResult,
  createErrorResult,
  createUnhandledError,
  NOT_FOUND,
} from '@namiuy/bff-core';

// FastAPI types
type FastAPIProduct = {
  ProductCode: string;
  ProductName: string;
  ProductDescription?: string;
  ProductLongDescription?: string;
  ProductPrice: number;
  ProductIsOriginal: boolean;
  ProductIsPublic: boolean;
  ProductCreationDate: string;
  BrandId: number;
  BrandName?: string;
  CategoryId: string;
  CategoryName?: string;
  Multimedias?: Array<{
    MultimediaName: string;
    MultimediaType: string;
    MultimediaOrder: number;
  }>;
  Specifications?: Array<{
    SpecificationKey: string;
    SpecificationValue: string;
  }>;
  RelatedLinks?: Array<{
    RelatedProductCode: string;
  }>;
};

type FastAPIResponse<T> = {
  success: boolean;
  count: number;
  data: T;
};

const ROWS_MAX = 12;

// Mapper functions (pure)
const mapProduct = (imagesUrl: string) => (data: FastAPIProduct): Product => {
  const multimedias = data.Multimedias?.map(m => ({
    name: m.MultimediaName,
    type: (m.MultimediaType?.toLowerCase() === 'video' ? 'video' : 'photo') as 'photo' | 'video',
    url: `${imagesUrl}/${encodeURIComponent(m.MultimediaName)}`,
  })) || [];

  const images = multimedias.filter(m => m.type === 'photo').map(m => m.url);

  if (multimedias.length === 0) {
    const defaultImageUrl = `${imagesUrl}/${encodeURIComponent(data.ProductCode)}.jpg`;
    multimedias.push({
      name: `${data.ProductCode}.jpg`,
      type: 'photo',
      url: defaultImageUrl,
    });
    images.push(defaultImageUrl);
  }

  return {
    id: data.ProductCode,
    is_original: data.ProductIsOriginal,
    is_public: data.ProductIsPublic,
    created_at: new Date(data.ProductCreationDate),
    name: data.ProductName?.trim() || '',
    description: data.ProductDescription || '',
    price: data.ProductPrice,
    image_url: images[0] || `${imagesUrl}/${encodeURIComponent(data.ProductCode)}.jpg`,
    path: '',
    brand: {
      id: data.BrandId,
      name: data.BrandName || '',
      logo_url: '',
    },
    category: {
      id: data.CategoryId,
      name: data.CategoryName || '',
      image_url: '',
    },
    specifications: data.Specifications?.map(spec => ({
      name: spec.SpecificationKey,
      value: spec.SpecificationValue,
    })) || [],
    related_links: data.RelatedLinks?.map(link => ({
      name: link.RelatedProductCode,
      url: `/product/${link.RelatedProductCode}`,
    })) || [],
    price_without_tax: 0,
    discount: 0,
    colors: [],
  };
};

const mapProductToAPI = (product: Product): Partial<FastAPIProduct> => ({
  ProductCode: product.id,
  ProductName: product.name,
  ProductDescription: product.description,
  ProductPrice: product.price,
  ProductIsOriginal: product.is_original,
  ProductIsPublic: product.is_public,
  BrandId: product.brand?.id,
  CategoryId: product.category?.id,
});

// Repository factory (functional approach)
export const createProductRepositoryFastAPI = (
  apiBaseUrl: string,
  imagesUrl: string,
  getAuthToken?: () => string | null
): IProductRepository => {
  const mapper = mapProduct(imagesUrl);

  const getHeaders = (): HeadersInit => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (getAuthToken) {
      const token = getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return headers;
  };

  const repository: IProductRepository = {
    add: async (product: Product): Promise<Result<Product>> => {
      try {
        const body = mapProductToAPI(product);
        const response = await fetch(`${apiBaseUrl}/products`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          const errorText = await response.text();
          return createErrorResult(createUnhandledError(errorText));
        }

        const apiProduct = (await response.json()) as FastAPIProduct;
        return createSuccessResult(mapper(apiProduct));
      } catch (error) {
        return createErrorResult(createUnhandledError((error as Error).message));
      }
    },

    get: async (id: string): Promise<Result<Product>> => {
      try {
        const response = await fetch(`${apiBaseUrl}/products/${id}/full`, {
          method: 'GET',
          headers: getHeaders(),
        });

        if (!response.ok) {
          if (response.status === 404) {
            return createErrorResult(NOT_FOUND);
          }
          const errorText = await response.text();
          return createErrorResult(createUnhandledError(errorText));
        }

        const apiResponse = (await response.json()) as FastAPIResponse<FastAPIProduct>;
        return createSuccessResult(mapper(apiResponse.data));
      } catch (error) {
        return createErrorResult(createUnhandledError((error as Error).message));
      }
    },

    getByIds: async (ids: Array<string>): Promise<Result<Array<Product>>> => {
      const results = await Promise.all(ids.map(id => repository.get(id)));
      const products = results.map(r => r.data).filter((p): p is Product => !!p);
      return createSuccessResult(products);
    },

    search: async (
      { brand, category, words }: SearchFilters,
      sortBy: ProductSearchSortBy,
      index: number
    ): Promise<Result<ProductSearch>> => {
      try {
        let endpoint = '';
        let body: any = {};
        let method = 'GET';

        if (words?.length) {
          endpoint = `${apiBaseUrl}/products/search`;
          method = 'POST';
          body = {
            keywords: words,
            skip: ROWS_MAX * index,
            limit: ROWS_MAX,
          };
        } else if (brand || category) {
          const params = new URLSearchParams();
          if (brand) params.append('brand_id', brand.toString());
          if (category) params.append('category_id', category);
          params.append('skip', (ROWS_MAX * index).toString());
          params.append('limit', ROWS_MAX.toString());
          endpoint = `${apiBaseUrl}/products/filter?${params.toString()}`;
        } else {
          const params = new URLSearchParams();
          params.append('skip', (ROWS_MAX * index).toString());
          params.append('limit', ROWS_MAX.toString());
          endpoint = `${apiBaseUrl}/products?${params.toString()}`;
        }

        const response = await fetch(endpoint, {
          method,
          headers: getHeaders(),
          body: method === 'POST' ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
          const errorText = await response.text();
          return createErrorResult(createUnhandledError(errorText));
        }

        const apiResponse = (await response.json()) as FastAPIResponse<Array<FastAPIProduct>>;
        const products = apiResponse.data.map(mapper);

        const brandIds = [...new Set(products.map(p => p.brand.id))];
        const categoryIds = [...new Set(products.map(p => p.category.id))];

        return createSuccessResult({
          products,
          count: apiResponse.count,
          filters: { brandIds, categoryIds },
        });
      } catch (error) {
        return createErrorResult(createUnhandledError((error as Error).message));
      }
    },

    related: async (id: string): Promise<Result<ProductRelated>> => {
      const productResult = await repository.get(id);
      if (productResult.error) {
        return createErrorResult(productResult.error);
      }

      const relatedIds = productResult.data?.related_links.map(link => link.name) || [];
      if (relatedIds.length === 0) {
        return createSuccessResult({ products: [] });
      }

      const relatedResults = await Promise.all(relatedIds.map(rid => repository.get(rid)));
      const relatedProducts = relatedResults.map(r => r.data).filter((p): p is Product => !!p);

      return createSuccessResult({ products: relatedProducts });
    },

    update: async (product: Product): Promise<Result<Product>> => {
      try {
        const body = mapProductToAPI(product);
        const response = await fetch(`${apiBaseUrl}/products/${product.id}`, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          const errorText = await response.text();
          return createErrorResult(createUnhandledError(errorText));
        }

        const apiProduct = (await response.json()) as FastAPIProduct;
        return createSuccessResult(mapper(apiProduct));
      } catch (error) {
        return createErrorResult(createUnhandledError((error as Error).message));
      }
    },

    delete: async (id: string): Promise<Result<boolean>> => {
      try {
        const response = await fetch(`${apiBaseUrl}/products/${id}`, {
          method: 'DELETE',
          headers: getHeaders(),
        });

        if (!response.ok) {
          const errorText = await response.text();
          return createErrorResult(createUnhandledError(errorText));
        }

        return createSuccessResult(true);
      } catch (error) {
        return createErrorResult(createUnhandledError((error as Error).message));
      }
    },
  };

  return repository;
};
