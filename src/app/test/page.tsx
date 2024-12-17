import { createClient } from '@/utils/supabase/server'
import { AuthTest } from '@/app/test/auth-test'

export default async function TestPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-4xl font-bold mb-8">
          Supabase Auth Test
        </h1>
        
        {/* Server-side rendered session status */}
        <div className="mb-8 p-4 rounded bg-gray-100">
          <h2 className="text-xl font-semibold mb-2">Server Component</h2>
          <p>Session Status: {session ? 'Authenticated' : 'Not Authenticated'}</p>
          {session && (
            <div className="mt-2">
              <p>User: {session.user.email}</p>
            </div>
          )}
        </div>

        {/* Client-side auth component */}
        <AuthTest />
      </main>
    </div>
  )
} 