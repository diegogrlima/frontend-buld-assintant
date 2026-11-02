import type { RuneRef, RuneTreeRef, RunePage } from '../types/api'
import { Panel } from './Panel'

function TreeHeader({ tree, label }: { tree: RuneTreeRef; label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <img src={tree.icon} alt="" className="size-8" />
      <div>
        <p className="text-[10px] tracking-[0.2em] text-grey-100 uppercase">{label}</p>
        <p className="font-display text-gold-100">{tree.name}</p>
      </div>
    </div>
  )
}

function RuneRow({ rune }: { rune: RuneRef }) {
  return (
    <li className="flex gap-3">
      <img
        src={rune.icon}
        alt=""
        className="size-10 shrink-0 rounded-full border border-gold-500 bg-ink-950 p-1"
      />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gold-100">{rune.name}</p>
        <p className="text-xs text-grey-100">{rune.description}</p>
      </div>
    </li>
  )
}

export function RunePagePanel({ runes }: { runes: RunePage }) {
  const { primary, secondary } = runes

  return (
    <Panel title="Runas">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <TreeHeader tree={primary.tree} label="Árvore primária" />
          <div className="mb-4 flex gap-4 border border-gold-500/70 bg-ink-950/60 p-3">
            <img
              src={primary.keystone.icon}
              alt=""
              className="size-16 shrink-0 rounded-full border-2 border-gold-300 bg-ink-950 shadow-[0_0_16px] shadow-gold-400/40"
            />
            <div className="min-w-0">
              <p className="text-[10px] tracking-[0.2em] text-hextech uppercase">Runa principal</p>
              <p className="font-display text-lg text-gold-100">{primary.keystone.name}</p>
              <p className="text-xs text-grey-100">{primary.keystone.description}</p>
            </div>
          </div>
          <ul className="space-y-3">
            {primary.runes.map((rune) => (
              <RuneRow key={rune.id} rune={rune} />
            ))}
          </ul>
        </div>

        <div>
          <TreeHeader tree={secondary.tree} label="Árvore secundária" />
          <ul className="space-y-3">
            {secondary.runes.map((rune) => (
              <RuneRow key={rune.id} rune={rune} />
            ))}
          </ul>
          <p className="mt-6 border-t border-gold-500/60 pt-4 text-sm leading-relaxed whitespace-pre-line text-grey-100">
            {runes.reason}
          </p>
        </div>
      </div>
    </Panel>
  )
}
