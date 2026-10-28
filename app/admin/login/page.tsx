import Link from 'next/link'
import { Logo } from '@/components/site/logo'

export const metadata = { title: 'Langtian Admin Login', robots: { index: false, follow: false } }

export default async function AdminLogin({ searchParams }: { searchParams: Promise<{ error?: string; reason?: string }> }) {
  const params = await searchParams
  const error = params.error || (params.reason ? 'Please sign in to continue.' : '')
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-16">
      <Link href="/" aria-label="Langtian home" className="mb-8 block w-24"><Logo /></Link>
      <h1 className="text-3xl font-bold">Customer admin</h1>
      <p className="text-muted-foreground mt-2">Sign in to manage Langtian content.</p>
      {error && <p role="alert" className="mt-6 border border-red-300 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      <form action="/api/auth/login" method="post" className="mt-7 space-y-5">
        <div><label htmlFor="admin-email" className="mb-1 block font-medium">Email</label><input id="admin-email" name="email" type="email" required autoComplete="username" className="border-input h-11 w-full rounded border px-3" /></div>
        <div><label htmlFor="admin-password" className="mb-1 block font-medium">Password</label><input id="admin-password" name="password" type="password" required autoComplete="current-password" className="border-input h-11 w-full rounded border px-3" /></div>
        <button type="submit" className="bg-primary text-primary-foreground h-11 w-full rounded font-semibold">Sign in</button>
      </form>
    </div>
  )
}
