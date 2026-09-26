import { config } from '../../../../lib/config'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const res = await fetch(`${config.apiBaseUrl}/paypal/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    return Response.json(data, { status: res.status })
  } catch (error: any) {
    return Response.json({ detail: error.message }, { status: 500 })
  }
}
