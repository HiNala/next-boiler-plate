import { prisma } from '@/lib/db'
import { AuthUser } from '@/lib/types/auth'
import { canEditPost } from '@/lib/accessControl'
import { Prisma } from '@prisma/client'

export type CreatePostInput = {
  title: string
  content: string
  description?: string
  thumbnail?: string
  tags?: string[]
  published?: boolean
}

export type UpdatePostInput = Partial<CreatePostInput>

export async function createPost(input: CreatePostInput, authorId: string) {
  const slug = generateSlug(input.title)
  
  return prisma.post.create({
    data: {
      ...input,
      slug,
      authorId,
      publishedAt: input.published ? new Date() : null,
    },
  })
}

export async function updatePost(id: string, input: UpdatePostInput, user: AuthUser) {
  const post = await prisma.post.findUnique({
    where: { id },
    select: { authorId: true },
  })

  if (!post || !canEditPost(user, post.authorId)) {
    throw new Error('Unauthorized')
  }

  const updates: Prisma.PostUpdateInput = { ...input }
  if (input.title) {
    updates.slug = generateSlug(input.title)
  }
  if (input.published !== undefined) {
    updates.publishedAt = input.published ? new Date() : null
  }

  return prisma.post.update({
    where: { id },
    data: updates,
  })
}

export async function deletePost(id: string, user: AuthUser) {
  const post = await prisma.post.findUnique({
    where: { id },
    select: { authorId: true },
  })

  if (!post || !canEditPost(user, post.authorId)) {
    throw new Error('Unauthorized')
  }

  return prisma.post.delete({
    where: { id },
  })
}

export async function getPost(id: string) {
  return prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
    },
  })
}

export async function getPostBySlug(slug: string) {
  return prisma.post.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
    },
  })
}

export async function getPosts(options: {
  take?: number
  skip?: number
  authorId?: string
  published?: boolean
}) {
  const { take = 10, skip = 0, authorId, published } = options

  const where: Prisma.PostWhereInput = {}
  if (authorId) where.authorId = authorId
  if (published !== undefined) where.published = published

  return prisma.post.findMany({
    where,
    take,
    skip,
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
    },
  })
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
} 