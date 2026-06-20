/**
 * Pokedex
 *
 * Componente raíz de la sección Pokedex. Orquesta la comunicación entre
 * el hook usePokemon (gestión de estado y llamadas a la API) y los dos
 * paneles principales: DisplayFrame (tarjeta visual del Pokémon) y
 * DataFrame (tarjeta de datos y controles). Se encarga de pasar todas
 * las props necesarias a sus hijos y renderiza el layout responsive
 * de dos columnas.
 *
 * No recibe props externas: usa usePokemon para manejar todo el estado
 * interno (Pokémon activo, búsqueda, carga, errores).
 */

import DisplayFrame from './DisplayFrame'
import DataFrame from './DataFrame'
import usePokemon from '../../hooks/usePokemon.js'
import useCatches from '../../hooks/useCatches.js'
import styles from './Pokedex.module.css'

export default function Pokedex({ initialPokemonId, onGoCare }) {
  const { catches } = useCatches()
  const validIds = catches.length > 0 ? catches : null
  const { pokemon, query, setQuery, isLoading, error, handlePrev, handleNext, handleScan } = usePokemon(initialPokemonId, validIds)

  return (
    <div className={styles.wrapper}>
      <div className={styles.pokedex}>
        <DisplayFrame pokemon={pokemon} status={isLoading ? 'Cargando' : 'Listo'} onGoCare={onGoCare} catchesLength={catches.length} />
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
