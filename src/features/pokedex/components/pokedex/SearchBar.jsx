/**
 * SearchBar
 *
 * Componente de formulario para buscar Pokémon por nombre o ID.
 * Renderiza un input de búsqueda y un botón "Scan" con diseño de
 * Pokébola. Mientras carga, la Pokébola gira.
 * El submit se maneja desde el padre mediante la prop onScan.
 *
 * Props:
 *   - query {string}: Valor actual del input (controlado por el padre).
 *   - onQueryChange {function}: Callback que se dispara al escribir.
 *   - onScan {function}: Callback que se dispara al enviar el formulario.
 *   - isLoading {boolean}: Indica si hay una búsqueda en curso.
 */

import styles from './SearchBar.module.css'

export default function SearchBar({ query, onQueryChange, onScan, isLoading }) {
  const hasQuery = query.trim().length > 0
  const btnClass = [styles.scanButton, isLoading && styles.spinning, !hasQuery && styles.scanDisabled].filter(Boolean).join(' ')

  return (
    <form className={styles.searchForm} onSubmit={(e) => {
      if (!hasQuery) e.preventDefault()
      else onScan(e)
    }}>
      <label className={styles.searchBox}>
        <span className="sr-only">Buscar Pokémon</span>
        <input
          className={styles.input}
          type="search"
          placeholder="Nombre o ID"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </label>
      <button
        type="submit"
        className={btnClass}
        disabled={isLoading || !hasQuery}
      >
        Scan
      </button>
    </form>
  )
}
