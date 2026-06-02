import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from '../../../lib/auth'
import { getStockByCode } from '../../../lib/services/stock.service'
import { errorResponse } from '../../../lib/errors'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { id } = req.query
    if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Product code is required' })

    const token = getToken(req)
    const server = (req.query.server as string) || 'lindo4'
    const stock = await getStockByCode(id, server, token)
    return res.status(200).json(stock)
  } catch (error) {
    return errorResponse(res, error)
  }
}
