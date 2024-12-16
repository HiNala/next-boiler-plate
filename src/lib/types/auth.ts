import type { User, UserRole, SubscriptionTier, SubscriptionStatus } from '@prisma/client'

export type AuthUser = Omit<User, 'password'> & {
  role: UserRole
  subscriptionTier: SubscriptionTier
  subscriptionStatus: SubscriptionStatus
  emailVerified: boolean
}

export type Session = {
  user: AuthUser | null
  accessToken: string | null
}

export type AuthError = {
  message: string
  code?: string
} 