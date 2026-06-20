/**
 * Stats
 *
 * Página contenedor para el componente Pokedex. Muestra el encabezado
 * global de la aplicación (Pokédex / PokeiApi) y el Pokedex con los
 * datos y estadísticas del Pokémon.
 */

import Pokedex from '../features/pokedex/components/pokedex/Pokedex.jsx'

export default function Stats({ initialPokemonId, onGoCare }) {
  return (
    <section className="min-h-[calc(100vh-8rem)]">
      <header className="mb-12 sm:mb-16 text-center">
        <div className="mb-2">
          <h1
            className="font-display text-[2.8rem] sm:text-[3.8rem] lg:text-[4.8rem] leading-none tracking-[0.06em] text-pk-yellow"
            style={{
              textShadow: '0 0 0 #2a6bb6, 2px 2px 0 #2a6bb6, 4px 4px 0 #2a6bb6, 6px 6px 0 #1a4a8a, 8px 8px 0 #1a4a8a, 10px 10px 0 #0f3460, 0 0 30px rgba(42,107,182,0.4)',
            }}
          >
            POKÉAPPI
          </h1>
        </div>
        <p className="text-xs uppercase tracking-[0.35em] text-pokeball-red font-semibold">Pokédex</p>
        <p className="mx-auto mt-4 max-w-lg text-sm text-slate-500 leading-relaxed">
          Explora datos de Pokémon y consulta sus estadísticas con datos reales de PokéAPI.
        </p>
      </header>
      <Pokedex initialPokemonId={initialPokemonId} onGoCare={onGoCare} />
    </section>
  )
}
