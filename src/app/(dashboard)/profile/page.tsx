import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProfileForm } from '@/components/forms/profile-form'

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Manage your profile settings',
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { session }, error } = await supabase.auth.getSession()

  if (error || !session) {
    redirect('/login')
  }

  return (
    <div className="container max-w-2xl py-8">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Profile</h1>
          <p className="text-muted-foreground">
            Manage your profile information and settings
          </p>
        </div>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            {session.user.user_metadata?.avatar && (
              <img
                src={session.user.user_metadata.avatar}
                alt={session.user.user_metadata?.name || session.user.email}
                className="w-16 h-16 rounded-full"
              />
            )}
            <div>
              <h2 className="text-xl font-semibold">
                {session.user.user_metadata?.name || 'Anonymous User'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {session.user.email}
              </p>
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <ProfileForm user={{
              id: session.user.id,
              email: session.user.email!,
              name: session.user.user_metadata?.name || null,
              role: session.user.user_metadata?.role || 'USER',
              subscriptionTier: session.user.user_metadata?.subscriptionTier || 'FREE',
              subscriptionStatus: session.user.user_metadata?.subscriptionStatus || 'INACTIVE',
              subscriptionEndsAt: session.user.user_metadata?.subscriptionEndsAt ? new Date(session.user.user_metadata.subscriptionEndsAt) : null,
              lastPaymentAt: session.user.user_metadata?.lastPaymentAt ? new Date(session.user.user_metadata.lastPaymentAt) : null,
              emailVerified: Boolean(session.user.email_confirmed_at),
              avatar: session.user.user_metadata?.avatar || null,
              bio: session.user.user_metadata?.bio || null,
              createdAt: new Date(session.user.created_at),
              updatedAt: new Date(),
              posts: []
            }} />
          </div>
        </div>
      </div>
    </div>
  )
} 