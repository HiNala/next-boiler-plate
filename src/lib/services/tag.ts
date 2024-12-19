import type { TagInput, TagUpdateInput, TagWhereInput, TagPaginationInput } from '@/lib/validations/tag'
import type { AuthUser } from '@/lib/types/auth'
import { canManageTags } from '@/lib/accessControl'
import { TagRepository } from '@/lib/repositories/tag.repository'
import { ForbiddenError, NotFoundError } from '@/lib/errors'
import { TagSchema, TagUpdateSchema } from '@/lib/validations/tag'

const tagRepository = new TagRepository()

export async function createTag(input: TagInput, user: AuthUser) {
  if (!canManageTags(user)) {
    throw new ForbiddenError('You do not have permission to create tags')
  }

  const validatedInput = TagSchema.parse(input)
  return tagRepository.createTag(validatedInput)
}

export async function updateTag(id: string, input: TagUpdateInput, user: AuthUser) {
  if (!canManageTags(user)) {
    throw new ForbiddenError('You do not have permission to update tags')
  }

  const tag = await tagRepository.getTag(id)
  if (!tag) {
    throw new NotFoundError('Tag')
  }

  const validatedInput = TagUpdateSchema.parse(input)
  return tagRepository.updateTag(id, validatedInput)
}

export async function deleteTag(id: string, user: AuthUser) {
  if (!canManageTags(user)) {
    throw new ForbiddenError('You do not have permission to delete tags')
  }

  const tag = await tagRepository.getTag(id)
  if (!tag) {
    throw new NotFoundError('Tag')
  }

  return tagRepository.deleteTag(id)
}

export async function getTag(id: string) {
  const tag = await tagRepository.getTag(id)
  if (!tag) {
    throw new NotFoundError('Tag')
  }
  return tag
}

export async function getTags(
  where: TagWhereInput = {},
  pagination: TagPaginationInput = {}
) {
  const [tags, total] = await Promise.all([
    tagRepository.getTags(where, pagination),
    tagRepository.getTagCount(where)
  ])

  const { take = 50, skip = 0 } = pagination
  const hasMore = skip + take < total

  return {
    tags,
    total,
    hasMore
  }
}

export async function getTagsByPostId(postId: string) {
  return tagRepository.getTagsByPostId(postId)
} 