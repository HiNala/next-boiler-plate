import { prisma } from '@/lib/db'
import type { CommentInput, CommentUpdateInput, CommentWhereInput, CommentPaginationInput } from '@/lib/validations/comment'
import { ValidationError } from '@/lib/errors'

export class CommentRepository {
  async createComment(input: CommentInput & { authorId: string }) {
    try {
      return await prisma.comment.create({
        data: {
          ...input,
          metadata: input.metadata || {},
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
      if (error.code === 'P2003') {
        throw new ValidationError('Referenced post or parent comment does not exist')
      }
      throw error
    }
  }

  async updateComment(id: string, input: CommentUpdateInput) {
    try {
      return await prisma.comment.update({
        where: { id },
        data: input,
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
      if (error.code === 'P2025') {
        throw new ValidationError('Comment not found')
      }
      throw error
    }
  }

  async deleteComment(id: string) {
    try {
      return await prisma.comment.delete({
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
      if (error.code === 'P2025') {
        throw new ValidationError('Comment not found')
      }
      throw error
    }
  }

  async getComment(id: string) {
    return prisma.comment.findUnique({
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

  async getComments(
    where: CommentWhereInput = {},
    pagination: CommentPaginationInput = {}
  ) {
    const { take = 10, skip = 0, orderBy = 'createdAt', order = 'desc' } = pagination

    return prisma.comment.findMany({
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

  async getCommentCount(where: CommentWhereInput = {}) {
    return prisma.comment.count({ where })
  }
} 