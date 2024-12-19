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

const blogRepository = new BlogRepository()

export async function createPost(input: CreatePostInput, authorId: string): Promise<BlogPost> {
  return blogRepository.createPost({ ...input, authorId })
}

export async function updatePost(id: string, input: UpdatePostInput, user: AuthUser): Promise<BlogPost> {
  const post = await blogRepository.getPost(id)

  if (!post) {
    throw new Error('Not Found')
  }

  if (!canEditPost(user, post.authorId)) {
    throw new Error('Unauthorized')
  }

  return blogRepository.updatePost(id, input)
}

export async function deletePost(id: string, user: AuthUser): Promise<BlogPost> {
  const post = await blogRepository.getPost(id)

  if (!post) {
    throw new Error('Not Found')
  }

  if (!canEditPost(user, post.authorId)) {
    throw new Error('Unauthorized')
  }

  return blogRepository.deletePost(id)
}

export async function getPost(id: string): Promise<BlogPost> {
  const post = await blogRepository.getPost(id)

  if (!post) {
    throw new Error('Not Found')
  }

  return post
}

export async function getPostBySlug(slug: string): Promise<BlogPost> {
  const post = await blogRepository.getPostBySlug(slug)

  if (!post) {
    throw new Error('Not Found')
  }

  return post
}

export async function getPosts(options: {
  take?: number
  skip?: number
  authorId?: string
  published?: boolean
}): Promise<BlogPost[]> {
  return blogRepository.getPosts(options)
} 