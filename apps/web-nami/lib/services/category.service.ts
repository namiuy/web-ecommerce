import { apiFetch } from '../api-client'
import type { Category } from 'shared/entities/category'

export async function listCategories(): Promise<Category[]> {
  const response = await apiFetch<any>('/categories')
  const items: Category[] = response.data
  return items
    .filter((c) => c.id !== '-1')
    .sort((a, b) => a.name.localeCompare(b.name))
}
