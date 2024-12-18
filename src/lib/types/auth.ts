import { Prisma } from '@prisma/client'

export type UserRole = 'USER' | 'ADMIN'
export type SubscriptionTier = 'FREE' | 'PRO' | 'ENTERPRISE'
export type SubscriptionStatus = 'ACTIVE' | 'INACTIVE' | 'PAST_DUE' | 'CANCELLED'

export type AuthUser = {
  id: string
  email: string
  name: string | null
  role: UserRole
  subscriptionTier: SubscriptionTier
  subscriptionStatus: SubscriptionStatus
  subscriptionEndsAt: Date | null
  lastPaymentAt: Date | null
  emailVerified: boolean
  avatar: string | null
  bio: string | null
  createdAt: Date
  updatedAt: Date
  posts: any[]
}

export type Session = {
  user: AuthUser | null
  accessToken: string | null
}

export type AuthError = {
  message: string
  code?: string
} 