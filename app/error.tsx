// app/error.tsx
'use client' // Error components must be Client Components

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <section className="pink_container">
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="heading">Oops! Something Went Wrong</h1>

        {/* Display a user-friendly message */}
        <p className="sub-heading !max-w-3xl mt-4">
          {/* We can now safely display the error message */}
          {error.message || "An unexpected error has occurred."}
        </p>

        <div className="mt-10 flex items-center gap-5">
          <button
            onClick={() => reset()}
            className="bg-gray-800 text-white py-2 px-6 rounded-md hover:bg-gray-700 transition-colors text-lg"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="bg-white text-gray-800 border border-gray-800 py-2 px-6 rounded-md hover:bg-gray-100 transition-colors text-lg"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </section>
  )
}