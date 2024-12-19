import { prisma } from '@/lib/db'
import type { Post, Prisma } from '@prisma/client'
import type { BlogPost, CreatePostInput, UpdatePostInput } from '@/lib/types/blog'
import { generateSlug } from '@/lib/utils'
import { DatabaseError, NotFoundError, ValidationError } from '@/lib/errors'
import type { PostWhereInput, PostPaginationInput } from '@/lib/validations/blog'

const postInclude = {
  author: {
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
    },
  },
} as const

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
        include: postInclude,
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ValidationError('A post with this title already exists')
        }
      }
      throw new DatabaseError('Failed to create post', error instanceof Error ? error.message : undefined)
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
        include: postInclude,
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundError('Post not found')
        }
        if (error.code === 'P2002') {
          throw new ValidationError('A post with this title already exists')
        }
      }
      throw new DatabaseError('Failed to update post', error instanceof Error ? error.message : undefined)
    }
  }

  async deletePost(id: string): Promise<BlogPost> {
    try {
      return await prisma.post.delete({
        where: { id },
        include: postInclude,
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundError('Post not found')
        }
      }
      throw new DatabaseError('Failed to delete post', error instanceof Error ? error.message : undefined)
    }
  }

  async getPost(id: string): Promise<BlogPost> {
    const post = await prisma.post.findUnique({
      where: { id },
      include: postInclude,
    })

    if (!post) {
      throw new NotFoundError('Post not found')
    }

    return post
  }

  async getPostBySlug(slug: string): Promise<BlogPost> {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: postInclude,
    })

    if (!post) {
      throw new NotFoundError('Post not found')
    }

    return post
  }

  async getPosts(
    where: PostWhereInput = {},
    pagination: PostPaginationInput = {}
  ): Promise<{ posts: BlogPost[]; total: number }> {
    try {
      const { take = 10, skip = 0, orderBy = 'createdAt', order = 'desc' } = pagination

      const [posts, total] = await Promise.all([
        prisma.post.findMany({
          where,
          take,
          skip,
          orderBy: { [orderBy]: order },
          include: postInclude,
        }),
        this.getPostCount(where),
      ])

      return { posts, total }
    } catch (error) {
      throw new DatabaseError('Failed to fetch posts', error instanceof Error ? error.message : undefined)
    }
  }

  private async getPostCount(where: PostWhereInput = {}): Promise<number> {
    try {
      return await prisma.post.count({ where })
    } catch (error) {
      throw new DatabaseError('Failed to count posts', error instanceof Error ? error.message : undefined)
    }
  }
} 