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
  dataVersion: string
}

// Formato de erro do error handler da API.
export type ApiError = {
  code: string
  message: string
}
