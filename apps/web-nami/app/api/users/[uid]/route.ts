import { getToken } from '../../../../lib/auth'
import { errorResponse, badRequest } from '../../../../lib/errors'
import { getUserByFirebaseUid } from '../../../../lib/services/user.service'

export async function GET(
  request: Request,
  { params }: { params: { uid: string } },
) {
  try {
    const { uid } = params
    if (!uid) return badRequest('Firebase UID is required')

    const token = getToken(request)
    const user = await getUserByFirebaseUid(uid, token)
    return Response.json(user)
  } catch (error) {
    return errorResponse(error)
  }
}
