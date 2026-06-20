import { useEffect, useState, useCallback } from 'react'
import { loadFromPokeApi } from '../components/pokedex/pokedexData.js'

export default function usePokemon(initialId = 1, validIds = null) {
  const startId = validIds && validIds.length > 0 && (!initialId || !validIds.includes(initialId))
    ? validIds[0]
    : (initialId ?? 1)
  const [activeId, setActiveId] = useState(startId)
  const [pokemon, setPokemon] = useState(null)
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadCurrentPokemon = async () => {
      setIsLoading(true)
      setError('')

      try {
        const remotePokemon = await loadFromPokeApi(activeId)
        setPokemon(remotePokemon)
      } catch {
        setPokemon(null)
        setError('No se pudo cargar el Pokémon.')
      } finally {
        setIsLoading(false)
      }
    }

    loadCurrentPokemon()
  }, [activeId])

  const navigate = useCallback((dir) => {
    setQuery('')
    if (!validIds || validIds.length === 0) {
      setActiveId(prev => Math.max(1, prev + dir))
      return
    }
    setActiveId(prev => {
      const idx = validIds.indexOf(prev)
      if (idx === -1) return validIds[0]
      const next = (idx + dir + validIds.length) % validIds.length
      return validIds[next]
    })
  }, [validIds])

  const handlePrev = useCallback(() => navigate(-1), [navigate])
  const handleNext = useCallback(() => navigate(1), [navigate])

  const handleScan = async (event) => {
    event.preventDefault()
    const cleanQuery = query.trim()
    if (!cleanQuery) return

    setIsLoading(true)
    setError('')

    try {
      const remotePokemon = await loadFromPokeApi(cleanQuery)
      setPokemon(remotePokemon)
      setActiveId(remotePokemon.id)
    } catch {
      setError('Pokémon no encontrado. Prueba con nombre o ID válido.')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    pokemon,
    query,
    setQuery,
    isLoading,
    error,
    handlePrev,
    handleNext,
    handleScan,
  }
}