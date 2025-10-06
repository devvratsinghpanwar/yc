// app/auth/confirm/page.tsx
'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { CheckCircle, Mail } from 'lucide-react'

// Wrap the component in Suspense because useSearchParams() needs it
function ConfirmPageContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  return (
    <section className="pink_container">
      <div className="flex flex-col items-center justify-center w-full min-h-screen text-center">
        <div className="bg-white p-10 rounded-lg shadow-md max-w-lg">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <h1 className="heading !text-3xl md:!text-4xl text-green-600">Account Created Successfully!</h1>

          <div className="flex items-center justify-center gap-2 mt-4 mb-6">
            <Mail className="h-5 w-5 text-gray-600" />
            <p className="sub-heading !text-lg">
              Verification email sent to:
            </p>
          </div>

          {/* Display the user's email for confirmation */}
          {email ? (
            <p className="my-6 text-xl font-semibold text-gray-800 bg-gray-100 py-3 px-5 rounded-md">
              {email}
            </p>
          ) : (
            <p className="my-6 text-lg text-gray-600">
              Please check your inbox.
            </p>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 font-medium mb-2">Next Steps:</p>
            <ol className="text-blue-700 text-sm text-left space-y-1">
              <li>1. Check your email inbox (and spam folder)</li>
              <li>2. Click the verification link in the email</li>
              <li>3. You&apos;ll be automatically logged in</li>
            </ol>
          </div>

          <p className="text-gray-600 text-sm mb-6">
            Didn&apos;t receive the email? Check your spam folder or try signing up again.
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="text-gray-800 border border-gray-800 py-2 px-6 rounded-md hover:bg-gray-100 transition-colors"
            >
              Back to Login
            </Link>
            <Link
              href="/"
              className="bg-primary text-white py-2 px-6 rounded-md hover:bg-primary/90 transition-colors"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

// The main export uses Suspense as required by useSearchParams
export default function ConfirmPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ConfirmPageContent />
        </Suspense>
    )
}