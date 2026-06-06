import { apiFetch } from '../api-client'
import type { Product } from 'shared/entities/product'
import type { ProductSearch } from 'shared/entities/product-search'

// --- Types ---

type SearchFilters = {
  brand?: number
  category?: string
  words?: string[]
}

// --- Constants ---

const ROWS_MAX = 12

// --- Service functions ---

export async function searchProducts(
  filters: SearchFilters,
  sortBy: string,
  index: number,
  token?: string | null,
): Promise<ProductSearch> {
  const skip = ROWS_MAX * index

  if (filters.words?.length) {
    const response = await apiFetch<any>(
      '/products/search',
      {
        method: 'POST',
        body: { keywords: filters.words, skip, limit: ROWS_MAX, only_public: false },
        token,
      },
    )
    return {
      products: response.data,
      count: response.count,
      filters: {
        brandIds: Array.from(new Set(response.data.map((p: Product) => p.brand.id))),
        categoryIds: Array.from(new Set(response.data.map((p: Product) => p.category.id))),
      },
    }
  }

  if (filters.brand || filters.category) {
    const params = new URLSearchParams()
    if (filters.brand) params.append('brand_id', filters.brand.toString())
    if (filters.category) params.append('category_id', filters.category)
    params.append('skip', skip.toString())
    params.append('limit', ROWS_MAX.toString())

    const response = await apiFetch<any>(
      `/products/filter?${params.toString()}`,
      { token },
    )
    return {
      products: response.data,
      count: response.count,
      filters: {
        brandIds: Array.from(new Set(response.data.map((p: Product) => p.brand.id))),
        categoryIds: Array.from(new Set(response.data.map((p: Product) => p.category.id))),
      },
    }
  }

  // Default: list all products
  const params = new URLSearchParams()
  params.append('skip', skip.toString())
  params.append('limit', ROWS_MAX.toString())

  const response = await apiFetch<any>(
    `/products?${params.toString()}`,
    { token },
  )
  return {
    products: response.data,
    count: response.count,
    filters: {
      brandIds: Array.from(new Set(response.data.map((p: Product) => p.brand.id))),
      categoryIds: Array.from(new Set(response.data.map((p: Product) => p.category.id))),
    },
  }
}

export async function getProduct(id: string, token?: string | null): Promise<Product> {
  const response = await apiFetch<any>(`/products/${id}/full`, { token })
  return response.data
}

export async function getRelatedProducts(
  id: string,
  token?: string | null,
): Promise<{ products: Product[] }> {
  const product = await getProduct(id, token)
  const relatedIds = product.related_links.map((link) => link.name)

  if (relatedIds.length === 0) {
    return { products: [] }
  }

  const results = await Promise.allSettled(relatedIds.map((rid) => getProduct(rid, token)))
  const products = results
    .filter((r): r is PromiseFulfilledResult<Product> => r.status === 'fulfilled')
    .map((r) => r.value)

  return { products }
}

export async function addProduct(
  product: Partial<Product>,
  token: string,
): Promise<Product> {
  const response = await apiFetch<any>('/products', {
    method: 'POST',
    body: product,
    token,
  })
  return response.data ?? response
}

export async function updateProduct(
  id: string,
  product: Partial<Product>,
  token: string,
): Promise<Product> {
  const response = await apiFetch<any>(`/products/${id}`, {
    method: 'PUT',
    body: product,
    token,
  })

  // If specifications or related_links changed, use clear-update endpoint
  if (product.specifications || product.related_links) {
    const clearData: any = {}
    if (product.specifications) {
      clearData.specifications = product.specifications.map((s: any) => ({
        SpecificationKey: s.name || s.key,
        SpecificationValue: s.value,
      }))
    }
    if (product.related_links) {
      clearData.relatedLinks = product.related_links.map((l: any) => ({
        RelatedProductCode: l.name,
      }))
    }
    await apiFetch<any>(`/products/${id}/clear-update`, {
      method: 'PATCH',
      body: clearData,
      token,
    })
  }

  return response.data ?? response
}

export async function deleteProduct(id: string, token: string): Promise<void> {
  await apiFetch(`/products/${id}`, {
    method: 'DELETE',
    token,
  })
}

export async function getAvailableFilters(
  brandId?: number,
  categoryId?: string,
): Promise<{ brandIds: number[]; categoryIds: string[] }> {
  const params = new URLSearchParams()
  if (brandId) params.append('brand_id', brandId.toString())
  if (categoryId) params.append('category_id', categoryId)
  return apiFetch<any>(`/products/available-filters?${params.toString()}`)
}
