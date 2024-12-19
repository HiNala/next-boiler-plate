import { NextRequest, NextResponse } from 'next/server'
import { updateComment, deleteComment, getComment } from '@/lib/services/comment'
import { getAuthUser } from '@/lib/auth'
import { CommentUpdateSchema } from '@/lib/validations/comment'
import { AppError } from '@/lib/errors'
import { z } from 'zod'

interface RouteContext {
  params: { id: string }
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const comment = await getComment(context.params.id)
    
    // Set cache headers for GET requests
    const headers = new Headers()
    headers.set('Cache-Control', 's-maxage=60, stale-while-revalidate')
    
    return NextResponse.json(comment, { headers })
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      )
    }
    console.error('Error in GET /api/comments/[id]:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const user = await getAuthUser()
    if (!user) {
      throw new AppError('Unauthorized', 401)
    }

    const json = await request.json()
    const body = CommentUpdateSchema.parse(json)

    const comment = await updateComment(context.params.id, body, user)
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
    console.error('Error in PUT /api/comments/[id]:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const user = await getAuthUser()
    if (!user) {
      throw new AppError('Unauthorized', 401)
    }

    await deleteComment(context.params.id, user)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      )
    }
    console.error('Error in DELETE /api/comments/[id]:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 