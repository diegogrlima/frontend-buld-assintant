import type { BuildRecommendation, MatchupInput } from '../types/api'
import { api } from './api'

export async function requestRecommendation(input: MatchupInput) {
  const { data } = await api.post<BuildRecommendation>(
    '/builds/recommendations',
    input,
  )
  return data
}
