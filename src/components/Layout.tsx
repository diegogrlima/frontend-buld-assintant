import { Link, Outlet } from 'react-router'
import logoIcon from '../assets/logo/logo-icon.svg'

export function Layout() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-b border-gold-500/60 bg-ink-950/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoIcon} alt="" aria-hidden className="size-10" />
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
