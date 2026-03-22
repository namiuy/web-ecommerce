import { apiFetch } from '../api-client'
import type { Person } from 'shared/entities/person'
import type { PersonUpdate } from 'shared/entities/person-update'

// --- Service functions ---

export async function getPerson(id: string, token: string): Promise<Person> {
  const raw = await apiFetch<any>(`/persons/${id}`, { token })
  return (raw.person ?? raw) as Person
}

export async function updatePerson(person: PersonUpdate, token: string): Promise<boolean> {
  await apiFetch(`/persons/${person.id}`, {
    method: 'PUT',
    body: person,
    token,
  })
  return true
}
