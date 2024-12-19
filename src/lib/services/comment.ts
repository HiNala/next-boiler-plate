import type { CommentInput, CommentUpdateInput, CommentWhereInput, CommentPaginationInput } from '@/lib/validations/comment'
import type { AuthUser } from '@/lib/types/auth'
import { canEditComment } from '@/lib/accessControl'
import { CommentRepository } from '@/lib/repositories/comment.repository'
import { ForbiddenError, NotFoundError } from '@/lib/errors'

const commentRepository = new CommentRepository()

export async function createComment(input: CommentInput, authorId: string) {
  return commentRepository.createComment({ ...input, authorId })
}

export async function updateComment(id: string, input: CommentUpdateInput, user: AuthUser) {
  const comment = await commentRepository.getComment(id)

  if (!comment) {
    throw new NotFoundError('Comment')
  }

  if (!canEditComment(user, comment.authorId)) {
    throw new ForbiddenError('You do not have permission to edit this comment')
  }

  return commentRepository.updateComment(id, {
    ...input,
    metadata: {
      ...input.metadata,
      editedAt: new Date(),
    },
  })
}

export async function deleteComment(id: string, user: AuthUser) {
  const comment = await commentRepository.getComment(id)

  if (!comment) {
    throw new NotFoundError('Comment')
  }

  if (!canEditComment(user, comment.authorId)) {
    throw new ForbiddenError('You do not have permission to delete this comment')
  }

  return commentRepository.deleteComment(id)
}

export async function getComment(id: string) {
  const comment = await commentRepository.getComment(id)

  if (!comment) {
    throw new NotFoundError('Comment')
  }

  return comment
}

export async function getComments(
  where: CommentWhereInput = {},
  pagination: CommentPaginationInput = {}
) {
  const [comments, total] = await Promise.all([
    commentRepository.getComments(where, pagination),
    commentRepository.getCommentCount(where)
  ])

  const { take = 10, skip = 0 } = pagination
  const hasMore = skip + take < total

  return {
    comments,
    total,
    hasMore
  }
} 