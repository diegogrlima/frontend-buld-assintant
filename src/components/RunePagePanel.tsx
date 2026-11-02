import type { CSSProperties, ReactNode } from 'react'
import type { RuneRef, RunePage, RuneTreeRef } from '../types/api'
import { Panel } from './Panel'

// Cor de cada árvore no cliente do jogo (apenas apresentação; os dados vêm da API).
const TREE_COLORS: Record<string, string> = {
  '8000': '#c8aa6e', // Precisão
  '8100': '#d44242', // Dominação
  '8200': '#9faafc', // Feitiçaria
  '8300': '#49aab9', // Inspiração
  '8400': '#a1d586', // Determinação
}

function treeStyle(tree: RuneTreeRef): CSSProperties {
  return { '--tree': TREE_COLORS[tree.id] ?? '#c8aa6e' } as CSSProperties
}

// Coluna de ícones com largura fixa para a linha vertical passar pelo centro deles.
function Row({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <li className="relative flex items-center gap-4">
      <div className="grid w-20 shrink-0 place-items-center">{icon}</div>
      <div className="min-w-0 flex-1">{children}</div>
    </li>
  )
}

function TreeHeader({ tree }: { tree: RuneTreeRef }) {
  return (
    <Row
      icon={
        <span className="grid size-16 place-items-center rounded-full border-2 border-(--tree) bg-ink-950 shadow-[0_0_18px] shadow-(--tree)/40 ring-4 ring-(--tree)/15">
          <img src={tree.icon} alt="" className="size-9" />
        </span>
      }
    >
      <p className="font-display text-sm font-bold tracking-[0.2em] text-(--tree) uppercase">
        {tree.name}
      </p>
    </Row>
  )
}

function RuneText({ rune }: { rune: RuneRef }) {
  return (
    <>
      <p className="text-sm font-semibold tracking-wider text-(--tree) uppercase">{rune.name}</p>
      <p title={rune.description} className="line-clamp-3 text-xs leading-snug text-grey-100">
        {rune.description}
      </p>
    </>
  )
}

function MinorRune({ rune }: { rune: RuneRef }) {
  return (
    <Row
      icon={
        <img
          src={rune.icon}
          alt=""
          className="size-12 rounded-full border-2 border-(--tree)/70 bg-ink-950 p-1"
        />
      }
    >
      <RuneText rune={rune} />
    </Row>
  )
}

function TreeColumn({ tree, children }: { tree: RuneTreeRef; children: ReactNode }) {
  return (
    <div style={treeStyle(tree)} className="relative">
      {/* Linha que liga as runas da árvore, por trás dos ícones. */}
      <span
        aria-hidden
        className="absolute top-8 bottom-6 left-10 w-0.5 -translate-x-1/2 bg-linear-to-b from-(--tree) to-(--tree)/20"
      />
      <ul className="relative space-y-6">
        <TreeHeader tree={tree} />
        {children}
      </ul>
    </div>
  )
}

export function RunePagePanel({ runes }: { runes: RunePage }) {
  const { primary, secondary } = runes
  const glow = TREE_COLORS[primary.tree.id] ?? '#c8aa6e'

  return (
    <Panel title="Runas" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{ background: `radial-gradient(ellipse at 85% 40%, ${glow}, transparent 60%)` }}
      />

      <div className="relative grid gap-10 md:grid-cols-2">
        <TreeColumn tree={primary.tree}>
          <li className="flex items-center gap-3 pl-24">
            <span className="text-[10px] tracking-[0.2em] text-(--tree)/80 uppercase">
              Runa principal
            </span>
            <span aria-hidden className="h-px flex-1 bg-linear-to-r from-(--tree)/50 to-transparent" />
          </li>
          <Row
            icon={
              <img
                src={primary.keystone.icon}
                alt=""
                className="size-20 drop-shadow-[0_0_14px_var(--tree)]"
              />
            }
          >
            <p className="font-display text-lg font-bold tracking-wider text-(--tree) uppercase">
              {primary.keystone.name}
            </p>
            <p
              title={primary.keystone.description}
              className="line-clamp-3 text-xs leading-snug text-grey-100"
            >
              {primary.keystone.description}
            </p>
          </Row>
          {primary.runes.map((rune) => (
            <MinorRune key={rune.id} rune={rune} />
          ))}
        </TreeColumn>

        <div className="flex flex-col gap-8">
          <TreeColumn tree={secondary.tree}>
            {secondary.runes.map((rune) => (
              <MinorRune key={rune.id} rune={rune} />
            ))}
          </TreeColumn>

          <div className="border-l-2 border-gold-400 bg-ink-950/60 p-4">
            <p className="mb-1 text-[10px] tracking-[0.2em] text-gold-200 uppercase">
              Por que estas runas
            </p>
            <p className="text-sm leading-relaxed whitespace-pre-line text-grey-100">
              {runes.reason}
            </p>
          </div>
        </div>
      </div>
    </Panel>
  )
}
