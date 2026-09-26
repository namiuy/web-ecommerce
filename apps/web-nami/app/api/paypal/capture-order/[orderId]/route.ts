import { config } from '../../../../../lib/config'

export async function POST(_: Request, { params }: { params: { orderId: string } }) {
  try {
    const { orderId } = params

    const res = await fetch(`${config.apiBaseUrl}/paypal/capture-order/${orderId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })

    const data = await res.json()
    return Response.json(data, { status: res.status })
  } catch (error: any) {
    return Response.json({ detail: error.message }, { status: 500 })
  }
}
