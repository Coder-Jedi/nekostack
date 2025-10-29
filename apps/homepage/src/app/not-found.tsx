import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center px-4">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary/20 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-foreground mb-4">Page Not Found</h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto mb-8">
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
          </p>
        </div>
        
        <Link
          href="/"
          className="inline-flex items-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
