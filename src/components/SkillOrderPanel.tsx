import type { SkillKey, SkillOrder } from '../types/api'
import { Panel } from './Panel'

const KEYS: SkillKey[] = ['Q', 'W', 'E', 'R']
const LEVELS = Array.from({ length: 18 }, (_, index) => index + 1)

const count = new Intl.NumberFormat('pt-BR')

function SkillIcon({ order, skill }: { order: SkillOrder; skill: SkillKey }) {
  const spell = order.spells.find((s) => s.key === skill)
  return (
    <span className="relative shrink-0" title={spell ? `${skill}: ${spell.name}` : skill}>
      {spell ? (
        <img src={spell.icon} alt={spell.name} className="size-10 border border-gold-400" />
      ) : (
        <span className="grid size-10 place-items-center border border-gold-400 bg-ink-950" />
      )}
      <span className="absolute right-0 bottom-0 bg-ink-950/90 px-1 font-display text-[10px] text-gold-100">
        {skill}
      </span>
    </span>
  )
}

export function SkillOrderPanel({ skillOrder }: { skillOrder: SkillOrder }) {
  const { levels, observedLevels } = skillOrder
  const suggested = levels.length - observedLevels

  return (
    <Panel title="Ordem das habilidades">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-2 text-xs text-grey-100 uppercase">Prioridade</span>
        {skillOrder.priority.map((skill, index) => (
          <span key={skill} className="flex items-center gap-2">
            <SkillIcon order={skillOrder} skill={skill} />
            {index < skillOrder.priority.length - 1 && (
              <span aria-hidden className="font-display text-gold-300">
                ›
              </span>
            )}
          </span>
        ))}
      </div>

      {skillOrder.reason && <p className="mt-3 text-sm text-grey-100">{skillOrder.reason}</p>}

      {/* Uma linha por habilidade e uma coluna por nível, como no cliente do jogo. */}
      {levels.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <table className="border-separate border-spacing-0.5 text-center">
            <caption className="sr-only">Habilidade a evoluir em cada nível</caption>
            <thead>
              <tr>
                <th scope="col" className="sr-only">
                  Habilidade
                </th>
                {LEVELS.map((level) => (
                  <th
                    key={level}
                    scope="col"
                    className="w-7 font-display text-[10px] font-normal text-grey-200"
                  >
                    {level}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {KEYS.map((skill) => (
                <tr key={skill}>
                  <th scope="row" className="pr-2">
                    <SkillIcon order={skillOrder} skill={skill} />
                  </th>
                  {LEVELS.map((level) => {
                    const chosen = levels[level - 1]
                    // Níveis sugeridos pela prioridade ficam tracejados e mais apagados.
                    const fromMatch = level <= observedLevels
                    return (
                      <td
                        key={level}
                        title={
                          chosen === skill
                            ? `Nível ${level}: ${skill} (${fromMatch ? 'partidas de alto elo' : 'sugerido'})`
                            : undefined
                        }
                        className={`h-10 w-7 border font-display text-xs ${
                          chosen === skill
                            ? skill === 'R'
                              ? fromMatch
                                ? 'border-hextech bg-hextech-dark/60 text-gold-100'
                                : 'border-dashed border-hextech/70 bg-hextech-dark/25 text-gold-100/80'
                              : fromMatch
                                ? 'border-gold-300 bg-gold-400/60 text-gold-100'
                                : 'border-dashed border-gold-300/70 bg-gold-400/20 text-gold-100/80'
                            : chosen
                              ? 'border-gold-500/40 bg-ink-950/60'
                              : 'border-gold-500/20 bg-ink-950/30'
                        }`}
                      >
                        {chosen === skill ? skill : ''}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {suggested > 0 && observedLevels > 0 && (
        <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-grey-100">
          <span className="flex items-center gap-1.5">
            <span aria-hidden className="size-3 border border-gold-300 bg-gold-400/60" />
            Partidas de alto elo
          </span>
          <span className="flex items-center gap-1.5">
            <span
              aria-hidden
              className="size-3 border border-dashed border-gold-300/70 bg-gold-400/20"
            />
            Sugerido pela prioridade
          </span>
        </p>
      )}

      <p className="mt-3 text-xs text-grey-100">
        {skillOrder.source === 'ai'
          ? 'Ainda não há partidas de Challenger e Grão-Mestre com a ordem de habilidades deste campeão: a prioridade foi sugerida pela IA a partir das habilidades dele, e a sequência segue as regras do jogo (ultimate nos níveis 6, 11 e 16).'
          : `Sequência mais comum entre jogadores de Challenger e Grão-Mestre, em ${count.format(skillOrder.matches)} partidas${
              skillOrder.source === 'champion'
                ? ' com este campeão em qualquer rota (não há partidas suficientes nesta rota)'
                : ''
            }.${
              suggested > 0
                ? ` Depois do nível ${observedLevels}, poucas partidas seguiram a mesma sequência; os níveis seguintes são sugeridos pela prioridade, seguindo as regras do jogo.`
                : ''
            }`}
        {levels.length < LEVELS.length &&
          ' Este campeão tem regras próprias de pontos de habilidade, então só os níveis vistos nas partidas são mostrados.'}
      </p>
    </Panel>
  )
}
