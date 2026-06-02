import { apiFetch } from '../api-client'
import type { Banner } from 'shared/entities/banner'

export async function listBanners(): Promise<Banner[]> {
  const response = await apiFetch<any>('/banners')
  const items: Banner[] = response.data
  return items.map((b) => ({
    ...b,
    link: b.link || '',
  }))
}
