/**
 * MovesPanel
 *
 * Componente que muestra el tipo primario del Pokémon y sus movimientos
 * asociados. Presenta el icono del tipo (obtenido de PokeAPI) en grande,
 * el nombre del tipo coloreado debajo, una línea divisoria sutil y la
 * lista de movimientos en línea separados por punto. Todo el contenido
 * está centrado vertical y horizontalmente.
 *
 * Props:
 *   - moves {string[]}: Lista de nombres de movimientos a mostrar.
 *   - type {string}: Nombre del tipo primario del Pokémon.
 */

import styles from './MovesPanel.module.css'
import { getTypeConfig } from './typeConfig'

export default function MovesPanel({ moves, type }) {
  const config = getTypeConfig(type)

  return (
    <section className={styles.movesSection}>
      <img src={config.icon} alt="" className={styles.typeIconBig} />
      <span className={styles.typeName} style={{ color: config.color }}>{type}</span>
      <div className={styles.movesDivider} />
      <div className={styles.movesRow}>
        {moves.map((move) => (
          <span key={move} className={styles.moveItem}>
            {move}
          </span>
        ))}
      </div>
    </section>
  )
}
