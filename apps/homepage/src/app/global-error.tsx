'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error)
    
    // TODO: Send to error tracking service
    // trackError(error)
  }, [error])

  return (
    <html lang="en">
      <head>
        <title>Application Error</title>
      </head>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-8">
              <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Application Error</h1>
              <p className="text-gray-600 mb-4">
                We're experiencing technical difficulties. Please try again.
              </p>
              
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg text-left text-sm">
                  <p className="font-semibold mb-2 text-red-600">
                    {error.message || error.toString()}
                  </p>
                  {error.digest && (
                    <p className="text-xs text-gray-500 mt-2">
                      Error ID: {error.digest}
                    </p>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={reset}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-11 px-8"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reload Application
            </button>

            <p className="mt-6 text-sm text-gray-500">
              If this problem persists, please contact{' '}
              <a href="mailto:support@nekostack.com" className="text-blue-600 hover:underline">
                support@nekostack.com
              </a>
            </p>
          </div>
        </div>
      </body>
    </html>
  )
}

