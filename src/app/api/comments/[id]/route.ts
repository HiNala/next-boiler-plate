import { NextRequest } from 'next/server'
import { updateComment, deleteComment, getComment } from '@/lib/services/comment'
import { getAuthUser } from '@/lib/auth'
import { CommentUpdateSchema } from '@/lib/validations/comment'
import { AuthenticationError, createRouteHandler } from '@/lib/errors'

interface RouteContext {
  params: { id: string }
}

export const GET = createRouteHandler(async (
  request: NextRequest,
  context: RouteContext
) => {
  const comment = await getComment(context.params.id)
  
  // Set cache headers for GET requests
  const headers = new Headers()
  headers.set('Cache-Control', 's-maxage=60, stale-while-revalidate')
  
  return { comment, headers }
})

export const PUT = createRouteHandler(async (
  request: NextRequest,
  context: RouteContext
) => {
  const user = await getAuthUser()
  if (!user) {
    throw new AuthenticationError()
  }

  const json = await request.json()
  const body = CommentUpdateSchema.parse(json)

  const comment = await updateComment(context.params.id, body, user)
  return { comment }
})

export const DELETE = createRouteHandler(async (
  request: NextRequest,
  context: RouteContext
) => {
  const user = await getAuthUser()
  if (!user) {
    throw new AuthenticationError()
  }

  await deleteComment(context.params.id, user)
  return null
}) 