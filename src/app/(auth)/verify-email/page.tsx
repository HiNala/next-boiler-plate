import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Verify Email',
  description: 'Verify your email address to continue',
}

export default function VerifyEmailPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Check your email
          </h1>
          <p className="text-sm text-muted-foreground">
            We've sent you a verification link. Please check your email to verify your account.
          </p>
        </div>
        <div className="grid gap-4">
          <p className="px-8 text-center text-sm text-muted-foreground">
            Once verified, you can{' '}
            <Link 
              href="/login" 
              className="hover:text-brand underline underline-offset-4"
            >
              sign in
            </Link>
            {' '}to your account.
          </p>
          <p className="px-8 text-center text-sm text-muted-foreground">
            Didn't receive the email?{' '}
            <Link 
              href="/register" 
              className="hover:text-brand underline underline-offset-4"
            >
              Try again
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
} 