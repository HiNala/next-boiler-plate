import { User } from '@supabase/supabase-js'
import { AuthUser } from '@/lib/types/auth'

export function mapSupabaseUser(user: User): AuthUser {
  return {
    id: user.id,
    email: user.email!,
    name: user.user_metadata?.name || null,
    role: user.user_metadata?.role || 'USER',
    subscriptionTier: user.user_metadata?.subscriptionTier || 'FREE',
    subscriptionStatus: user.user_metadata?.subscriptionStatus || 'INACTIVE',
    subscriptionEndsAt: user.user_metadata?.subscriptionEndsAt ? new Date(user.user_metadata.subscriptionEndsAt) : null,
    lastPaymentAt: user.user_metadata?.lastPaymentAt ? new Date(user.user_metadata.lastPaymentAt) : null,
    emailVerified: Boolean(user.email_confirmed_at),
    avatar: user.user_metadata?.avatar || null,
    bio: user.user_metadata?.bio || null,
    createdAt: new Date(user.created_at),
    updatedAt: new Date(),
    posts: [],
  }
} 