import { apiFetch } from '../api-client'
import type { Order } from 'shared/entities/order'

// --- Service functions ---

export async function listMyOrders(token: string): Promise<{ orders: Order[]; count: number }> {
  const response = await apiFetch<any>('/orders/user/me', { token })
  return {
    orders: response.data,
    count: response.count,
  }
}

export async function listOrdersByGuid(
  guid: string,
  token: string,
): Promise<{ orders: Order[]; count: number }> {
  const params = new URLSearchParams({ guid })
  const response = await apiFetch<any>(
    `/orders?${params.toString()}`,
    { token },
  )
  return {
    orders: response.data,
    count: response.count,
  }
}

export async function listAllOrders(token: string): Promise<{ orders: Order[]; count: number }> {
  const response = await apiFetch<any>('/orders/user/me', { token })
  return {
    orders: response.data,
    count: response.count,
  }
}

export async function checkout(
  data: { shippingId: string; paymentId: string; addressIdx: number; observation?: string },
  token: string,
): Promise<Order> {
  const response = await apiFetch<any>('/cart/checkout', {
    method: 'POST',
    body: {
      shipping_id: data.shippingId,
      payment_id: data.paymentId,
      address_idx: data.addressIdx,
      observation: data.observation,
    },
    token,
  })
  return response.order
}
