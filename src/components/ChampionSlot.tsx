import type { ReactNode } from 'react'
import type { Champion } from '../types/api'

type ChampionSlotProps = {
  label: string
  // Ícone exibido ao lado do texto embaixo do círculo.
  labelIcon?: ReactNode
  champion?: Champion
  active: boolean
  size?: 'lg' | 'md'
  // Destaca o adversário na mesma rota do jogador.
  opponent?: boolean
  onSelect: () => void
  onClear: () => void
}

export function ChampionSlot({
  label,
  labelIcon,
  champion,
  active,
  size = 'md',
  opponent = false,
  onSelect,
  onClear,
}: ChampionSlotProps) {
  const box = size === 'lg' ? 'size-24 sm:size-28' : 'size-16 sm:size-20'

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <button
          type="button"
          onClick={onSelect}
          aria-pressed={active}
          aria-label={champion ? `${label}: ${champion.name}` : `${label}: vazio`}
          className={`${box} grid place-items-center overflow-hidden rounded-full border-2 bg-ink-950 transition ${
            active
              ? 'border-hextech shadow-[0_0_16px] shadow-hextech/60'
              : opponent
                ? 'border-red-400 shadow-[0_0_12px] shadow-red-500/40'
                : 'border-gold-400 hover:border-gold-200'
          }`}
        >
          {champion ? (
            <img src={champion.icon} alt="" className="size-full object-cover" />
          ) : (
            <span aria-hidden className="text-2xl text-gold-400">
              +
            </span>
          )}
        </button>
        {champion && (
          <button
            type="button"
            onClick={onClear}
            aria-label={`Remover ${champion.name}`}
            className="absolute -top-1 -right-1 grid size-6 place-items-center rounded-full border border-gold-400 bg-ink-900 text-xs text-gold-100 hover:border-red-400 hover:text-red-300"
          >
            ✕
          </button>
        )}
      </div>
      <span className="flex max-w-24 items-center justify-center gap-1 text-xs text-grey-100">
        {labelIcon}
        <span className="truncate">{champion?.name ?? label}</span>
      </span>
      {opponent && (
        <span className="-mt-1 text-[10px] tracking-wider text-red-300 uppercase">
          Oponente direto
        </span>
      )}
    </div>
  )
}
