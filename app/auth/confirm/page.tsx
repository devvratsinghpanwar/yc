// app/auth/confirm/page.tsx
'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

// Wrap the component in Suspense because useSearchParams() needs it
function ConfirmPageContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  return (
    <section className="pink_container">
      <div className="flex flex-col items-center justify-center w-full min-h-screen text-center">
        <div className="bg-white p-10 rounded-lg shadow-md max-w-lg">
          <h1 className="heading !text-3xl md:!text-4xl">One Last Step!</h1>
          <p className="sub-heading !text-lg mt-4">
            We have sent a verification link to your email address:
          </p>

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

          <p className="text-gray-600">
            Click the link in that email to complete your sign-up. You can close this tab.
          </p>

          <div className="mt-8">
            <Link
              href="/login"
              className="text-gray-800 border border-gray-800 py-2 px-6 rounded-md hover:bg-gray-100 transition-colors"
            >
              Back to Login
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