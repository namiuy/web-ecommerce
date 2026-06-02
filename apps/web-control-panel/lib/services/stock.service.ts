import { apiFetch } from '../api-client'

export async function getStockByCode(code: string, server = 'lindo4', token?: string | null) {
  const params = new URLSearchParams({ code, server }).toString()
  const response = await apiFetch<any>(`/stock?${params}`, { token })
  return response.stock ?? response
}
