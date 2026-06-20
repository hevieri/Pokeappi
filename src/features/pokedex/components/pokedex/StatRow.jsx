/**
 * StatRow
 *
 * Componente que representa una fila de estadística individual.
 * Muestra la etiqueta (HP, ATK, DEF), una barra de progreso
 * proporcional al valor máximo posible (maxStat = 120) y el
 * valor numérico. El color de la barra varía según la estadística
 * usando clases CSS modulares.
 *
 * Props:
 *   - label {string}: Nombre de la estadística (HP, ATK, DEF).
 *   - value {number}: Valor numérico de la estadística.
 */

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
    <div className="flex items-center gap-4">
      <span className={styles.statName}>{label}</span>
      <span className={styles.barTrack}>
        <span className={`${styles.barFill} ${barClass}`} style={{ '--stat-width': `${width}%` }} />
      </span>
      <span className={styles.statValue}>{value}</span>
    </div>
  )
}
