import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { ChampionGrid } from '../components/ChampionGrid'
import { ChampionSlot } from '../components/ChampionSlot'
import { Panel } from '../components/Panel'
import { Spinner } from '../components/Spinner'
import { useChampions } from '../hooks/useChampions'
import { getErrorMessage } from '../services/api'
import { requestRecommendation } from '../services/builds'
import type { Champion } from '../types/api'
import type { RecommendationState } from './RecommendationPage'

// A API exige exatamente cinco adversários.
const ENEMY_COUNT = 5
// Slot 0 é o campeão do jogador; 1 a 5 são os adversários.
type Slots = (Champion | undefined)[]

// Estado opcional para reabrir a seleção a partir de uma recomendação.
export type MatchupState = {
  champion: Champion
  enemies: Champion[]
}

function initialSlots(state: unknown): Slots {
  const matchup = state as MatchupState | null
  if (matchup?.champion && matchup.enemies?.length === ENEMY_COUNT) {
    return [matchup.champion, ...matchup.enemies]
  }
  return Array.from({ length: ENEMY_COUNT + 1 }, () => undefined)
}

export function MatchupPage() {
  const champions = useChampions()
  const navigate = useNavigate()
  const location = useLocation()
  const [slots, setSlots] = useState<Slots>(() => initialSlots(location.state))
  const [activeSlot, setActiveSlot] = useState(() => {
    const firstEmpty = slots.findIndex((slot) => !slot)
    return firstEmpty === -1 ? 0 : firstEmpty
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string>()

  const selectedIds = useMemo(
    () => new Set(slots.filter((slot) => slot !== undefined).map((slot) => slot.id)),
    [slots],
  )
  const complete = slots.every(Boolean)
  const [player, ...enemies] = slots

  function pick(champion: Champion) {
    const next = slots.with(activeSlot, champion)
    setSlots(next)
    setSubmitError(undefined)
    // Avança para o próximo slot vazio, começando pelo seguinte.
    const order = [...next.keys()].map((i) => (activeSlot + 1 + i) % next.length)
    const nextEmpty = order.find((i) => !next[i])
    if (nextEmpty !== undefined) setActiveSlot(nextEmpty)
  }

  function clear(index: number) {
    setSlots((current) => current.with(index, undefined))
    setActiveSlot(index)
    setSubmitError(undefined)
  }

  async function analyze() {
    if (!complete || submitting) return
    setSubmitting(true)
    setSubmitError(undefined)
    try {
      const recommendation = await requestRecommendation({
        championId: player!.id,
        enemyChampionIds: enemies.map((enemy) => enemy!.id),
      })
      navigate('/build', { state: { recommendation } satisfies RecommendationState })
    } catch (error) {
      setSubmitError(getErrorMessage(error))
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl tracking-wide text-gold-100 sm:text-4xl">
          Análise da partida
        </h1>
        <p className="mt-2 max-w-2xl text-grey-100">
          Escolha o seu campeão e os cinco campeões da equipe adversária. A recomendação traz uma
          única build adaptada a esse confronto.
        </p>
      </div>

      <Panel title="Confronto">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-between">
          <div className="flex flex-col items-center gap-2">
            <span className="font-display text-xs tracking-[0.2em] text-hextech uppercase">
              Você
            </span>
            <ChampionSlot
              label="Seu campeão"
              champion={player}
              active={activeSlot === 0}
              size="lg"
              onSelect={() => setActiveSlot(0)}
              onClear={() => clear(0)}
            />
          </div>

          <span aria-hidden className="font-display text-2xl text-gold-400">
            VS
          </span>

          <div className="flex flex-col items-center gap-2">
            <span className="font-display text-xs tracking-[0.2em] text-red-400 uppercase">
              Equipe adversária
            </span>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              {enemies.map((enemy, i) => (
                <ChampionSlot
                  key={i}
                  label={`Adversário ${i + 1}`}
                  champion={enemy}
                  active={activeSlot === i + 1}
                  onSelect={() => setActiveSlot(i + 1)}
                  onClear={() => clear(i + 1)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          {submitError && (
            <p role="alert" className="border border-red-500/60 bg-red-950/40 px-4 py-2 text-sm text-red-200">
              {submitError}
            </p>
          )}
          <button
            type="button"
            onClick={analyze}
            disabled={!complete || submitting}
            className="min-w-56 border-2 border-hextech bg-linear-to-b from-hextech-dark to-ink-900 px-8 py-3 font-display tracking-[0.2em] text-gold-100 uppercase transition hover:shadow-[0_0_20px] hover:shadow-hextech/50 disabled:cursor-not-allowed disabled:border-grey-300 disabled:from-ink-800 disabled:text-grey-200 disabled:shadow-none"
          >
            {submitting ? 'Analisando…' : 'Analisar partida'}
          </button>
          {!complete && (
            <p className="text-xs text-grey-100">
              Selecione o seu campeão e os {ENEMY_COUNT} adversários para continuar.
            </p>
          )}
        </div>
      </Panel>

      <Panel
        title={activeSlot === 0 ? 'Selecione o seu campeão' : `Selecione o adversário ${activeSlot}`}
      >
        {champions.status === 'loading' && (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        )}
        {champions.status === 'error' && (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <p className="text-red-200">{champions.message}</p>
            <button
              type="button"
              onClick={champions.retry}
              className="border border-gold-400 px-4 py-2 text-sm text-gold-100 hover:border-gold-200"
            >
              Tentar novamente
            </button>
          </div>
        )}
        {champions.status === 'success' && (
          <>
            <ChampionGrid
              champions={champions.data.champions}
              unavailableIds={selectedIds}
              onPick={pick}
            />
            <p className="mt-4 text-right text-xs text-grey-200">
              Dados do patch {champions.data.version}
            </p>
          </>
        )}
      </Panel>

      {submitting && (
        <div
          role="status"
          className="fixed inset-0 z-50 grid place-items-center bg-ink-950/85 backdrop-blur-sm"
        >
          <div className="flex flex-col items-center gap-4 text-center">
            <Spinner className="size-12" />
            <p className="font-display tracking-[0.2em] text-gold-100 uppercase">
              Analisando a composição inimiga
            </p>
            <p className="text-sm text-grey-100">Isso pode levar alguns segundos.</p>
          </div>
        </div>
      )}
    </div>
  )
}
