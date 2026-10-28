import Link from 'next/link'
import { Section } from '@/components/site/section'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <>
      <Section>
        <div className="max-w-xl">
          <p className="text-primary text-sm font-semibold tracking-wide uppercase">404</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">Page not found</h1>
          <p className="text-muted-foreground mt-4">
            The page you were looking for does not exist or has moved.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/">Home</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/products">Products</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  )
}
