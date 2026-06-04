import type { NextApiRequest, NextApiResponse } from 'next'
import { config as appConfig } from '../../../../lib/config'
import { getToken } from '../../../../lib/auth'
import { errorResponse } from '../../../../lib/errors'

// Disable body parser to handle multipart form data
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const token = getToken(req)

    // Read raw body as buffer
    const chunks: Uint8Array[] = []
    for await (const chunk of req) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
    }
    const body = Buffer.concat(chunks)

    // Forward multipart form data to backend
    const backendUrl = `${appConfig.apiBaseUrl}/products/images/upload`

    const headers: Record<string, string> = {
      'Content-Type': req.headers['content-type'] || 'multipart/form-data',
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers,
      body: body as unknown as BodyInit,
    })

    if (!response.ok) {
      const errorText = await response.text()
      return res.status(response.status).json({ error: errorText })
    }

    const data = await response.json()
    return res.status(200).json(data)
  } catch (error) {
    return errorResponse(res, error)
  }
}
