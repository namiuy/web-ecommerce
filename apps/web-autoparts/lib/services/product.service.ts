import { apiFetch } from '../api-client'
import { config } from '../config'

const BASE = config.autopartsApiBaseUrl

// Smart search (text-based)
export async function searchProducts(query: string, limit: number = 50, isAdmin: boolean = false) {
  const endpoint = isAdmin ? '/search/admin/' : '/search/smart/'
  return apiFetch<any[]>(endpoint, {
    method: 'POST',
    body: { query, limit },
    baseUrl: BASE,
  })
}

// Search by code
export async function getProductByCode(code: string, isAdmin: boolean = false) {
  const endpoint = isAdmin
    ? `/api/productos/admin/buscar-codigo/${encodeURIComponent(code)}`
    : `/api/productos/buscar-codigo/${encodeURIComponent(code)}`
  return apiFetch<any>(endpoint, { baseUrl: BASE })
}

// Partial code search
export async function searchByPartialCode(code: string, limit: number = 50, isAdmin: boolean = false) {
  const endpoint = isAdmin
    ? `/api/productos/admin/buscar-parcial/${encodeURIComponent(code)}`
    : `/api/productos/buscar-parcial/${encodeURIComponent(code)}`
  return apiFetch<any>(endpoint, { baseUrl: BASE })
}

// Product type search (cascading dropdowns)
export async function getProductTypes() {
  return apiFetch<string[]>('/product-type-search/product-types/', { baseUrl: BASE })
}

export async function getBrandsByProductType(productType: string) {
  return apiFetch<string[]>(`/product-type-search/brands-by-product-type/?product_type=${encodeURIComponent(productType)}`, { baseUrl: BASE })
}

export async function getModelsByBrandAndProductType(productType: string, brand: string) {
  return apiFetch<string[]>(`/product-type-search/models-by-brand-and-product-type/?product_type=${encodeURIComponent(productType)}&brand=${encodeURIComponent(brand)}`, { baseUrl: BASE })
}

export async function searchBySelection(productType: string, brand: string, model: string, isAdmin: boolean = false) {
  const endpoint = isAdmin
    ? '/product-type-search/admin/search-by-selection/'
    : '/product-type-search/search-by-selection/'
  return apiFetch<any[]>(`${endpoint}?product_type=${encodeURIComponent(productType)}&brand=${encodeURIComponent(brand)}&model=${encodeURIComponent(model)}`, { baseUrl: BASE })
}

// Stock
export async function getStock(code: string) {
  return apiFetch<any>(`/api/stock/${encodeURIComponent(code.trim())}?servidor=lindo4`, {
    baseUrl: BASE,
    timeout: 15000,
  })
}
