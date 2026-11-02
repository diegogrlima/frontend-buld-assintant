import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { ChampionGrid } from '../components/ChampionGrid'
import { ChampionSlot } from '../components/ChampionSlot'
import { LaneIcon } from '../components/LaneIcon'
import { LanePicker } from '../components/LanePicker'
import { LANES, LANE_NAMES, type Lane } from '../constants/lanes'
import { Panel } from '../components/Panel'
import { Spinner } from '../components/Spinner'
import { useChampions } from '../hooks/useChampions'
import { getErrorMessage } from '../services/api'
import { requestRecommendation } from '../services/builds'
import type { Champion, LanedChampion } from '../types/api'
import type { RecommendationState } from './RecommendationPage'

// Slot 0 é o campeão do jogador; os slots 1 a 5 são os adversários, um por rota
// (na ordem de LANES), como no lobby do jogo. Assim as rotas inimigas nunca se repetem.
type Slots = (Champion | undefined)[]

// Estado opcional para reabrir a seleção a partir de uma recomendação.
export type MatchupState = {
  champion: LanedChampion
  enemies: LanedChampion[]
}

function stripLane({ id, name, icon }: Champion): Champion {
  return { id, name, icon }
}

function initialMatchup(state: unknown): { slots: Slots; lane?: Lane } {
  const matchup = state as MatchupState | null
  if (matchup?.champion && matchup.enemies?.length === LANES.length) {
    const byLane = LANES.map((lane) => matchup.enemies.find((enemy) => enemy.lane === lane))
    if (byLane.every(Boolean)) {
      return {
        slots: [stripLane(matchup.champion), ...byLane.map((enemy) => stripLane(enemy!))],
        lane: matchup.champion.lane,
      }
    }
  }
  return { slots: Array.from({ length: LANES.length + 1 }, () => undefined) }
}

export function MatchupPage() {
  const champions = useChampions()
  const navigate = useNavigate()
  const location = useLocation()
  const [initial] = useState(() => initialMatchup(location.state))
  const [slots, setSlots] = useState<Slots>(initial.slots)
  const [lane, setLane] = useState<Lane | undefined>(initial.lane)
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
  const complete = slots.every(Boolean) && lane !== undefined
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
        lane: lane!,
        enemies: enemies.map((enemy, i) => ({ championId: enemy!.id, lane: LANES[i]! })),
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
          Escolha o seu campeão, a sua rota e os cinco campeões da equipe adversária em cada rota.
          A recomendação traz uma única build e uma página de runas adaptadas a esse confronto.
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
            <LanePicker
              value={lane}
              onChange={(value) => {
                setLane(value)
                setSubmitError(undefined)
              }}
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
              {LANES.map((enemyLane, i) => (
                <div key={enemyLane} className="flex flex-col items-center gap-1">
                  <span className="flex items-center gap-1 text-[10px] tracking-wider text-grey-100 uppercase">
                    <LaneIcon lane={enemyLane} className="size-3.5" />
                    {LANE_NAMES[enemyLane]}
                  </span>
                  <ChampionSlot
                    label={LANE_NAMES[enemyLane]}
                    champion={enemies[i]}
                    active={activeSlot === i + 1}
                    opponent={lane === enemyLane}
                    onSelect={() => setActiveSlot(i + 1)}
                    onClear={() => clear(i + 1)}
                  />
                </div>
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
              Selecione o seu campeão, a sua rota e os {LANES.length} adversários para continuar.
            </p>
          )}
        </div>
      </Panel>

      <Panel
        title={
          activeSlot === 0
            ? 'Selecione o seu campeão'
            : `Selecione o adversário: ${LANE_NAMES[LANES[activeSlot - 1]!]}`
        }
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
