import { z } from 'zod'

export const PostSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  content: z.string()
    .min(1, 'Content is required'),
  description: z.string()
    .max(300, 'Description must be less than 300 characters')
    .optional(),
  thumbnail: z.string()
    .url('Invalid thumbnail URL')
    .optional(),
  tags: z.array(z.string())
    .max(5, 'Maximum 5 tags allowed')
    .optional(),
  published: z.boolean()
    .optional()
    .default(false),
})

export const UpdatePostSchema = PostSchema.partial()

export type CreatePostInput = z.infer<typeof PostSchema>
export type UpdatePostInput = z.infer<typeof UpdatePostSchema>

export const PostWhereSchema = z.object({
  authorId: z.string().optional(),
  published: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
})

export type PostWhereInput = z.infer<typeof PostWhereSchema>

export const PostPaginationSchema = z.object({
  take: z.number().min(1).max(100).optional().default(10),
  skip: z.number().min(0).optional().default(0),
  orderBy: z.enum(['createdAt', 'updatedAt', 'title']).optional().default('createdAt'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
})

export type PostPaginationInput = z.infer<typeof PostPaginationSchema> 