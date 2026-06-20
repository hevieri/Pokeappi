import { useState, useEffect, useCallback } from 'react'
import useCatches from './hooks/useCatches.js'
import PokemonModal from '../../shared/components/PokemonModal.jsx'
import styles from './PokedexPage.module.css'

const SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork'

const GENERATIONS = [
  { name: 'I · Kanto', start: 1, end: 151 },
  { name: 'II · Johto', start: 152, end: 251 },
  { name: 'III · Hoenn', start: 252, end: 386 },
  { name: 'IV · Sinnoh', start: 387, end: 493 },
  { name: 'V · Unova', start: 494, end: 649 },
  { name: 'VI · Kalos', start: 650, end: 721 },
  { name: 'VII · Alola', start: 722, end: 809 },
  { name: 'VIII · Galar', start: 810, end: 905 },
  { name: 'IX · Paldea', start: 906, end: 1025 },
]

export default function PokedexPage({ onGoStats }) {
  const [list, setList] = useState([])
  const [totalSpecies, setTotalSpecies] = useState(0)
  const [openGen, setOpenGen] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const { catches } = useCatches()

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon-species?limit=100000')
      .then(r => r.json())
      .then(data => {
        const species = data.results.map(p => {
          const id = parseInt(p.url.split('/').filter(Boolean).pop(), 10)
          return {
            name: p.name,
            id,
            sprite: `${SPRITE_BASE}/${id}.png`,
          }
        })
        setList(species)
        setTotalSpecies(data.count)
      })
  }, [])

  const toggleGen = useCallback((idx) => {
    setOpenGen(prev => prev === idx ? null : idx)
  }, [])

  const gens = GENERATIONS.map((gen, idx) => {
    const pokemon = list.filter(p => p.id >= gen.start && p.id <= gen.end)
    const caughtHere = pokemon.filter(p => catches.includes(p.id))
    return { ...gen, idx, pokemon, caughtHere }
  })

  return (
    <section className="flex flex-col items-center min-h-[calc(100vh-8rem)]">
      <header className="mb-12 sm:mb-16 text-center">
        <div className="mb-2">
          <h1
            className="font-display text-[2.8rem] sm:text-[3.8rem] lg:text-[4.8rem] leading-none tracking-[0.06em] text-pk-yellow"
            style={{
              textShadow: '0 0 0 #2a6bb6, 2px 2px 0 #2a6bb6, 4px 4px 0 #2a6bb6, 6px 6px 0 #1a4a8a, 8px 8px 0 #1a4a8a, 10px 10px 0 #0f3460, 0 0 30px rgba(42,107,182,0.4)',
            }}
          >
            POKÉDEX
          </h1>
        </div>
        <p className="text-xs uppercase tracking-[0.35em] text-pokeball-red font-semibold">
          {catches.length} / {totalSpecies} atrapados
        </p>
        <p className="mx-auto mt-4 max-w-lg text-sm text-slate-500 leading-relaxed">
          Explora los Pokémon y completa tu colección.
        </p>
      </header>

      {list.length === 0 ? (
        <p className="text-center text-sm text-slate-400">Cargando...</p>
      ) : (
        <div className={styles.accordion}>
          {gens.map(({ idx, name, pokemon, caughtHere }) => (
            <div key={idx} className={styles.genBox}>
              <button
                className={`${styles.genHeader} ${openGen === idx ? styles.genOpen : ''}`}
                onClick={() => toggleGen(idx)}
              >
                <span className={styles.genName}>{name}</span>
                <span className={styles.genCount}>
                  {caughtHere.length}/{pokemon.length}
                </span>
                <span className={styles.genArrow}>{openGen === idx ? '▲' : '▼'}</span>
              </button>

              <div className={`${styles.genContent} ${openGen === idx ? styles.genContentOpen : ''}`}>
                {openGen === idx && (
                  <div className={styles.grid}>
                    {pokemon.map(p => {
                      const caught = catches.includes(p.id)
                      return (
                        <div key={p.id} className={`${styles.card} ${caught ? styles.caught : ''}`} onClick={() => setSelectedId(p.id)}>
                          <div className={styles.spriteBox}>
                            <img
                              src={p.sprite}
                              alt={p.name}
                              className={`${styles.sprite} ${caught ? '' : styles.unsprite}`}
                              loading="lazy"
                            />
                          </div>
                          <span className={styles.id}>#{String(p.id).padStart(3, '0')}</span>
                          <span className={styles.name}>{p.name}</span>
                          {caught && <span className={styles.badge}>✓</span>}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedId && (
        <PokemonModal pokemonId={selectedId} onClose={() => setSelectedId(null)} onGoStats={onGoStats} />
      )}
    </section>
  )
}
