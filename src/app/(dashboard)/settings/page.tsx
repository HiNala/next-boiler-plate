import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Account Settings',
  description: 'Manage your account settings and preferences',
}

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { session }, error } = await supabase.auth.getSession()

  if (error || !session) {
    redirect('/login')
  }

  return (
    <div className="container max-w-2xl py-8">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Email Preferences Section */}
          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Email Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Marketing emails</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive emails about new features and updates
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Security alerts</h3>
                  <p className="text-sm text-muted-foreground">
                    Get notified about security updates and login attempts
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Security</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Two-factor authentication</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add an extra layer of security to your account
                </p>
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Enable 2FA
                </button>
              </div>
              <div>
                <h3 className="font-medium mb-2">Change password</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Update your password regularly to keep your account secure
                </p>
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Change password
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="border border-red-200 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4 text-red-600">Danger Zone</h2>
            <div>
              <h3 className="font-medium mb-2">Delete account</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Permanently delete your account and all associated data
              </p>
              <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                Delete account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 