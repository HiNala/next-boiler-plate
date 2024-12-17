import type { AuthUser } from './types/auth'

// Define the enums locally to match Prisma's schema
const UserRole = {
  USER: 'USER',
  ADMIN: 'ADMIN'
} as const

const SubscriptionTier = {
  FREE: 'FREE',
  PRO: 'PRO',
  ENTERPRISE: 'ENTERPRISE'
} as const

const SubscriptionStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  PAST_DUE: 'PAST_DUE',
  CANCELLED: 'CANCELLED'
} as const

type UserRole = typeof UserRole[keyof typeof UserRole]
type SubscriptionTier = typeof SubscriptionTier[keyof typeof SubscriptionTier]
type SubscriptionStatus = typeof SubscriptionStatus[keyof typeof SubscriptionStatus]

export function isAdmin(user: AuthUser | null): boolean {
  if (!user) return false
  return user.role === UserRole.ADMIN
}

export function hasSubscription(user: AuthUser | null, minimumTier: SubscriptionTier): boolean {
  if (!user) return false
  if (user.subscriptionStatus !== SubscriptionStatus.ACTIVE) return false
  
  const tiers = {
    [SubscriptionTier.FREE]: 0,
    [SubscriptionTier.PRO]: 1,
    [SubscriptionTier.ENTERPRISE]: 2,
  } as const

  return tiers[user.subscriptionTier] >= tiers[minimumTier]
}

export function canAccessDashboard(user: AuthUser | null): boolean {
  if (!user) return false
  return user.subscriptionStatus === SubscriptionStatus.ACTIVE || user.role === UserRole.ADMIN
}

export function canManagePosts(user: AuthUser | null): boolean {
  if (!user) return false
  return isAdmin(user)
}

export function canEditPost(user: AuthUser | null, authorId: string): boolean {
  if (!user) return false
  if (user.role === UserRole.ADMIN) return true
  return user.id === authorId && user.subscriptionStatus === SubscriptionStatus.ACTIVE
} 