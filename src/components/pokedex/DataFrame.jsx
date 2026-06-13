import StatRow from './StatRow'
import styles from './DataFrame.module.css'

const visibleStats = ['HP', 'ATK', 'DEF']

export default function DataFrame({ pokemon, query, onQueryChange, onPrev, onNext, onScan, isLoading, error }) {
  return (
    <section className={styles.dataFrame}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <p className={styles.subtitle}>Controles</p>
          <h3 className={styles.title}>Datos</h3>
        </div>
        <div className={styles.buttonRow}>
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
          <StatRow key={name} label={name} value={pokemon.stats?.[name] ?? 0} />
        ))}
      </div>

      <form className={styles.searchForm} onSubmit={onScan}>
        <label className={styles.searchInput}>
          <span className="sr-only">Buscar Pokémon</span>
          <input
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            type="search"
            placeholder="Nombre o ID"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
          />
        </label>
        <button type="submit" className={styles.searchButton}>
          {isLoading ? 'Cargando...' : 'Scan'}
        </button>
      </form>

      {error ? <p className={styles.error}>{error}</p> : null}
  )
}
