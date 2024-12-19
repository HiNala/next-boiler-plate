import { prisma } from '@/lib/db'
import type { Prisma } from '@prisma/client'
import type { TagInput, TagUpdateInput, TagWhereInput, TagPaginationInput } from '@/lib/validations/tag'
import { NotFoundError, ValidationError } from '@/lib/errors'

export class TagRepository {
  async createTag(input: TagInput) {
    try {
      return await prisma.tag.create({
        data: {
          ...input,
          metadata: input.metadata || {},
        },
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ValidationError('A tag with this name already exists')
        }
      }
      throw error
    }
  }

  async updateTag(id: string, input: TagUpdateInput) {
    try {
      return await prisma.tag.update({
        where: { id },
        data: input,
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundError('Tag')
        }
        if (error.code === 'P2002') {
          throw new ValidationError('A tag with this name already exists')
        }
      }
      throw error
    }
  }

  async deleteTag(id: string) {
    try {
      return await prisma.tag.delete({
        where: { id },
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundError('Tag')
        }
      }
      throw error
    }
  }

  async getTag(id: string) {
    return prisma.tag.findUnique({
      where: { id },
    })
  }

  async getTagByName(name: string) {
    return prisma.tag.findUnique({
      where: { name },
    })
  }

  async getTags(
    where: TagWhereInput = {},
    pagination: TagPaginationInput = {}
  ) {
    const { take = 50, skip = 0, orderBy = 'name', order = 'asc' } = pagination

    return prisma.tag.findMany({
      where,
      take,
      skip,
      orderBy: { [orderBy]: order },
    })
  }

  async getTagCount(where: TagWhereInput = {}) {
    return prisma.tag.count({ where })
  }

  async getTagsByPostId(postId: string) {
    return prisma.tag.findMany({
      where: {
        posts: {
          some: {
            id: postId,
          },
        },
      },
    })
  }
} 