import type { Lane } from '../constants/lanes'

// Ícones próprios no formato de minimapa: o traço destaca a região da rota.
const PATHS: Record<Lane, string> = {
  top: 'M4 15V4h11',
  jungle: 'M9 6l2.5 3L9 12l-2.5-3zM15 12l2.5 3-2.5 3-2.5-3z',
  mid: 'M5 19L19 5',
  bot: 'M9 20h11V9',
  support: 'M12 8c2 1.2 3.6 1.5 5 1.5 0 4.5-2 7.3-5 8.5-3-1.2-5-4-5-8.5 1.4 0 3-.3 5-1.5z',
}

export function LaneIcon({ lane, className = 'size-5' }: { lane: Lane; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="1" stroke="currentColor" strokeOpacity="0.25" />
      <path
        d={PATHS[lane]}
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={lane === 'jungle' || lane === 'support' ? 'currentColor' : 'none'}
      />
    </svg>
  )
}
