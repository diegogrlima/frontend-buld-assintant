import { Link, Outlet } from 'react-router'

export function Layout() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-b border-gold-500/60 bg-ink-950/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
          <Link to="/" className="flex items-center gap-3">
            <span
              aria-hidden
              className="grid size-8 rotate-45 place-items-center border border-gold-300 bg-ink-900"
            >
              <span className="size-3 -rotate-45 bg-hextech shadow-[0_0_10px] shadow-hextech" />
            </span>
            <span className="font-display text-lg tracking-[0.2em] text-gold-100 uppercase">
              Build Assistant
            </span>
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
