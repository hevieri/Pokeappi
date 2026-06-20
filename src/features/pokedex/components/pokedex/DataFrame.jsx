/**
 * DataFrame
 *
 * Componente que representa la tarjeta derecha del Pokedex. Contiene:
 *   - Encabezado con botones Prev / Next para navegar entre Pokémon
 *   - Lista de estadísticas base (HP, ATK, DEF) con barras de colores
 *   - Panel de tipo y movimientos (MovesPanel)
 *   - Barra de búsqueda por nombre o ID (SearchBar)
 *   - Mensaje de error opcional si la búsqueda falla
 *
 * Props:
 *   - pokemon {object|null}: Datos del Pokémon activo.
 *   - query {string}: Texto actual de la búsqueda.
 *   - onQueryChange {function}: Callback al escribir en el input.
 *   - onPrev {function}: Callback para navegar al Pokémon anterior.
 *   - onNext {function}: Callback para navegar al siguiente Pokémon.
 *   - onScan {function}: Callback al enviar el formulario de búsqueda.
 *   - error {string}: Mensaje de error a mostrar (vacio si no hay error).
 */

import SearchBar from './SearchBar'
import StatRow from './StatRow'
import MovesPanel from './MovesPanel'
import styles from './DataFrame.module.css'

const visibleStats = ['HP', 'ATK', 'DEF']

export default function DataFrame({ pokemon, query, onQueryChange, onPrev, onNext, onScan, isLoading, error }) {
  const stats = pokemon?.stats
  const primaryType = pokemon?.types?.[0] ?? 'Normal'

  return (
    <section className={styles.dataFrame}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="grid gap-[0.15rem]">
          <p className={styles.subtitle}>Controles</p>
          <h3 className={styles.title}>Datos</h3>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={onPrev} className={styles.controlButton}>
            Prev
          </button>
          <button type="button" onClick={onNext} className={styles.controlButton}>
            Next
          </button>
        </div>
      </div>

      <div className={styles.statList}>
        {visibleStats.map((name) => (
          <StatRow key={name} label={name} value={stats?.[name] ?? 0} />
        ))}
      </div>

      <MovesPanel moves={pokemon?.moves ?? []} type={primaryType} />

      <SearchBar query={query} onQueryChange={onQueryChange} onScan={onScan} isLoading={isLoading} />

      {error ? <p className={styles.error}>{error}</p> : null}
    </section>
  )
}
