import { Fragment, type ReactNode } from 'react'
import type { BuildItem, ItemStack } from '../types/api'
import { Panel } from './Panel'

type BuildPathPanelProps = {
  starterItems: ItemStack[]
  starterReason: string
  build: BuildItem[]
  totalGold: number
}

const gold = new Intl.NumberFormat('pt-BR')

function Step({ title, children }: { title: string; children: ReactNode }) {
  return (
    <li className="flex flex-col items-center gap-1.5" title={title}>
      <div className="flex items-center gap-1 border border-gold-500 bg-ink-950/80 p-1.5">
        {children}
      </div>
    </li>
  )
}

function ItemIcon({ item, small = false }: { item: ItemStack; small?: boolean }) {
  return (
    <span className="relative shrink-0">
      <img
        src={item.icon}
        alt={item.name}
        className={
          small ? 'size-8 border border-gold-500 opacity-90' : 'size-11 border border-gold-400'
        }
      />
      {item.count > 1 && (
        <span className="absolute right-0.5 bottom-0 text-xs font-semibold text-gold-100 [text-shadow:0_0_3px_#000]">
          {item.count}
        </span>
      )}
    </span>
  )
}

function stackText(items: ItemStack[]) {
  return items
    .map((item) => (item.count > 1 ? `${item.count}× ${item.name}` : item.name))
    .join(', ')
}

function Connector() {
  return <li aria-hidden className="h-px w-4 bg-linear-to-r from-gold-400 to-gold-300 sm:w-6" />
}

export function BuildPathPanel({
  starterItems,
  starterReason,
  build,
  totalGold,
}: BuildPathPanelProps) {
  return (
    <Panel title="Caminho da build">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-4">
        {starterItems.length > 0 && (
          <>
            <Step title={`Compra inicial: ${stackText(starterItems)}`}>
              {starterItems.map((item) => (
                <ItemIcon key={item.id} item={item} />
              ))}
            </Step>
            <Connector />
          </>
        )}
        {build.map((item, index) => (
          <Fragment key={item.id}>
            <Step
              title={
                item.components.length > 0
                  ? `Compre ${stackText(item.components)} e feche ${item.name} (${gold.format(item.gold)} de ouro)`
                  : `${item.order}. ${item.name} (${gold.format(item.gold)} de ouro)`
              }
            >
              {/* Componentes da receita primeiro; o item fechado por último. */}
              {item.components.length > 0 && (
                <>
                  <span className="flex items-center gap-1">
                    {item.components.map((component) => (
                      <ItemIcon key={component.id} item={component} small />
                    ))}
                  </span>
                  <span aria-hidden className="self-center px-0.5 text-gold-300">
                    ›
                  </span>
                </>
              )}
              <span className="relative">
                <img src={item.icon} alt={item.name} className="size-11 border border-gold-400" />
                <span className="absolute -top-2 -left-2 grid size-5 place-items-center rounded-full border border-gold-300 bg-ink-900 font-display text-[10px] text-gold-100">
                  {item.order}
                </span>
              </span>
            </Step>
            {index < build.length - 1 && <Connector />}
          </Fragment>
        ))}
      </ol>

      {starterReason && (
        <p className="mt-4 text-sm text-grey-100">
          <span className="font-semibold text-gold-100">Compra inicial: </span>
          {starterReason}
        </p>
      )}
      <p className="mt-3 text-xs text-grey-100">
        Cada etapa mostra os componentes da receita a comprar antes de fechar o item.
      </p>
      <p className="mt-2 text-sm text-grey-100">
        Custo total: <span className="text-gold-300">{gold.format(totalGold)}</span> de ouro
      </p>
    </Panel>
  )
}
