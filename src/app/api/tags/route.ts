import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createTag, getTags } from '@/lib/services/tag'
import { TagSchema, TagPaginationSchema, TagWhereSchema } from '@/lib/validations/tag'
import { ForbiddenError, ValidationError } from '@/lib/errors'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const pagination = TagPaginationSchema.parse({
      take: searchParams.get('take') ? parseInt(searchParams.get('take')!) : undefined,
      skip: searchParams.get('skip') ? parseInt(searchParams.get('skip')!) : undefined,
      orderBy: searchParams.get('orderBy') || undefined,
      order: searchParams.get('order') || undefined,
    })

    const where = TagWhereSchema.parse({
      name: searchParams.get('name') || undefined,
      featured: searchParams.get('featured') ? searchParams.get('featured') === 'true' : undefined,
    })

    const result = await getTags(where, pagination)
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    console.error('Error in GET /api/tags:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const json = await request.json()
    const tag = await createTag(json, session.user)
    return NextResponse.json(tag, { status: 201 })
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    console.error('Error in POST /api/tags:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 