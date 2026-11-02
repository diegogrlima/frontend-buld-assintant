import { useMemo, useState } from 'react'
import type { Champion } from '../types/api'

type ChampionGridProps = {
  champions: Champion[]
  unavailableIds: ReadonlySet<string>
  onPick: (champion: Champion) => void
}

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}

export function ChampionGrid({ champions, unavailableIds, onPick }: ChampionGridProps) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const term = normalize(query.trim())
    if (!term) return champions
    return champions.filter((champion) => normalize(champion.name).includes(term))
  }, [champions, query])

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Buscar campeão"
        aria-label="Buscar campeão"
        className="mb-4 w-full border border-gold-500 bg-ink-950 px-3 py-2 text-gold-100 placeholder:text-grey-200 focus:border-gold-300 focus:outline-none"
      />
      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-grey-100">Nenhum campeão encontrado.</p>
      ) : (
        <ul className="grid max-h-[26rem] grid-cols-[repeat(auto-fill,minmax(4.5rem,1fr))] gap-3 overflow-y-auto pr-1">
          {filtered.map((champion) => {
            const unavailable = unavailableIds.has(champion.id)
            return (
              <li key={champion.id}>
                <button
                  type="button"
                  disabled={unavailable}
                  onClick={() => onPick(champion)}
                  className="group flex w-full flex-col items-center gap-1 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <img
                    src={champion.icon}
                    alt=""
                    loading="lazy"
                    className="aspect-square w-full border border-gold-500 object-cover transition group-enabled:group-hover:border-gold-200 group-enabled:group-hover:brightness-110"
                  />
                  <span className="w-full truncate text-center text-[11px] text-grey-100 group-enabled:group-hover:text-gold-100">
                    {champion.name}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
