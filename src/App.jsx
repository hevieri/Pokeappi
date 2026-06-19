import { useState } from 'react'
import Home from './pages/Home.jsx'
import Stats from './pages/Stats.jsx'

export default function App() {
  const [page, setPage] = useState('home')

  return (
    <main className="min-h-screen px-6 sm:px-8 lg:px-10 py-6 sm:py-8 lg:py-10">
        <header className="mb-12 sm:mb-16 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-pokeball-red">Pokédex</p>
          <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            Pokeappi
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-slate-500 leading-relaxed">
            Explora datos de Pokémon y consulta sus estadísticas con datos reales de PokéAPI.
          </p>
        </header>

        {page === 'home' ? (
          <Home onGoStats={() => setPage('stats')} />
        ) : (
          <div className="space-y-6">
            <Stats />
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setPage('home')}
                className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:border-pokeball-red/40 hover:bg-pokeball-red/5 hover:text-pokeball-red"
              >
                <span className="inline-block transition group-hover:-translate-x-0.5">{'\u2190'}</span>
                Volver al inicio
              </button>
            </div>
          </div>
        )}
    </main>
  )
}
