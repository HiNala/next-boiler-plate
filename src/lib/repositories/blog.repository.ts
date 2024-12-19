import { prisma } from '@/lib/db'
import type { Post, Prisma } from '@prisma/client'
import type { BlogPost, CreatePostInput, UpdatePostInput } from '@/lib/types/blog'
import { generateSlug } from '@/lib/utils'

export class BlogRepository {
  async createPost(input: CreatePostInput & { authorId: string }): Promise<BlogPost> {
    const slug = generateSlug(input.title)
    
    return prisma.post.create({
      data: {
        ...input,
        slug,
        publishedAt: input.published ? new Date() : null,
      },
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

  async updatePost(id: string, input: UpdatePostInput): Promise<BlogPost> {
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

  async deletePost(id: string): Promise<BlogPost> {
    return prisma.post.delete({
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

  async getPost(id: string): Promise<BlogPost | null> {
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

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
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

  async getPosts(options: {
    take?: number
    skip?: number
    authorId?: string
    published?: boolean
  }): Promise<BlogPost[]> {
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
} 