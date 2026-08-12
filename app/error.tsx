'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'

export default function Error({
    error,
    reset, // 👈 Rename 'retry' to 'reset'
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center p-6 gap-4">
            <h2 className="text-xl font-bold text-red-600">Something went wrong!</h2>
            <p className="text-sm text-slate-600">{error.message}</p>
            <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
                onClick={() => reset()}
            >
                Try again
            </button>
        </div>
    )
}
