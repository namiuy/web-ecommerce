import { apiFetch } from '../api-client'
import type { City } from 'shared/entities/city'

export async function listCities(): Promise<City[]> {
  const response = await apiFetch<any>('/cities')
  return response.data ?? response
}
