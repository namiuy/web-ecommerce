import { apiFetch } from '../api-client'
import type { Brand } from 'shared/entities/brand'

export async function listBrands(): Promise<Brand[]> {
  const response = await apiFetch<any>('/brands')
  const items: Brand[] = response.data
  return items.sort((a, b) => a.name.localeCompare(b.name))
}
