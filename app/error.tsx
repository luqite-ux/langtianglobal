'use client'

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto max-w-2xl px-5 py-20">
      <h1 className="text-3xl font-bold">This page is temporarily unavailable</h1>
      <p className="mt-4">If you are previewing changes, the preview may have expired. Exit preview and return to the published site.</p>
      <div className="mt-7 flex flex-wrap items-center gap-5">
        <form action="/api/site-content/exit-preview" method="post">
          <button className="bg-primary text-primary-foreground px-5 py-3 font-semibold" type="submit">Exit preview</button>
        </form>
        <button className="font-semibold underline underline-offset-2" onClick={reset} type="button">Try again</button>
      </div>
    </div>
  )
}
