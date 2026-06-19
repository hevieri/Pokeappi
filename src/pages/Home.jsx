export default function Home({ onGoStats }) {
  return (
    <section className="flex flex-col items-center gap-10 pt-6 sm:pt-10">
      <div className="text-center max-w-md">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Bienvenido
        </h2>
        <p className="mt-4 text-sm text-slate-500 leading-relaxed">
          Explora datos de Pokémon, busca por nombre o ID y consulta las estadísticas reales de la PokéAPI.
        </p>
      </div>

      <button
        type="button"
        onClick={onGoStats}
        className="rounded-full bg-pokeball-red px-8 py-3.5 text-sm font-bold text-white tracking-wider uppercase transition hover:bg-red-600 hover:scale-105 active:scale-100"
      >
        Ir a estadísticas
      </button>
    </section>
  )
}
