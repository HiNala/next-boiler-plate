import { NextRequest } from 'next/server'
import { createComment, getComments } from '@/lib/services/comment'
import { getAuthUser } from '@/lib/auth'
import { CommentSchema, CommentPaginationSchema, CommentWhereSchema } from '@/lib/validations/comment'
import { AuthenticationError, createRouteHandler } from '@/lib/errors'

export const POST = createRouteHandler(async (request: NextRequest) => {
  const user = await getAuthUser()
  if (!user) {
    throw new AuthenticationError()
  }

  const json = await request.json()
  const body = CommentSchema.parse(json)
  const comment = await createComment(body, user.id)
  
  return { comment }
})

export const GET = createRouteHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  
  const pagination = CommentPaginationSchema.parse({
    take: Number(searchParams.get('take') || 10),
    skip: Number(searchParams.get('skip') || 0),
    orderBy: searchParams.get('orderBy') || 'createdAt',
    order: searchParams.get('order') || 'desc',
  })

  const where = CommentWhereSchema.parse({
    postId: searchParams.get('postId') || undefined,
    authorId: searchParams.get('authorId') || undefined,
    parentId: searchParams.get('parentId') || undefined,
    createdAt: searchParams.get('createdAt')
      ? {
          gt: searchParams.get('createdAt_gt')
            ? new Date(searchParams.get('createdAt_gt')!)
            : undefined,
          lt: searchParams.get('createdAt_lt')
            ? new Date(searchParams.get('createdAt_lt')!)
            : undefined,
        }
      : undefined,
  })

  const result = await getComments(where, pagination)
  
  // Set cache headers for GET requests
  const headers = new Headers()
  headers.set('Cache-Control', 's-maxage=60, stale-while-revalidate')

  return { ...result, headers }
}) 