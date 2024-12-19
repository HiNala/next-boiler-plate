import { z } from 'zod'

export const UserProfileSchema = z.object({
  name: z.string().optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
})

export const UserPreferencesSchema = z.object({
  emailNotifications: z.boolean().default(true),
  marketingEmails: z.boolean().default(false),
  securityAlerts: z.boolean().default(true),
})

export const EmailPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
})

export type UserProfileInput = z.infer<typeof UserProfileSchema>
export type UserPreferencesInput = z.infer<typeof UserPreferencesSchema>
export type EmailPasswordInput = z.infer<typeof EmailPasswordSchema> 