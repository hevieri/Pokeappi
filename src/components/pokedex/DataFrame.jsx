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
          <StatRow key={name} label={name} value={stats?.[name] ?? 0} />
        ))}
      </div>

      <MovesPanel moves={pokemon?.moves ?? []} type={primaryType} />

      <SearchBar query={query} onQueryChange={onQueryChange} onScan={onScan} isLoading={isLoading} />

      {error ? <p className={styles.error}>{error}</p> : null}
    </section>
  )
}
