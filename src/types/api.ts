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
  // Fração (0 a 1) das partidas de alto elo com o campeão na rota que terminaram com o item;
  // null quando não há dados de alto elo.
  highEloPickRate: number | null
  // Segundo mediano em que o alto elo completa o item desta posição da build (1º, 2º...);
  // null quando não há linha do tempo das partidas.
  highEloSecond: number | null
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

export type HighEloSample = {
  tiers: string[]
  patches: string[]
  matches: number
  // Fração (0 a 1) de vitórias nessas partidas.
  winRate: number
  // Quantas dessas partidas têm a linha do tempo usada no caminho da build.
  timelineMatches: number
}

export type SkillKey = 'Q' | 'W' | 'E' | 'R'

export type SkillOrder = {
  // "lane": partidas de alto elo do campeão na rota; "champion": em qualquer rota;
  // "ai": sem partidas, só a prioridade escolhida pela IA.
  source: 'lane' | 'champion' | 'ai'
  // Habilidade de cada nível, do 1 ao 18. Só termina antes em campeões com regras próprias de
  // pontos (ex.: Udyr), em que apenas os níveis das partidas são mostrados.
  levels: SkillKey[]
  // Quantos níveis iniciais vêm das partidas; os seguintes são sugeridos pela prioridade.
  observedLevels: number
  // Ordem para maximizar as habilidades básicas (ex.: Q > E > W).
  priority: SkillKey[]
  spells: { key: SkillKey; name: string; icon: string }[]
  matches: number
  // Justificativa da IA; null quando a ordem vem das partidas.
  reason: string | null
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
  // Partidas de Challenger e Grão-Mestre usadas como base; null quando não há dados.
  highElo: HighEloSample | null
  dataVersion: string
}

// Formato de erro do error handler da API.
export type ApiError = {
  code: string
  message: string
}
