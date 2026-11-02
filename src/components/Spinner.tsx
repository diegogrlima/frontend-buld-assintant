export function Spinner({ className = 'size-8' }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`${className} inline-block animate-spin rounded-full border-2 border-gold-500 border-t-hextech`}
    />
  )
}
