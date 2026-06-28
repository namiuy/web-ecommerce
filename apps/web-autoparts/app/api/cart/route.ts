import { requireToken } from '../../../lib/auth'
import { errorResponse } from '../../../lib/errors'
import {
  getCart,
  addToCart,
  updateCartQuantity,
  deleteFromCart,
} from '../../../lib/services/cart.service'

export async function GET(request: Request) {
  try {
    const token = requireToken(request)
    const cart = await getCart(token)
    return Response.json(cart)
  } catch (error) {
    return errorResponse(error)
  }
}

export async function POST(request: Request) {
  try {
    const token = requireToken(request)
    const body = await request.json()
    const cart = await addToCart(body, token)
    return Response.json(cart)
  } catch (error) {
    return errorResponse(error)
  }
}

export async function PUT(request: Request) {
  try {
    const token = requireToken(request)
    const body = await request.json()
    const cart = await updateCartQuantity(body, token)
    return Response.json(cart)
  } catch (error) {
    return errorResponse(error)
  }
}

export async function DELETE(request: Request) {
  try {
    const token = requireToken(request)
    const body = await request.json()
    const cart = await deleteFromCart(body, token)
    return Response.json(cart)
  } catch (error) {
    return errorResponse(error)
  }
}
