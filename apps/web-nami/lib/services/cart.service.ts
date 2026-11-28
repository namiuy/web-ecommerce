import { apiFetch } from '../api-client'
import type { Cart } from 'shared/entities/cart'

type AuthInfo = { token?: string | null; anonymousId?: string | null }

function buildHeaders(auth: AuthInfo): Record<string, string> {
  const headers: Record<string, string> = {}
  if (auth.anonymousId) headers['X-Anonymous-Id'] = auth.anonymousId
  return headers
}

export async function getCart(token: string | null, anonymousId: string | null): Promise<Cart> {
  const response = await apiFetch<any>('/cart/get', {
    token,
    extraHeaders: buildHeaders({ anonymousId }),
  })
  return response.cart
}

export async function addToCart(
  item: { code: string; quantity?: number },
  token: string | null,
  anonymousId: string | null,
): Promise<Cart> {
  const response = await apiFetch<any>('/cart/add', {
    method: 'POST',
    body: { code: item.code, quantity: item.quantity || 1 },
    token,
    extraHeaders: buildHeaders({ anonymousId }),
  })
  return response.cart
}

export async function updateCartQuantity(
  item: { code: string; quantity: number },
  token: string | null,
  anonymousId: string | null,
): Promise<Cart> {
  const response = await apiFetch<any>('/cart/updateQuantity', {
    method: 'POST',
    body: { code: item.code, quantity: item.quantity },
    token,
    extraHeaders: buildHeaders({ anonymousId }),
  })
  return response.cart
}

export async function deleteFromCart(
  item: { code: string },
  token: string | null,
  anonymousId: string | null,
): Promise<Cart> {
  const response = await apiFetch<any>('/cart/deleteItem', {
    method: 'POST',
    body: { code: item.code },
    token,
    extraHeaders: buildHeaders({ anonymousId }),
  })
  return response.cart
}

export async function mergeCarts(anonymousId: string, token: string): Promise<Cart> {
  const response = await apiFetch<any>('/cart/merge', {
    method: 'POST',
    body: { anonymous_id: anonymousId },
    token,
  })
  return response.cart
}
