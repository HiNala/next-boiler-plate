import { NextRequest, NextResponse } from 'next/server'
import { createPost, getPosts } from '@/lib/services/blog'
import { createClient } from '@/lib/supabase/server'
import { canManagePosts } from '@/lib/accessControl'
import { mapSupabaseUser } from '@/lib/user'
import { z } from 'zod'

const createPostSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1),
  description: z.string().optional(),
  thumbnail: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  published: z.boolean().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = mapSupabaseUser(session.user)

    if (!canManagePosts(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const json = await request.json()
    const validatedData = createPostSchema.parse(json)
    
    const post = await createPost(validatedData, user.id)
    return NextResponse.json(post)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const take = parseInt(searchParams.get('take') || '10')
    const skip = parseInt(searchParams.get('skip') || '0')
    const authorId = searchParams.get('authorId') || undefined
    const published = searchParams.get('published') ? searchParams.get('published') === 'true' : undefined

    const posts = await getPosts({ take, skip, authorId, published })
    return NextResponse.json(posts)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 