import type { ReactNode } from 'react'

type PanelProps = {
  title: string
  children: ReactNode
  className?: string
}

export function Panel({ title, children, className = '' }: PanelProps) {
  return (
    <section
      className={`border border-gold-500 bg-linear-to-b from-ink-900/90 to-ink-950/90 p-5 ${className}`}
    >
      <h2 className="mb-4 flex items-center gap-3 font-display text-sm tracking-[0.2em] text-gold-200 uppercase">
        {title}
        <span aria-hidden className="h-px flex-1 bg-linear-to-r from-gold-400 to-transparent" />
      </h2>
      {children}
    </section>
  )
}
