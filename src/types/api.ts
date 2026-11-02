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
}

export type BuildRecommendation = {
  champion: LanedChampion
  enemies: LanedChampion[]
  build: BuildItem[]
  purchaseOrder: string[]
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
