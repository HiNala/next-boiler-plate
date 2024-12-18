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

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const post = await getPost(context.params.id)
    if (!post) {
      return new NextResponse('Not Found', { status: 404 })
    }
    return NextResponse.json(post)
  } catch (error) {
    console.error('Error fetching post:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const json = await request.json()
    const body = updatePostSchema.parse(json)

    const post = await updatePost(context.params.id, body, user)
    if (!post) {
      return new NextResponse('Not Found', { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 })
    }
    if (error instanceof Error && error.message === 'Unauthorized') {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    console.error('Error updating post:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    await deletePost(context.params.id, user)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    if (error instanceof Error && error.message === 'Not Found') {
      return new NextResponse('Not Found', { status: 404 })
    }
    console.error('Error deleting post:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 