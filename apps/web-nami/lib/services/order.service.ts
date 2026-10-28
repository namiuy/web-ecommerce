import { apiFetch } from '../api-client'
import type { Order } from 'shared/entities/order'

// --- Service functions ---

export async function listMyOrders(token: string): Promise<{ orders: Order[]; result_count: number }> {
  const response = await apiFetch<any>('/orders/user/me', { token })
  const orders = response.data || []
  return {
    orders,
    result_count: orders.length,
  }
}

export async function listOrdersByGuid(
  guid: string,
  token: string,
): Promise<{ orders: Order[]; result_count: number }> {
  const params = new URLSearchParams({ guid })
  const response = await apiFetch<any>(
    `/orders?${params.toString()}`,
    { token },
  )
  const orders = response.data || []
  return {
    orders,
    result_count: orders.length,
  }
}

export async function listAllOrders(token: string): Promise<{ orders: Order[]; result_count: number }> {
  const response = await apiFetch<any>('/orders/user/me', { token })
  const orders = response.data || []
  return {
    orders,
    result_count: orders.length,
  }
}

export async function checkout(
  data: { shippingId: string; paymentId: string; addressIdx: number; observation?: string; paymentTransactionId?: string },
  token: string,
): Promise<Order> {
  const response = await apiFetch<any>('/cart/checkout', {
    method: 'POST',
    body: {
      shipping_id: data.shippingId,
      payment_id: data.paymentId,
      address_idx: data.addressIdx,
      observation: data.observation,
      payment_transaction_id: data.paymentTransactionId,
    },
    token,
  })
  return response.order
}
