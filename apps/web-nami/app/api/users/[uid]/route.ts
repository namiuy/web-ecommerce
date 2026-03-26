import { errorResponse } from '../../../../lib/errors'
import { getUserByFirebaseUid } from '../../../../lib/services/user.service'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { uid: string } }
) {
  try {
    const { uid } = params

    // Get auth token from cookie
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value || null

    // Fetch user from backend using the service
    const user = await getUserByFirebaseUid(uid, token)

    return Response.json(user)
  } catch (error) {
    return errorResponse(error)
  }
}
