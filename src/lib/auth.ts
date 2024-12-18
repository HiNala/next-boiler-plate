import { createClient } from '@/lib/supabase/client'
import type { AuthError, Session, AuthUser } from './types/auth'

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

export async function signIn(email: string, password: string): Promise<{ error: AuthError | null }> {
  const supabase = createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: { message: error.message, code: error.name } }
  }

  return { error: null }
}

export async function signUp(email: string, password: string): Promise<{ error: AuthError | null }> {
  const supabase = createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return { error: { message: error.message, code: error.name } }
  }

  return { error: null }
}

export async function signOut(): Promise<{ error: AuthError | null }> {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    return { error: { message: error.message, code: error.name } }
  }

  return { error: null }
}

export async function getSession(): Promise<{ session: Session | null; error: AuthError | null }> {
  const supabase = createClient()
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error) {
    return { session: null, error: { message: error.message, code: error.name } }
  }

  if (!session?.user) {
    return { session: null, error: null }
  }

  // TODO: Fetch additional user data from database when implementing user profile
  const userData: AuthUser = {
    id: session.user.id,
    email: session.user.email!,
    name: session.user.user_metadata?.name || null,
    role: (session.user.user_metadata?.role || 'USER') as UserRole,
    subscriptionTier: (session.user.user_metadata?.subscriptionTier || 'FREE') as SubscriptionTier,
    subscriptionStatus: (session.user.user_metadata?.subscriptionStatus || 'INACTIVE') as SubscriptionStatus,
    emailVerified: Boolean(session.user.email_confirmed_at),
    subscriptionEndsAt: session.user.user_metadata?.subscriptionEndsAt ? new Date(session.user.user_metadata.subscriptionEndsAt) : null,
    lastPaymentAt: session.user.user_metadata?.lastPaymentAt ? new Date(session.user.user_metadata.lastPaymentAt) : null,
    avatar: session.user.user_metadata?.avatar || null,
    bio: session.user.user_metadata?.bio || null,
    createdAt: new Date(session.user.created_at),
    updatedAt: new Date(),
    posts: [] // Initialize empty posts array
  }

  return { 
    session: {
      user: userData,
      accessToken: session.access_token
    },
    error: null 
  }
} 