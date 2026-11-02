import axios from 'axios'
import type { ApiError } from '../types/api'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3333',
  // A recomendação consulta a IA (com uma nova tentativa), então pode demorar.
  timeout: 90_000,
})

function isApiError(data: unknown): data is ApiError {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof (data as ApiError).message === 'string'
  )
}

export function getErrorMessage(error: unknown): string {
  if (axios.isCancel(error)) return 'Requisição cancelada.'
  if (axios.isAxiosError(error)) {
    if (isApiError(error.response?.data)) return error.response.data.message
    if (error.code === 'ECONNABORTED') {
      return 'A análise demorou demais para responder. Tente novamente.'
    }
    if (!error.response) {
      return 'Não foi possível conectar à API. Verifique se o servidor está rodando.'
    }
  }
  return 'Ocorreu um erro inesperado. Tente novamente.'
}
