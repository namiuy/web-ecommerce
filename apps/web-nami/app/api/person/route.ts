import { requireToken } from '../../../lib/auth'
import { errorResponse, badRequest } from '../../../lib/errors'
import { getPerson, updatePerson } from '../../../lib/services/person.service'

export async function GET(request: Request) {
  try {
    const token = requireToken(request)
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) return badRequest('Person ID is required')

    const person = await getPerson(id, token)
    return Response.json(person)
  } catch (error) {
    return errorResponse(error)
  }
}

export async function PUT(request: Request) {
  try {
    const token = requireToken(request)
    const body = await request.json()
    const result = await updatePerson(body, token)
    return Response.json({ success: result })
  } catch (error) {
    return errorResponse(error)
  }
}
