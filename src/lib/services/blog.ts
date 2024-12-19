// TODO: [Type-Safety] Resolve Prisma type definition issues
// - Issue: PostUpdateInput and PostWhereInput types not recognized
// - Priority: Medium
// - Fix during type-safety pass
// - Related to Prisma client type generation
// - Current workaround: Using type imports
import type { BlogPost, CreatePostInput, UpdatePostInput } from '@/lib/types/blog'
import type { AuthUser } from '@/lib/types/auth'
import { canEditPost } from '@/lib/accessControl'
import { BlogRepository } from '@/lib/repositories/blog.repository'
import { ForbiddenError, NotFoundError } from '@/lib/errors'
import type { PostWhereInput, PostPaginationInput } from '@/lib/validations/blog'
import { PostSchema, UpdatePostSchema } from '@/lib/validations/blog'

const blogRepository = new BlogRepository()

export async function createPost(input: CreatePostInput, authorId: string): Promise<BlogPost> {
  const validatedInput = PostSchema.parse(input)
  return blogRepository.createPost({ ...validatedInput, authorId })
}

export async function updatePost(id: string, input: UpdatePostInput, user: AuthUser): Promise<BlogPost> {
  const post = await blogRepository.getPost(id)

  if (!post) {
    throw new NotFoundError('Post')
  }

  if (!canEditPost(user, post.authorId)) {
    throw new ForbiddenError('You do not have permission to edit this post')
  }

  const validatedInput = UpdatePostSchema.parse(input)
  return blogRepository.updatePost(id, validatedInput)
}

export async function deletePost(id: string, user: AuthUser): Promise<BlogPost> {
  const post = await blogRepository.getPost(id)

  if (!post) {
    throw new NotFoundError('Post')
  }

  if (!canEditPost(user, post.authorId)) {
    throw new ForbiddenError('You do not have permission to delete this post')
  }

  return blogRepository.deletePost(id)
}

export async function getPost(id: string): Promise<BlogPost> {
  const post = await blogRepository.getPost(id)

  if (!post) {
    throw new NotFoundError('Post')
  }

  return post
}

export async function getPostBySlug(slug: string): Promise<BlogPost> {
  const post = await blogRepository.getPostBySlug(slug)

  if (!post) {
    throw new NotFoundError('Post')
  }

  return post
}

export async function getPosts(
  where: PostWhereInput = {},
  pagination: PostPaginationInput = {}
): Promise<{
  posts: BlogPost[]
  total: number
  hasMore: boolean
}> {
  const [posts, total] = await Promise.all([
    blogRepository.getPosts(where, pagination),
    blogRepository.getPostCount(where)
  ])

  const { take = 10, skip = 0 } = pagination
  const hasMore = skip + take < total

  return {
    posts,
    total,
    hasMore
  }
} 