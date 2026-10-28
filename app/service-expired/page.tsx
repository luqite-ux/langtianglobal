import Link from 'next/link'

export const metadata = {
  title: 'Website service temporarily unavailable',
  robots: { index: false, follow: false },
}

export default function ServiceExpiredPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f5f2] px-6 text-[#191919]">
      <div className="max-w-lg text-center">
        <h1 className="text-3xl font-semibold">Website service is temporarily unavailable</h1>
        <p className="mt-4 text-base text-[#4b4b4b]">For assistance, email info@langtianglobal.com.</p>
        <Link className="mt-6 inline-block font-medium text-[#a20b14] underline" href="/admin/login">Administrator login</Link>
      </div>
    </main>
  )
}
