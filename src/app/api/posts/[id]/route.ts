import { NextRequest, NextResponse } from 'next/server'
import { updatePost, deletePost, getPost } from '@/lib/services/blog'
import { getAuthUser } from '@/lib/auth'
import { z } from 'zod'

const updatePostSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  content: z.string().min(1, 'Content is required').optional(),
  description: z.string().optional(),
  thumbnail: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  published: z.boolean().optional(),
})

interface RouteContext {
  params: { id: string }
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const post = await getPost(context.params.id)
    return NextResponse.json(post)
  } catch (error) {
    if (error instanceof Error && error.message === 'Not Found') {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
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
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const json = await request.json()
    const body = updatePostSchema.parse(json)

    const post = await updatePost(context.params.id, body, user)
    return NextResponse.json(post)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    if (error instanceof Error) {
      switch (error.message) {
        case 'Unauthorized':
          return NextResponse.json(
            { error: 'Unauthorized to modify this post' },
            { status: 401 }
          )
        case 'Not Found':
          return NextResponse.json(
            { error: 'Post not found' },
            { status: 404 }
          )
      }
    }
    console.error('Error updating post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
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
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await deletePost(context.params.id, user)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    if (error instanceof Error) {
      switch (error.message) {
        case 'Unauthorized':
          return NextResponse.json(
            { error: 'Unauthorized to delete this post' },
            { status: 401 }
          )
        case 'Not Found':
          return NextResponse.json(
            { error: 'Post not found' },
            { status: 404 }
          )
      }
    }
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 