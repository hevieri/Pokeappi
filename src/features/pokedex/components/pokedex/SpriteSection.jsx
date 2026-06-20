/**
 * SpriteSection
 *
 * Componente encargado de mostrar el sprite oficial del Pokémon dentro de un
 * recuadro con fondo. Si el Pokémon no tiene sprite disponible (respuesta
 * incompleta de la API), muestra un mensaje de texto "Sin imagen" como fallback.
 *
 * Props:
 *   - pokemon {object|null}: Datos del Pokémon activo, o null mientras carga.
 *       Se espera que tenga la forma { name, sprite, ... }.
 *   - isLoading {boolean}: Indica si los datos se están cargando desde la API.
 *       Cuando es true, se muestra "Cargando..." en lugar del sprite.
 */

import styles from './SpriteSection.module.css'

export default function SpriteSection({ pokemon, isLoading }) {
  if (isLoading || !pokemon) {
    return (
      <div className={styles.spriteBox}>
        <span>Cargando...</span>
      </div>
    )
  }

  return (
    <div className={styles.spriteBox}>
      {pokemon.sprite ? (
        <img src={pokemon.sprite} alt={pokemon.name} className={styles.sprite} />
      ) : (
        <span>Sin imagen</span>
      )}
    </div>
  )
}
