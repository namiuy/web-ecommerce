import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Category ID is required' })
  }
  // In api_autoparts, product types are identified by name (id === name)
  res.json({
    id,
    name: id,
    path: '',
    image_url: '',
    is_sub_category: false,
  })
}
