import { prisma } from '@/lib/db'
import type { Comment, Prisma } from '@prisma/client'
import type { CommentInput, CommentUpdateInput, CommentWhereInput, CommentPaginationInput } from '@/lib/validations/comment'
import { DatabaseError, NotFoundError, ValidationError } from '@/lib/errors'

const commentInclude = {
  author: {
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
    },
  },
} as const

export type CommentWithAuthor = Prisma.CommentGetPayload<{ include: typeof commentInclude }>

export class CommentRepository {
  async createComment(input: CommentInput & { authorId: string }): Promise<CommentWithAuthor> {
    try {
      return await prisma.comment.create({
        data: {
          ...input,
          metadata: input.metadata || {},
        },
        include: commentInclude,
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new ValidationError('Referenced post or parent comment does not exist')
        }
        if (error.code === 'P2002') {
          throw new ValidationError('Comment already exists')
        }
      }
      throw new DatabaseError('Failed to create comment', error instanceof Error ? error.message : undefined)
    }
  }

  async updateComment(id: string, input: CommentUpdateInput): Promise<CommentWithAuthor> {
    try {
      return await prisma.comment.update({
        where: { id },
        data: input,
        include: commentInclude,
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundError('Comment not found')
        }
        if (error.code === 'P2002') {
          throw new ValidationError('Comment already exists')
        }
      }
      throw new DatabaseError('Failed to update comment', error instanceof Error ? error.message : undefined)
    }
  }

  async deleteComment(id: string): Promise<CommentWithAuthor> {
    try {
      return await prisma.comment.delete({
        where: { id },
        include: commentInclude,
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundError('Comment not found')
        }
      }
      throw new DatabaseError('Failed to delete comment', error instanceof Error ? error.message : undefined)
    }
  }

  async getComment(id: string): Promise<CommentWithAuthor> {
    const comment = await prisma.comment.findUnique({
      where: { id },
      include: commentInclude,
    })

    if (!comment) {
      throw new NotFoundError('Comment not found')
    }

    return comment
  }

  async getComments(
    where: CommentWhereInput = {},
    pagination: CommentPaginationInput = {}
  ): Promise<{ comments: CommentWithAuthor[]; total: number }> {
    try {
      const { take = 10, skip = 0, orderBy = 'createdAt', order = 'desc' } = pagination

      const [comments, total] = await Promise.all([
        prisma.comment.findMany({
          where,
          take,
          skip,
          orderBy: { [orderBy]: order },
          include: commentInclude,
        }),
        this.getCommentCount(where),
      ])

      return { comments, total }
    } catch (error) {
      throw new DatabaseError('Failed to fetch comments', error instanceof Error ? error.message : undefined)
    }
  }

  private async getCommentCount(where: CommentWhereInput = {}): Promise<number> {
    try {
      return await prisma.comment.count({ where })
    } catch (error) {
      throw new DatabaseError('Failed to count comments', error instanceof Error ? error.message : undefined)
    }
  }
} 