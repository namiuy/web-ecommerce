import { getToken, requireToken } from '../../../../lib/auth'
import { errorResponse, badRequest } from '../../../../lib/errors'
import {
  getProduct,
  updateProduct,
  deleteProduct,
} from '../../../../lib/services/product.service'

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const token = getToken(request)
    const { id } = params
    if (!id) return badRequest('Product ID is required')

    const product = await getProduct(id, token)
    return Response.json(product)
  } catch (error) {
    return errorResponse(error)
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const token = requireToken(request)
    const { id } = params
    if (!id) return badRequest('Product ID is required')

    const body = await request.json()
    const product = await updateProduct(id, body, token)
    return Response.json(product)
  } catch (error) {
    return errorResponse(error)
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const token = requireToken(request)
    const { id } = params
    if (!id) return badRequest('Product ID is required')

    await deleteProduct(id, token)
    return Response.json({ success: true })
  } catch (error) {
    return errorResponse(error)
  }
}
