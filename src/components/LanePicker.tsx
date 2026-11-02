import { LANES, LANE_NAMES, type Lane } from '../constants/lanes'
import { LaneIcon } from './LaneIcon'

type LanePickerProps = {
  value?: Lane
  onChange: (lane: Lane) => void
}

export function LanePicker({ value, onChange }: LanePickerProps) {
  return (
    <div role="radiogroup" aria-label="Sua rota" className="flex flex-wrap justify-center gap-1">
      {LANES.map((lane) => {
        const selected = value === lane
        return (
          <button
            key={lane}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(lane)}
            title={LANE_NAMES[lane]}
            className={`flex flex-col items-center gap-1 border px-2 py-1.5 text-[10px] tracking-wider uppercase transition ${
              selected
                ? 'border-hextech bg-hextech-dark/40 text-gold-100'
                : 'border-gold-500 text-grey-100 hover:border-gold-300 hover:text-gold-100'
            }`}
          >
            <LaneIcon lane={lane} />
            {LANE_NAMES[lane]}
          </button>
        )
      })}
    </div>
  )
}
