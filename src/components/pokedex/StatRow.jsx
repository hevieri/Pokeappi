import { maxStat } from './pokedexData'
import styles from './StatRow.module.css'

export default function StatRow({ label, value }) {
  const width = Math.min(100, Math.round((value / maxStat) * 100))

  return (
    <div className={styles.statRow}>
      <span className={styles.statName}>{label}</span>
      <span className={styles.barTrack}>
        <span className={styles.barFill} style={{ '--stat-width': `${width}%` }} />
      </span>
      <span className={styles.statValue}>{value}</span>
    </div>
  )
}
