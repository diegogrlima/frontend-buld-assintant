import type { SkillKey, SkillOrder } from '../types/api'
import { Panel } from './Panel'

const KEYS: SkillKey[] = ['Q', 'W', 'E', 'R']
const LEVELS = Array.from({ length: 18 }, (_, index) => index + 1)

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
  const { levels } = skillOrder

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

      <p className="mt-3 text-sm text-grey-100">{skillOrder.reason}</p>

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
                    return (
                      <td
                        key={level}
                        title={chosen === skill ? `Nível ${level}: ${skill} ` : undefined}
                        className={`h-10 w-7 border font-display text-xs ${
                          chosen === skill
                            ? skill === 'R'
                              ? 'border-hextech bg-hextech-dark/60 text-gold-100'
                              : 'border-gold-300 bg-gold-400/60 text-gold-100'
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

      <p className="mt-3 text-xs text-grey-100">
        A prioridade foi sugerida pela IA a partir das habilidades do campeão, e a sequência segue
        as regras do jogo (ultimate nos níveis 6, 11 e 16).
        {levels.length < LEVELS.length &&
          ' Este campeão tem regras próprias de pontos de habilidade, então só a prioridade é mostrada.'}
      </p>
    </Panel>
  )
}
