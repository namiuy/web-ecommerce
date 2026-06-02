import { apiFetch } from '../api-client'
import type { City } from 'shared/entities/city'

export async function listCities(): Promise<City[]> {
  const raw = await apiFetch<any[]>('/cities')
  const data = Array.isArray(raw) ? raw : (raw as any).data ?? raw
  return data.map((c: any) => ({
    id: c.city_id ?? c.id,
    name: c.city_name ?? c.name,
    stateId: c.state_id ?? c.stateId,
    state: c.state_name ?? c.state ?? '',
  }))
}
