import { NextRequest, NextResponse } from 'next/server'
import { createPost, getPosts } from '@/lib/services/blog'
import { getAuthUser } from '@/lib/auth'
import { z } from 'zod'

const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  description: z.string().optional(),
  thumbnail: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  published: z.boolean().default(false),
})

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const json = await request.json()
    const body = createPostSchema.parse(json)

    const post = await createPost(body, user.id)
    return NextResponse.json(post)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 })
    }
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const take = Number(searchParams.get('take') || 10)
    const skip = Number(searchParams.get('skip') || 0)
    const authorId = searchParams.get('authorId') || undefined
    const published = searchParams.get('published') === 'true'

    const posts = await getPosts({ take, skip, authorId, published })
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 