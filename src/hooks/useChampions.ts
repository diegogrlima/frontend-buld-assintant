import { useCallback, useEffect, useState } from 'react'
import { fetchChampions } from '../services/champions'
import { getErrorMessage } from '../services/api'
import type { ChampionsResponse } from '../types/api'

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: ChampionsResponse }

export function useChampions() {
  const [state, setState] = useState<State>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    fetchChampions(controller.signal)
      .then((data) => setState({ status: 'success', data }))
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setState({ status: 'error', message: getErrorMessage(error) })
        }
      })
    return () => controller.abort()
  }, [attempt])

  const retry = useCallback(() => {
    setState({ status: 'loading' })
    setAttempt((value) => value + 1)
  }, [])

  return { ...state, retry }
}
