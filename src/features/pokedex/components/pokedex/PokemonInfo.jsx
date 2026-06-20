/**
 * PokemonInfo
 *
 * Componente que despliega los datos básicos del Pokémon en una grilla
 * de dos columnas. Muestra:
 *   - ID (formateado con # y cero a la izquierda)
 *   - Tipo(s) del Pokémon representados con iconos oficiales de PokeAPI
 *   - Altura en metros
 *   - Peso en kilogramos
 *   - Habilidad principal con un emoji representativo
 *
 * Props:
 *   - pokemon {object}: Datos del Pokémon activo.
 *       Se espera que tenga { id, types, height, weight, ability }.
 */

import styles from './PokemonInfo.module.css'
import { getTypeConfig, getAbilityIcon } from './typeConfig'

export default function PokemonInfo({ pokemon }) {
  return (
    <div className={styles.details}>
      <div className={styles.gridTwo}>
        <div>
          <p className={styles.detailTitle}>ID</p>
          <p className={styles.detailValue}>#{String(pokemon.id).padStart(3, '0')}</p>
        </div>
        <div className={styles.chipList}>
          {pokemon.types.map((type) => {
            const config = getTypeConfig(type)
            return (
              <img key={type} src={config.icon} alt="" className={styles.chipIcon} />
            )
          })}
        </div>
      </div>

      <div className={styles.gridTwo}>
        <div>
          <p className={styles.detailTitle}>Altura</p>
          <p className={styles.detailValue}>{pokemon.height}</p>
        </div>
        <div>
          <p className={styles.detailTitle}>Peso</p>
          <p className={styles.detailValue}>{pokemon.weight}</p>
        </div>
      </div>

      <div>
        <p className={styles.detailTitle}>Habilidad</p>
        <p className={styles.detailValue}>
          <span className={styles.abilityIcon}>{getAbilityIcon(pokemon.ability)}</span>
          {' '}{pokemon.ability}
        </p>
      </div>
    </div>
  )
}
