// Espelha os contratos da API (api-lol-build-assistant).

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

// POST /builds/recommendations
export type MatchupInput = {
  championId: string
  enemyChampionIds: string[]
}

export type BuildItem = {
  order: number
  id: string
  name: string
  icon: string
  gold: number
  reason: string
}

export type BuildRecommendation = {
  champion: Champion
  enemies: Champion[]
  build: BuildItem[]
  purchaseOrder: string[]
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
