import { apiFetch } from '../api-client'
import type { Person } from 'shared/entities/person'
import type { PersonUpdate } from 'shared/entities/person-update'

// --- Service functions ---

export async function getPerson(id: string, token: string): Promise<Person> {
  console.log('[person.service] getPerson called with id:', id)
  const raw = await apiFetch<any>(`/persons/${id}`, { token })
  console.log('[person.service] Response from backend:', raw)
  const person = (raw.person ?? raw) as Person
  console.log('[person.service] Returning person:', person)
  return person
}

export async function updatePerson(person: PersonUpdate, token: string): Promise<boolean> {
  await apiFetch(`/persons/${person.id}`, {
    method: 'PUT',
    body: person,
    token,
  })
  return true
}
