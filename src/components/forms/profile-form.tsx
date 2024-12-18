'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { AuthUser } from '@/lib/types/auth'

interface ProfileFormProps {
  user: AuthUser
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData(event.currentTarget)
    const name = formData.get('name') as string
    const bio = formData.get('bio') as string
    const avatar = formData.get('avatar') as string

    const { error } = await supabase.auth.updateUser({
      data: {
        name,
        bio,
        avatar,
      }
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
      return
    }

    setSuccess('Profile updated successfully')
    setIsLoading(false)
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid gap-1">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={user.name || ''}
            disabled={isLoading}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="grid gap-1">
          <label htmlFor="bio" className="text-sm font-medium">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            defaultValue={user.bio || ''}
            disabled={isLoading}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="grid gap-1">
          <label htmlFor="avatar" className="text-sm font-medium">
            Avatar URL
          </label>
          <input
            id="avatar"
            name="avatar"
            type="url"
            defaultValue={user.avatar || ''}
            disabled={isLoading}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
      {error && (
        <div className="text-sm text-red-500">
          {error}
        </div>
      )}
      {success && (
        <div className="text-sm text-green-500">
          {success}
        </div>
      )}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isLoading ? 'Saving...' : 'Save changes'}
      </button>
    </form>
  )
} 