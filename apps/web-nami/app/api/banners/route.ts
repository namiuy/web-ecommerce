import { errorResponse } from '../../../lib/errors'
import { listBanners } from '../../../lib/services/banner.service'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const banners = await listBanners()
    return Response.json(banners)
  } catch (error) {
    return errorResponse(error)
  }
}
