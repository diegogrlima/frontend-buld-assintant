import { useState } from 'react'
import { LANES, LANE_NAMES, type Lane } from '../constants/lanes'
import { LaneIcon } from './LaneIcon'

type LanePickerProps = {
  value?: Lane
  onChange: (lane: Lane) => void
}

// Seletor no estilo do lobby do jogo: título com filetes dourados e um painel
// azul-hextech com as rotas, com uma seta apontando para a rota escolhida.
export function LanePicker({ value, onChange }: LanePickerProps) {
  const [hovered, setHovered] = useState<Lane>()
  const shown = hovered ?? value

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-3">
        <span aria-hidden className="h-px w-6 bg-linear-to-r from-transparent to-gold-300" />
        <span className="min-w-28 text-center font-display text-sm font-bold tracking-[0.25em] text-gold-100 uppercase">
          {shown ? LANE_NAMES[shown] : 'Escolha sua rota'}
        </span>
        <span aria-hidden className="h-px w-6 bg-linear-to-l from-transparent to-gold-300" />
      </div>

      <div
        role="radiogroup"
        aria-label="Sua rota"
        className="relative flex items-stretch border border-gold-400 bg-linear-to-b from-hextech-dark/40 via-ink-900 to-ink-950 px-2 shadow-[inset_0_1px_0_rgb(200_170_110/0.35),inset_0_0_18px_rgb(0_90_130/0.35),0_0_14px_rgb(0_90_130/0.25)]"
      >
        {LANES.map((lane) => {
          const selected = value === lane
          return (
            <button
              key={lane}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={LANE_NAMES[lane]}
              onClick={() => onChange(lane)}
              onMouseEnter={() => setHovered(lane)}
              onMouseLeave={() => setHovered(undefined)}
              onFocus={() => setHovered(lane)}
              onBlur={() => setHovered(undefined)}
              // Mesmos estados do lobby: dourado parado, claro no hover e azul hextech com brilho quando escolhida.
              className={`relative grid h-14 w-12 place-items-center transition sm:w-14 ${
                selected
                  ? 'bg-linear-to-t from-hextech/25 to-transparent text-hextech drop-shadow-[0_0_6px_rgb(10_200_185/0.8)]'
                  : 'text-gold-200 hover:bg-linear-to-t hover:from-gold-100/10 hover:to-transparent hover:text-[#edeeee] hover:drop-shadow-[0_0_4px_rgb(237_238_238/0.4)]'
              }`}
            >
              <LaneIcon lane={lane} className="size-8" />
              {selected && (
                <>
                  {/* Filete luminoso na base da rota escolhida. */}
                  <span
                    aria-hidden
                    className="absolute inset-x-1 bottom-0 h-0.5 bg-hextech shadow-[0_0_8px_rgb(10_200_185)]"
                  />
                  {/* Seta no estilo do cliente, apontando para fora do painel. */}
                  <span
                    aria-hidden
                    className="absolute -bottom-[7px] size-3 rotate-45 border-r border-b border-gold-400 bg-ink-950"
                  />
                </>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
