import { config } from '../../../lib/config'

export const dynamic = 'force-dynamic'

export async function GET() {
  return Response.json({
    timestamp: new Date().toISOString(),
    environment: {
      API_BASE_URL: process.env.API_BASE_URL || 'not set',
      NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'not set',
      API_BASE_URL_RAW: process.env.API_BASE_URL_RAW || 'not set',
      NODE_ENV: process.env.NODE_ENV,
    },
    config: {
      apiBaseUrl: config.apiBaseUrl,
      imagesUrl: config.imagesUrl,
      brandsUrl: config.brandsUrl,
    },
    test: {
      message: 'API route is working',
      platform: 'WEB_COMPUTE enabled',
    }
  })
}
