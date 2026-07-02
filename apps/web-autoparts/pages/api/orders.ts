import type { NextApiRequest, NextApiResponse } from 'next'
import { apiFetch } from '../../lib/api-client'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || ''

    if (req.method === 'GET') {
      const guid = req.query.guid as string
      const endpoint = guid ? `/orders?guid=${guid}` : '/orders/user/me'
      const response = await apiFetch<any>(endpoint, { token })
      return res.json({ orders: response.data, count: response.count })
    }

    if (req.method === 'POST') {
      const data = req.body
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
      return res.json(response)
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (error: any) {
    console.error('[api/orders]', error.message)
    res.status(error.status || 500).json({ error: error.message || 'Internal Server Error' })
  }
}
