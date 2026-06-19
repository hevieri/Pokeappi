import DisplayFrame from './DisplayFrame'
import DataFrame from './DataFrame'
import usePokemon from '../../hooks/usePokemon.js'
import styles from './Pokedex.module.css'

export default function Pokedex() {
  const { pokemon, query, setQuery, isLoading, error, handlePrev, handleNext, handleScan } = usePokemon()

  return (
    <div className={styles.wrapper}>
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
    </div>
  )
}
