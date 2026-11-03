// Espelha os contratos da API (api-lol-build-assistant).
import type { Lane } from '../constants/lanes'

export type Champion = {
  id: string
  name: string
  icon: string
}

// GET /champions
export type ChampionsResponse = {
  version: string
  champions: Champion[]
}

export type LanedChampion = Champion & { lane: Lane }

// POST /builds/recommendations
export type MatchupInput = {
  championId: string
  lane: Lane
  enemies: { championId: string; lane: Lane }[]
}

// Item com quantidade (ex.: Lâmina de Doran e 2 poções, 2 Espadas Longas).
export type ItemStack = {
  id: string
  name: string
  icon: string
  count: number
}

export type BuildItem = {
  order: number
  id: string
  name: string
  icon: string
  gold: number
  reason: string
  // Componentes da receita a comprar antes de fechar o item, do mais barato ao mais caro.
  components: (ItemStack & { gold: number })[]
}

export type RuneTreeRef = {
  id: string
  name: string
  icon: string
}

export type RuneRef = RuneTreeRef & { description: string }

export type RunePage = {
  primary: { tree: RuneTreeRef; keystone: RuneRef; runes: RuneRef[] }
  secondary: { tree: RuneTreeRef; runes: RuneRef[] }
  reason: string
}

export type SkillKey = 'Q' | 'W' | 'E' | 'R'

export type SkillOrder = {
  // Habilidade de cada nível, do 1 ao 18. Fica vazia em campeões com regras próprias de
  // pontos (ex.: Udyr), em que só a prioridade é mostrada.
  levels: SkillKey[]
  // Ordem para maximizar as habilidades básicas (ex.: Q > E > W).
  priority: SkillKey[]
  spells: { key: SkillKey; name: string; icon: string }[]
  reason: string
}

export type BuildRecommendation = {
  champion: LanedChampion
  enemies: LanedChampion[]
  build: BuildItem[]
  // Compra inicial recomendada (Doran, poções, companheiro da selva...), com a quantidade.
  starterItems: ItemStack[]
  starterReason: string
  purchaseOrder: string[]
  skillOrder: SkillOrder
  runes: RunePage
  totalGold: number
  threats: { champion: Champion; reason: string }[]
  justification: string
  balance: string
  warnings: string[]
  dataVersion: string
}

// Formato de erro do error handler da API.
export type ApiError = {
  code: string
  message: string
}
