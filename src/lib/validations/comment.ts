import { z } from 'zod'

export const CommentSchema = z.object({
  content: z.string()
    .min(1, 'Comment content is required')
    .max(1000, 'Comment must be less than 1000 characters'),
  postId: z.string().uuid('Invalid post ID'),
  parentId: z.string().uuid('Invalid parent comment ID').optional(),
  metadata: z.object({
    edited: z.boolean().default(false),
    editedAt: z.date().optional(),
    ipAddress: z.string().ip().optional(),
    userAgent: z.string().optional(),
  }).optional(),
})

export const CommentUpdateSchema = CommentSchema.pick({
  content: true,
}).extend({
  metadata: z.object({
    edited: z.literal(true),
    editedAt: z.date(),
  }),
})

export const CommentWhereSchema = z.object({
  postId: z.string().uuid('Invalid post ID').optional(),
  authorId: z.string().uuid('Invalid author ID').optional(),
  parentId: z.string().uuid('Invalid parent comment ID').optional(),
  createdAt: z.object({
    gt: z.date().optional(),
    lt: z.date().optional(),
  }).optional(),
})

export const CommentPaginationSchema = z.object({
  take: z.number().min(1).max(100).default(10),
  skip: z.number().min(0).default(0),
  orderBy: z.enum(['createdAt', 'updatedAt']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
})

export type CommentInput = z.infer<typeof CommentSchema>
export type CommentUpdateInput = z.infer<typeof CommentUpdateSchema>
export type CommentWhereInput = z.infer<typeof CommentWhereSchema>
export type CommentPaginationInput = z.infer<typeof CommentPaginationSchema> 