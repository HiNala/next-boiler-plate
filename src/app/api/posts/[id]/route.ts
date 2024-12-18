import { NextRequest, NextResponse } from 'next/server'
import { updatePost, deletePost, getPost } from '@/lib/services/blog'
import { createClient } from '@/lib/supabase/server'
import { mapSupabaseUser } from '@/lib/user'
import { z } from 'zod'

const updatePostSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  content: z.string().min(1).optional(),
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
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    return NextResponse.json(post)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = mapSupabaseUser(session.user)

    const json = await request.json()
    const validatedData = updatePostSchema.parse(json)
    
    const post = await updatePost(context.params.id, validatedData, user)
    return NextResponse.json(post)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = mapSupabaseUser(session.user)

    await deletePost(context.params.id, user)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 