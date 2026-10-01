import getConfig from 'next/config'

export const dynamic = 'force-dynamic'

export async function GET() {
  const { publicRuntimeConfig } = getConfig() || {}
  const methods = publicRuntimeConfig?.paymentMethods || []
  return Response.json(methods)
}
