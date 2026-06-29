import type { NextApiRequest, NextApiResponse } from 'next'
import { getStock } from '../../../lib/services/product.service'

function mapStock(raw: any) {
  const total = raw.total || 0
  const branches = [
    { code: 'NA', quant: raw.stockNami || 0 },
    { code: 'CL', quant: raw.stockClima || 0 },
    { code: 'SI', quant: raw.stockSircal || 0 },
    { code: 'LA', quant: raw.stockLafelor || 0 },
    { code: 'AL', quant: raw.stockAlodenar || 0 },
  ].filter(b => b.quant > 0)

  const availability = total > 0 ? 'AV' : 'CO'

  return { availability, branches, total }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Stock ID is required' })
    }
    const raw = await getStock(id)
    res.json(mapStock(raw))
  } catch (error: any) {
    console.error('[api/stocks/[id]]', error)
    res.status(error.status || 500).json({ error: error.message || 'Internal Server Error' })
  }
}
