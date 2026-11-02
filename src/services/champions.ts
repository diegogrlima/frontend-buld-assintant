import type { ChampionsResponse } from '../types/api'
import { api } from './api'

export async function fetchChampions(signal?: AbortSignal) {
  const { data } = await api.get<ChampionsResponse>('/champions', { signal })
  return data
}
