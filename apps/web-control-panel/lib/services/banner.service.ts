import { apiFetch } from '../api-client'
import type { Banner } from 'shared/entities/banner'

export async function listBanners(token?: string | null): Promise<Banner[]> {
  const response = await apiFetch<any>('/banners/all/', { token })
  const items: Banner[] = response.data || response
  return items.map((b: any) => ({
    ...b,
    id: b.id ?? b.indx,
    link: b.link || '',
  }))
}

export async function createBanner(banner: Partial<Banner>, token: string): Promise<any> {
  return apiFetch<any>('/banners/', {
    method: 'POST',
    body: banner,
    token,
  })
}

export async function updateBanner(id: number, banner: Partial<Banner>, token: string): Promise<any> {
  return apiFetch<any>(`/banners/${id}`, {
    method: 'PUT',
    body: banner,
    token,
  })
}

export async function deleteBanner(id: number, token: string): Promise<any> {
  return apiFetch<any>(`/banners/${id}`, {
    method: 'DELETE',
    token,
  })
}
