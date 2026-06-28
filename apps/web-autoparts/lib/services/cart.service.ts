import { apiFetch } from '../api-client'
import type { Cart } from 'shared/entities/cart'

// --- Service functions ---

export async function getCart(token: string): Promise<Cart> {
  const response = await apiFetch<any>('/cart/get', { token })
  return response.cart
}

export async function addToCart(
  item: { code: string; quantity?: number },
  token: string,
): Promise<Cart> {
  const response = await apiFetch<any>('/cart/add', {
    method: 'POST',
    body: { code: item.code, quantity: item.quantity || 1 },
    token,
  })
  return response.cart
}

export async function updateCartQuantity(
  item: { code: string; quantity: number },
  token: string,
): Promise<Cart> {
  const response = await apiFetch<any>('/cart/updateQuantity', {
    method: 'POST',
    body: { code: item.code, quantity: item.quantity },
    token,
  })
  return response.cart
}

export async function deleteFromCart(
  item: { code: string },
  token: string,
): Promise<Cart> {
  const response = await apiFetch<any>('/cart/deleteItem', {
    method: 'POST',
    body: { code: item.code },
    token,
  })
  return response.cart
}
