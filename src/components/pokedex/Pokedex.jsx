import { useEffect, useState } from 'react'
import DisplayFrame from './DisplayFrame'
import DataFrame from './DataFrame'
import { clampPokemonId, loadFromPokeApi } from './pokedexData'
import styles from './Pokedex.module.css'

const defaultPokemon = {
  id: 1,
  name: 'Cargando',
  types: ['Normal'],
  height: '0.0 m',
  weight: '0.0 kg',
  ability: 'Unknown',
  sprite: '',
  stats: { HP: 0, ATK: 0, DEF: 0 },
}

export default function Pokedex() {
  const [activeId, setActiveId] = useState(1)
  const [pokemon, setPokemon] = useState(defaultPokemon)
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

  return (
    <div className={styles.pokedex}>
      <DisplayFrame pokemon={pokemon} status={isLoading ? 'Cargando' : 'Listo'} />
      <DataFrame
        pokemon={pokemon}
        query={query}
        onQueryChange={setQuery}
        onPrev={handlePrev}
        onNext={handleNext}
        onScan={handleScan}
        isLoading={isLoading}
        error={error}
      />
    </div>
  )
}
