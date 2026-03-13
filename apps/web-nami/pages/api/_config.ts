import {
  IBrandRepository,
  ICategoryRepository,
  IProductRepository,
  ICartRepository,
  IOrderRepository,
  IPersonRepository,
  IStateRepository,
  ICityRepository,
  IBannerRepository,
  IStockRepository,
} from '@namiuy/bff-core';

import {
  createBrandRepositoryFastAPI,
  createCategoryRepositoryFastAPI,
  createProductRepositoryFastAPI,
  createCartRepositoryFastAPI,
  createOrderRepositoryFastAPI,
  createPersonRepositoryFastAPI,
  createStateRepositoryFastAPI,
  createCityRepositoryFastAPI,
  createBannerRepositoryFastAPI,
} from '../../repositories/fastapi';

import { createStockRepository } from '@namiuy/bff-core';

// Configuration from environment variables
const API_BASE_URL = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
const API_PATH = process.env.API_PATH || '/api';
const IMAGES_URL = process.env.IMAGES_URL || process.env.NEXT_PUBLIC_IMAGES_URL || 'https://nami-tools.s3.sa-east-1.amazonaws.com';
const BRANDS_URL = process.env.BRANDS_URL || process.env.NEXT_PUBLIC_BRANDS_URL || 'https://nami-tools.s3.sa-east-1.amazonaws.com';

export const config = {
  apiBaseUrl: `${API_BASE_URL}${API_PATH}`,
  imagesUrl: IMAGES_URL,
  brandsUrl: BRANDS_URL,
};

// Dependency Injection Container (functional approach)
// This is a singleton pattern to reuse repository instances
type Repositories = {
  brandRepository: IBrandRepository;
  categoryRepository: ICategoryRepository;
  productRepository: IProductRepository;
  cartRepository: ICartRepository;
  orderRepository: IOrderRepository;
  personRepository: IPersonRepository;
  stateRepository: IStateRepository;
  cityRepository: ICityRepository;
  bannerRepository: IBannerRepository;
  stockRepository: IStockRepository;
};

let repositoriesCache: Repositories | null = null;

export const createRepositories = (getAuthToken?: () => string | null): Repositories => {
  if (repositoriesCache && !getAuthToken) {
    return repositoriesCache;
  }

  const brandRepository: IBrandRepository = createBrandRepositoryFastAPI(
    config.apiBaseUrl,
    config.brandsUrl
  );

  const categoryRepository: ICategoryRepository = createCategoryRepositoryFastAPI(
    config.apiBaseUrl
  );

  const productRepository: IProductRepository = createProductRepositoryFastAPI(
    config.apiBaseUrl,
    config.imagesUrl,
    getAuthToken
  );

  const cartRepository: ICartRepository = createCartRepositoryFastAPI(
    config.apiBaseUrl,
    config.imagesUrl,
    getAuthToken
  );

  const orderRepository: IOrderRepository = createOrderRepositoryFastAPI(
    config.apiBaseUrl,
    config.imagesUrl,
    getAuthToken
  );

  const personRepository: IPersonRepository = createPersonRepositoryFastAPI(
    config.apiBaseUrl,
    getAuthToken
  );

  const stateRepository: IStateRepository = createStateRepositoryFastAPI(
    config.apiBaseUrl
  );

  const cityRepository: ICityRepository = createCityRepositoryFastAPI(
    config.apiBaseUrl
  );

  const bannerRepository: IBannerRepository = createBannerRepositoryFastAPI(
    config.apiBaseUrl
  );

  const stockRepository: IStockRepository = createStockRepository(
    API_BASE_URL,
    getAuthToken ? () => getAuthToken() || '' : undefined
  );

  const repositories = {
    brandRepository,
    categoryRepository,
    productRepository,
    cartRepository,
    orderRepository,
    personRepository,
    stateRepository,
    cityRepository,
    bannerRepository,
    stockRepository,
  };

  if (!getAuthToken) {
    repositoriesCache = repositories;
  }

  return repositories;
};

// Helper to clear cache (useful for testing or when config changes)
export const clearRepositoriesCache = () => {
  repositoriesCache = null;
};
