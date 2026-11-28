import { getToken } from '../../../lib/auth'
import { errorResponse } from '../../../lib/errors'
import {
  getCart,
  addToCart,
  updateCartQuantity,
  deleteFromCart,
} from '../../../lib/services/cart.service'

function getAnonymousId(request: Request): string | null {
  return request.headers.get('x-anonymous-id')
}

export async function GET(request: Request) {
  try {
    const token = getToken(request)
    const anonymousId = getAnonymousId(request)
    if (!token && !anonymousId) {
      return Response.json({ error: 'Se requiere autenticación o ID anónimo' }, { status: 401 })
    }
    const cart = await getCart(token, anonymousId)
    return Response.json(cart)
  } catch (error) {
    return errorResponse(error)
  }
}

export async function POST(request: Request) {
  try {
    const token = getToken(request)
    const anonymousId = getAnonymousId(request)
    if (!token && !anonymousId) {
      return Response.json({ error: 'Se requiere autenticación o ID anónimo' }, { status: 401 })
    }
    const body = await request.json()
    const cart = await addToCart(body, token, anonymousId)
    return Response.json(cart)
  } catch (error) {
    return errorResponse(error)
  }
}

export async function PUT(request: Request) {
  try {
    const token = getToken(request)
    const anonymousId = getAnonymousId(request)
    if (!token && !anonymousId) {
      return Response.json({ error: 'Se requiere autenticación o ID anónimo' }, { status: 401 })
    }
    const body = await request.json()
    const cart = await updateCartQuantity(body, token, anonymousId)
    return Response.json(cart)
  } catch (error) {
    return errorResponse(error)
  }
}

export async function DELETE(request: Request) {
  try {
    const token = getToken(request)
    const anonymousId = getAnonymousId(request)
    if (!token && !anonymousId) {
      return Response.json({ error: 'Se requiere autenticación o ID anónimo' }, { status: 401 })
    }
    const body = await request.json()
    const cart = await deleteFromCart(body, token, anonymousId)
    return Response.json(cart)
  } catch (error) {
    return errorResponse(error)
  }
}
