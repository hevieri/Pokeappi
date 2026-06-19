import { maxStat } from './pokedexData'
import styles from './StatRow.module.css'

const barColors = {
  HP: styles.barHp,
  ATK: styles.barAtk,
  DEF: styles.barDef,
}

export default function StatRow({ label, value }) {
  const width = Math.min(100, Math.round((value / maxStat) * 100))
  const barClass = barColors[label] || styles.barFill

  return (
    <div className={styles.statRow}>
      <span className={styles.statName}>{label}</span>
      <span className={styles.barTrack}>
        <span className={`${styles.barFill} ${barClass}`} style={{ '--stat-width': `${width}%` }} />
      </span>
      <span className={styles.statValue}>{value}</span>
    </div>
  )
}
