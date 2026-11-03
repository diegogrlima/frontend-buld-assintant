import { Link, Navigate, useLocation } from 'react-router'
import { BuildPathPanel } from '../components/BuildPathPanel'
import { LaneIcon } from '../components/LaneIcon'
import { Panel } from '../components/Panel'
import { RunePagePanel } from '../components/RunePagePanel'
import { SkillOrderPanel } from '../components/SkillOrderPanel'
import { LANE_NAMES } from '../constants/lanes'
import type { BuildRecommendation } from '../types/api'
import type { MatchupState } from './MatchupPage'

// A API não guarda recomendações, então o resultado chega pela navegação.
export type RecommendationState = {
  recommendation: BuildRecommendation
}

const gold = new Intl.NumberFormat('pt-BR')

export function RecommendationPage() {
  const location = useLocation()
  const recommendation = (location.state as RecommendationState | null)?.recommendation
  if (!recommendation) return <Navigate to="/" replace />

  const { champion, enemies, build, threats } = recommendation
  const matchup: MatchupState = { champion, enemies }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 border border-gold-500 bg-linear-to-r from-ink-900 to-ink-950 p-5 sm:flex-row sm:items-center">
        <img
          src={champion.icon}
          alt=""
          className="size-24 rounded-full border-2 border-gold-300 shadow-[0_0_20px] shadow-gold-400/40"
        />
        <div className="flex-1">
          <p className="font-display text-xs tracking-[0.2em] text-hextech uppercase">
            Build recomendada
          </p>
          <h1 className="font-display text-3xl text-gold-100">{champion.name}</h1>
          <p className="flex items-center gap-1.5 text-sm text-grey-100">
            <LaneIcon lane={champion.lane} className="size-4" />
            {LANE_NAMES[champion.lane]}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="text-xs text-grey-100 uppercase">contra</span>
            {enemies.map((enemy) => {
              const opponent = enemy.lane === champion.lane
              return (
                <figure key={enemy.id} className="flex flex-col items-center gap-0.5">
                  <img
                    src={enemy.icon}
                    alt={enemy.name}
                    className={`size-9 rounded-full border ${
                      opponent ? 'border-2 border-red-400' : 'border-red-400/50'
                    }`}
                  />
                  <figcaption
                    title={`${enemy.name} (${LANE_NAMES[enemy.lane]})`}
                    className={`text-[10px] uppercase ${opponent ? 'text-red-300' : 'text-grey-200'}`}
                  >
                    {opponent ? 'Oponente' : LANE_NAMES[enemy.lane]}
                  </figcaption>
                </figure>
              )
            })}
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <Link
            to="/"
            state={matchup}
            className="border border-gold-400 px-4 py-2 text-center text-sm text-gold-100 hover:border-gold-200"
          >
            Ajustar seleção
          </Link>
          <Link to="/" className="text-center text-sm text-grey-100 hover:text-gold-100">
            Nova análise
          </Link>
        </div>
      </div>

      {recommendation.warnings.length > 0 && (
        <div role="note" className="border border-amber-500/60 bg-amber-950/30 p-4">
          <p className="mb-2 font-display text-xs tracking-[0.2em] text-amber-300 uppercase">
            Atenção
          </p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-amber-100">
            {recommendation.warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      <Panel title="Itens">
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {build.map((item) => (
            <li key={item.id} className="flex gap-3 border border-gold-500/70 bg-ink-950/60 p-3">
              <div className="relative shrink-0">
                <img src={item.icon} alt="" className="size-14 border border-gold-400" />
                <span className="absolute -top-2 -left-2 grid size-6 place-items-center rounded-full border border-gold-300 bg-ink-900 font-display text-xs text-gold-100">
                  {item.order}
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gold-100">{item.name}</p>
                <p className="text-xs text-gold-300">{gold.format(item.gold)} de ouro</p>
                <p className="mt-1 text-sm text-grey-100">{item.reason}</p>
              </div>
            </li>
          ))}
        </ol>
      </Panel>

      <BuildPathPanel
        starterItems={recommendation.starterItems}
        build={build}
        totalGold={recommendation.totalGold}
      />

      <SkillOrderPanel skillOrder={recommendation.skillOrder} />

      <RunePagePanel runes={recommendation.runes} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Ameaças consideradas">
          <ul className="space-y-3">
            {threats.map(({ champion: threat, reason }) => (
              <li key={threat.id} className="flex gap-3">
                <img
                  src={threat.icon}
                  alt=""
                  className="size-10 shrink-0 rounded-full border border-red-400/70"
                />
                <div>
                  <p className="font-semibold text-gold-100">{threat.name}</p>
                  <p className="text-sm text-grey-100">{reason}</p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Justificativa">
          <p className="leading-relaxed whitespace-pre-line text-grey-100">
            {recommendation.justification}
          </p>
        </Panel>

        <Panel title="Equilíbrio da escolha" className="lg:col-span-2">
          <p className="leading-relaxed whitespace-pre-line text-grey-100">
            {recommendation.balance}
          </p>
        </Panel>
      </div>

      <p className="text-center text-xs text-grey-200">
        Recomendação de apoio à decisão, não garante a vitória. Dados do patch{' '}
        {recommendation.dataVersion}.
      </p>
    </div>
  )
}
