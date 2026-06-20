/**
 * Home
 *
 * Página de bienvenida de la aplicación. Muestra un mensaje de
 * introducción y un botón llamativo que lleva a la sección de
 * estadísticas (Pokedex). La navegación se maneja mediante la
 * prop onGoStats que cambia el estado en App.
 *
 * Props:
 *   - onGoStats {function}: Callback para cambiar a la página Stats.
 */

import NavButton from '../shared/components/NavButton.jsx'

export default function Home({ onGoStats }) {
  return (
    <section className="flex flex-col items-center gap-10 pt-32 sm:pt-36 min-h-[calc(100vh-8rem)]">
      <div className="text-center max-w-md">
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
        <p className="text-xs uppercase tracking-[0.35em] text-pokeball-red font-semibold">Bienvenido</p>
        <p className="mt-4 text-sm text-slate-500 leading-relaxed">
          Explora datos de Pokémon, busca por nombre o ID y consulta las estadísticas reales de la PokéAPI.
        </p>
      </div>

      <NavButton onClick={onGoStats}>
        Entrar
      </NavButton>
    </section>
  )
}
