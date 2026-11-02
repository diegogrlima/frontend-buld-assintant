import type { Champion } from '../types/api'

type ChampionSlotProps = {
  label: string
  champion?: Champion
  active: boolean
  size?: 'lg' | 'md'
  onSelect: () => void
  onClear: () => void
}

export function ChampionSlot({
  label,
  champion,
  active,
  size = 'md',
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
      <span className="max-w-24 truncate text-center text-xs text-grey-100">
        {champion?.name ?? label}
      </span>
    </div>
  )
}
