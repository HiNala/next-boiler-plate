import { prisma } from '@/lib/db'
import type { Post, Prisma } from '@prisma/client'
import type { BlogPost, CreatePostInput, UpdatePostInput } from '@/lib/types/blog'
import { generateSlug } from '@/lib/utils'
import { NotFoundError, ValidationError } from '@/lib/errors'
import type { PostWhereInput, PostPaginationInput } from '@/lib/validations/blog'

export class BlogRepository {
  async createPost(input: CreatePostInput & { authorId: string }): Promise<BlogPost> {
    try {
      const slug = generateSlug(input.title)
      
      return await prisma.post.create({
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
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ValidationError('A post with this title already exists')
        }
      }
      throw error
    }
  }

  async updatePost(id: string, input: UpdatePostInput): Promise<BlogPost> {
    const updates: Prisma.PostUpdateInput = { ...input }
    if (input.title) {
      updates.slug = generateSlug(input.title)
    }
    if (input.published !== undefined) {
      updates.publishedAt = input.published ? new Date() : null
    }

    try {
      return await prisma.post.update({
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
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundError('Post')
        }
        if (error.code === 'P2002') {
          throw new ValidationError('A post with this title already exists')
        }
      }
      throw error
    }
  }

  async deletePost(id: string): Promise<BlogPost> {
    try {
      return await prisma.post.delete({
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
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundError('Post')
        }
      }
      throw error
    }
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

  async getPosts(
    where: PostWhereInput = {},
    pagination: PostPaginationInput = {}
  ): Promise<BlogPost[]> {
    const { take = 10, skip = 0, orderBy = 'createdAt', order = 'desc' } = pagination

    return prisma.post.findMany({
      where,
      take,
      skip,
      orderBy: { [orderBy]: order },
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

  async getPostCount(where: PostWhereInput = {}): Promise<number> {
    return prisma.post.count({ where })
  }
} 