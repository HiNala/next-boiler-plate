import { z } from 'zod'

export const TagSchema = z.object({
  name: z.string()
    .min(1, 'Tag name is required')
    .max(50, 'Tag name must be less than 50 characters')
    .regex(/^[a-z0-9-]+$/, 'Tag name can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().max(200, 'Description must be less than 200 characters').optional(),
  color: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color code')
    .optional(),
  metadata: z.object({
    featured: z.boolean().default(false),
    sortOrder: z.number().min(0).default(0),
  }).optional(),
})

export const TagUpdateSchema = TagSchema.partial()

export const TagWhereSchema = z.object({
  name: z.string().optional(),
  featured: z.boolean().optional(),
  postId: z.string().uuid('Invalid post ID').optional(),
})

export const TagPaginationSchema = z.object({
  take: z.number().min(1).max(100).default(50),
  skip: z.number().min(0).default(0),
  orderBy: z.enum(['name', 'createdAt', 'sortOrder']).default('name'),
  order: z.enum(['asc', 'desc']).default('asc'),
})

export type TagInput = z.infer<typeof TagSchema>
export type TagUpdateInput = z.infer<typeof TagUpdateSchema>
export type TagWhereInput = z.infer<typeof TagWhereSchema>
export type TagPaginationInput = z.infer<typeof TagPaginationSchema> 