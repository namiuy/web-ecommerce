import { apiFetch } from '../api-client'
import type { ProductList } from 'shared/entities/product-list'

export async function listProductLists(): Promise<ProductList[]> {
  const response = await apiFetch<any>('/product-lists/')
  const data = response.data ?? response
  return data.map((pl: any, index: number) => ({
    id: pl.id,
    section: 'home_a',
    indx: pl.display_order ?? index,
    name: pl.name,
    product_ids: (pl.products ?? []).map((p: any) => p.product_code),
    products: [],
  }))
}

export async function getProductList(id: number): Promise<ProductList> {
  const response = await apiFetch<any>(`/product-lists/${id}/`)
  const pl = response.data ?? response
  const productCodes: string[] = (pl.products ?? []).map((p: any) => p.product_code)

  // Fetch full product details for each product code
  const productResults = await Promise.allSettled(
    productCodes.map((code) => apiFetch<any>(`/products/${code}/full`))
  )

  const products = productResults
    .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
    .map((r) => r.value.data ?? r.value)

  return {
    id: pl.id,
    section: 'home_a',
    indx: pl.display_order ?? 0,
    name: pl.name,
    product_ids: productCodes,
    products,
  }
}
