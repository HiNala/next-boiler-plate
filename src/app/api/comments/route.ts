import { NextRequest, NextResponse } from 'next/server'
import { createComment, getComments } from '@/lib/services/comment'
import { getAuthUser } from '@/lib/auth'
import { CommentSchema, CommentPaginationSchema, CommentWhereSchema } from '@/lib/validations/comment'
import { AppError } from '@/lib/errors'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) {
      throw new AppError('Unauthorized', 401)
    }

    const json = await request.json()
    const body = CommentSchema.parse(json)

    const comment = await createComment(body, user.id)
    return NextResponse.json(comment)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      )
    }
    console.error('Error in POST /api/comments:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
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

    return NextResponse.json(result, { headers })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      )
    }
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      )
    }
    console.error('Error in GET /api/comments:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 