/**
 * DisplayFrame
 *
 * Componente principal que representa la tarjeta izquierda del Pokedex.
 * Muestra la información visual del Pokémon: nombre, sprite oficial,
 * datos básicos (ID, tipo, altura, peso, habilidad) y un pie con los
 * nombres de los tipos coloreados. Delega el sprite y los detalles
 * a los sub-componentes SpriteSection y PokemonInfo respectivamente.
 *
 * Props:
 *   - pokemon {object|null}: Datos del Pokémon activo, o null mientras
 *       carga o si no se encontró.
 *   - status {string}: Texto corto ("Cargando" | "Listo") que aparece
 *       como indicador al lado del título.
 */

import styles from './DisplayFrame.module.css'
import SpriteSection from './SpriteSection'
import PokemonInfo from './PokemonInfo'
import { getTypeConfig } from './typeConfig'
import useCared from '../../../care/hooks/useCared'

export default function DisplayFrame({ pokemon, status, onGoCare, catchesLength }) {
  const { careDisabled, useCare } = useCared(catchesLength)

  if (!pokemon) {
    return (
      <section className={styles.displayFrame}>
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="grid gap-1">
            <p className={styles.subtitle}>Pokédex</p>
            <h2 className={styles.title}>Cargando Pokémon...</h2>
          </div>
          <span className={styles.status}>{status}</span>
        </div>
        <div className={styles.body}>
          <SpriteSection pokemon={null} isLoading={true} />
        </div>
      </section>
    )
  }

  return (
      <section className={styles.displayFrame}>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="grid gap-1">
          <p className={styles.subtitle}>Pokédex</p>
          <h2 className={styles.title}>{pokemon.name}</h2>
        </div>
        <span className={styles.status}>{status}</span>
      </div>

      <div className={styles.body}>
        <SpriteSection pokemon={pokemon} isLoading={false} />
        <PokemonInfo pokemon={pokemon} />
      </div>

      <div className={styles.footer}>
        {pokemon.types.map((type, i) => {
          const config = getTypeConfig(type)
          return (
            <span key={type} className={styles.typeWord} style={{ '--type-glow': config.color }}>
              {i > 0 && <span className={styles.typeSep}> / </span>}
              {type}
            </span>
          )
        })}
      </div>

      <button
        className={`${styles.caredBtn} ${careDisabled ? styles.caredBtnDisabled : ''}`}
        disabled={careDisabled}
        onClick={() => { useCare(); onGoCare(pokemon.id) }}
      >
        {careDisabled ? '⏳ Agotado' : '🤝 Cuidar Pokémon'}
      </button>
    </section>
  )
}
