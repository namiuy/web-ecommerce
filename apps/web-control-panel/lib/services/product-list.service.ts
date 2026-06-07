import { apiFetch } from '../api-client'
import type { ProductList } from 'shared/entities/product-list'

export async function listProductLists(token?: string | null): Promise<ProductList[]> {
  const response = await apiFetch<any>('/product-lists/', { token })
  const data = response.data ?? response
  return (data || []).map((pl: any, index: number) => ({
    id: pl.id,
    section: pl.section || 'home_a',
    indx: pl.indx ?? pl.display_order ?? index,
    name: pl.name,
    product_ids: pl.product_ids || (pl.products ?? []).map((p: any) => p.product_code),
    products: [],
  }))
}

export async function createProductList(
  data: { name: string; section?: string; indx?: number },
  token: string,
): Promise<any> {
  return apiFetch<any>('/product-lists/', {
    method: 'POST',
    body: {
      name: data.name,
      list_type: data.section || 'home_a',
      display_order: data.indx || 0,
    },
    token,
  })
}

export async function updateProductList(
  id: number,
  data: { name?: string; section?: string; indx?: number },
  token: string,
): Promise<any> {
  return apiFetch<any>(`/product-lists/${id}`, {
    method: 'PUT',
    body: {
      name: data.name,
      list_type: data.section,
      display_order: data.indx,
    },
    token,
  })
}

export async function addProductToList(listId: number, productCode: string, token: string): Promise<any> {
  return apiFetch<any>(`/product-lists/${listId}/products`, {
    method: 'POST',
    body: { product_code: productCode },
    token,
  })
}

export async function removeProductFromList(listId: number, productCode: string, token: string): Promise<any> {
  return apiFetch<any>(`/product-lists/${listId}/products/${encodeURIComponent(productCode)}`, {
    method: 'DELETE',
    token,
  })
}

export async function deleteProductList(id: number, token: string): Promise<any> {
  return apiFetch<any>(`/product-lists/${id}`, {
    method: 'DELETE',
    token,
  })
}
