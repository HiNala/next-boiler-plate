import { z } from 'zod'

export const SubscriptionPlanSchema = z.object({
  tier: z.enum(['FREE', 'PRO', 'ENTERPRISE']),
  interval: z.enum(['month', 'year']),
  currency: z.string().default('USD'),
})

export const PaymentMethodSchema = z.object({
  type: z.enum(['card', 'sepa_debit', 'bacs_debit']),
  billingDetails: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    address: z.object({
      line1: z.string().min(1, 'Address line 1 is required'),
      line2: z.string().optional(),
      city: z.string().min(1, 'City is required'),
      state: z.string().optional(),
      postal_code: z.string().min(1, 'Postal code is required'),
      country: z.string().min(2, 'Country is required'),
    }),
  }),
})

export const SubscriptionStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'INACTIVE', 'PAST_DUE', 'CANCELLED']),
  currentPeriodEnd: z.date(),
  cancelAtPeriodEnd: z.boolean().default(false),
})

export type SubscriptionPlanInput = z.infer<typeof SubscriptionPlanSchema>
export type PaymentMethodInput = z.infer<typeof PaymentMethodSchema>
export type SubscriptionStatusInput = z.infer<typeof SubscriptionStatusSchema> 