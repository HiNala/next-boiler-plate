import { Post, User } from '@prisma/client'

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
  author: {
    id: string
    name: string | null
    email: string
    avatar: string | null
  }
} 