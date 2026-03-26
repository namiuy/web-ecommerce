import { requireToken } from '../../../lib/auth'
import { errorResponse, badRequest } from '../../../lib/errors'
import { getPerson, updatePerson } from '../../../lib/services/person.service'

export async function GET(request: Request) {
  try {
    const token = requireToken(request)
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    console.log('[BFF /api/person] GET request for id:', id)

    if (!id) return badRequest('Person ID is required')

    const person = await getPerson(id, token)
    console.log('[BFF /api/person] Response from backend:', person)
    return Response.json(person)
  } catch (error) {
    console.error('[BFF /api/person] Error:', error)
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
