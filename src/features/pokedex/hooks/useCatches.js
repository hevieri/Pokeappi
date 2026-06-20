import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'pokeappi_catches'

export default function useCatches() {
  const [catches, setCatches] = useState([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      if (Array.isArray(stored)) setCatches(stored)
    } catch {}
    setReady(true)
  }, [])

  const catchPokemon = useCallback((id) => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    if (Array.isArray(stored) && !stored.includes(id)) {
      const next = [...stored, id].sort((a, b) => a - b)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    }
    setCatches(prev => {
      if (prev.includes(id)) return prev
      return [...prev, id].sort((a, b) => a - b)
    })
  }, [])

  const isCaught = useCallback((id) => catches.includes(id), [catches])

  return { catches, catchPokemon, isCaught, ready }
}
