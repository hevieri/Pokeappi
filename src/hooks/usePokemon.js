import { useEffect, useState } from 'react'
import { clampPokemonId, loadFromPokeApi } from '../components/pokedex/pokedexData.js'

export default function usePokemon(initialId = 1) {
  const [activeId, setActiveId] = useState(initialId)
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
      } catch (err) {
        setPokemon(null)
        setError('No se pudo cargar el Pokémon.')
      } finally {
        setIsLoading(false)
      }
    }

    loadCurrentPokemon()
  }, [activeId])

  const handlePrev = () => {
    setActiveId((prevId) => clampPokemonId(prevId - 1))
    setQuery('')
  }

  const handleNext = () => {
    setActiveId((prevId) => clampPokemonId(prevId + 1))
    setQuery('')
  }

  const handleScan = async (event) => {
    event.preventDefault()
    const cleanQuery = query.trim()
    if (!cleanQuery) {
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const remotePokemon = await loadFromPokeApi(cleanQuery)
      setPokemon(remotePokemon)
      setActiveId(remotePokemon.id)
    } catch (err) {
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
