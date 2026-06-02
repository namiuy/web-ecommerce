import { apiFetch } from '../api-client'
import type { State } from 'shared/entities/state'

export async function listStates(): Promise<State[]> {
  const raw = await apiFetch<any[]>('/states')
  return raw.map((s) => ({
    id: s.state_id,
    code: s.state_id,
    name: s.state_name,
  }))
}
