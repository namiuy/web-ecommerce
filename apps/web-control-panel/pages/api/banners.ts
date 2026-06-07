import type { NextApiRequest, NextApiResponse } from 'next'
import { requireToken } from '../../lib/auth'
import { listBanners, createBanner, updateBanner, deleteBanner } from '../../lib/services/banner.service'
import { errorResponse, methodNotAllowed } from '../../lib/errors'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = requireToken(req)
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body

    switch (req.method) {
      case 'GET': {
        const banners = await listBanners(token)
        return res.status(200).json(banners)
      }
      case 'POST': {
        const result = await createBanner(body, token)
        return res.status(200).json(result)
      }
      case 'PUT': {
        const { id, ...data } = body
        if (id === undefined) return res.status(400).json({ error: 'Banner ID is required' })
        const result = await updateBanner(id, data, token)
        return res.status(200).json(result)
      }
      case 'DELETE': {
        const bannerId = body.id ?? req.query.id
        if (bannerId === undefined) return res.status(400).json({ error: 'Banner ID is required' })
        const result = await deleteBanner(Number(bannerId), token)
        return res.status(200).json(result)
      }
      default:
        return methodNotAllowed(res, ['GET', 'POST', 'PUT', 'DELETE'])
    }
  } catch (error) {
    return errorResponse(res, error)
  }
}
