import { apiFetch } from '../api-client'
import { config } from '../config'

// Autoparts-specific endpoints (proxy to api_autoparts)

export async function getProductTypes(): Promise<string[]> {
  return apiFetch<string[]>('/product-type-search/product-types/', {
    baseUrl: config.autopartsApiBaseUrl,
  })
}

export async function getBrandsByProductType(productType: string): Promise<string[]> {
  return apiFetch<string[]>(`/product-type-search/brands-by-product-type/?product_type=${encodeURIComponent(productType)}`, {
    baseUrl: config.autopartsApiBaseUrl,
  })
}

export async function getModelsByBrandAndProductType(productType: string, brand: string): Promise<string[]> {
  return apiFetch<string[]>(`/product-type-search/models-by-brand-and-product-type/?product_type=${encodeURIComponent(productType)}&brand=${encodeURIComponent(brand)}`, {
    baseUrl: config.autopartsApiBaseUrl,
  })
}

export async function searchBySelection(productType: string, brand: string, model: string, token?: string | null): Promise<any[]> {
  return apiFetch<any[]>(`/product-type-search/search-by-selection/?product_type=${encodeURIComponent(productType)}&brand=${encodeURIComponent(brand)}&model=${encodeURIComponent(model)}`, {
    baseUrl: config.autopartsApiBaseUrl,
    token,
  })
}

export async function smartSearch(query: string, limit: number = 50, token?: string | null): Promise<any[]> {
  return apiFetch<any[]>('/search/smart/', {
    method: 'POST',
    body: { query, limit },
    baseUrl: config.autopartsApiBaseUrl,
    token,
  })
}

export async function searchByCode(code: string): Promise<any> {
  return apiFetch<any>(`/api/productos/buscar-codigo/${encodeURIComponent(code)}`, {
    baseUrl: config.autopartsApiBaseUrl,
  })
}

export async function getAutopartStock(code: string): Promise<any> {
  return apiFetch<any>(`/api/stock/${encodeURIComponent(code.trim())}?servidor=lindo4`, {
    baseUrl: config.autopartsApiBaseUrl,
    timeout: 15000,
  })
}
