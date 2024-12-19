// TODO: [Type-Safety] Resolve Prisma type import issues
// - Issue: Module '@prisma/client' exports not recognized
// - Priority: Medium
// - Fix during type-safety pass
// - Potential solutions:
//   1. Verify Prisma client generation
//   2. Update tsconfig.json paths
//   3. Consider using generated types directly
import type { Post, User, Prisma } from '@prisma/client'

export type BlogPost = Post & {
  author: Pick<User, 'id' | 'name' | 'email' | 'avatar'>
}

export type CreatePostInput = {
  title: string
  content: string
  description?: string
  thumbnail?: string
  tags?: string[]
  published?: boolean
}

export type UpdatePostInput = Partial<CreatePostInput>

export type PostListItem = {
  id: string
  title: string
  slug: string
  description: string | null
  thumbnail: string | null
  published: boolean
  createdAt: Date
  publishedAt: Date | null
  tags: string[]
  author: {
    id: string
    name: string | null
    email: string
    avatar: string | null
  }
} 