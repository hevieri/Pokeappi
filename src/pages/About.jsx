import styles from './About.module.css'

export default function About() {
  return (
    <section className="flex flex-col items-center min-h-[calc(100vh-8rem)]">
      <header className="mb-12 sm:mb-16 text-center">
        <div className="mb-2">
          <h1
            className="font-display text-[2.8rem] sm:text-[3.8rem] lg:text-[4.8rem] leading-none tracking-[0.06em] text-pk-yellow"
            style={{
              textShadow: '0 0 0 #2a6bb6, 2px 2px 0 #2a6bb6, 4px 4px 0 #2a6bb6, 6px 6px 0 #1a4a8a, 8px 8px 0 #1a4a8a, 10px 10px 0 #0f3460, 0 0 30px rgba(42,107,182,0.4)',
            }}
          >
            ACERCA DE
          </h1>
        </div>
        <p className="text-xs uppercase tracking-[0.35em] text-pokeball-red font-semibold">PokeiApi</p>
        <p className="mx-auto mt-4 max-w-lg text-sm text-slate-500 leading-relaxed">
          Conoce más sobre esta aplicación y las tecnologías utilizadas.
        </p>
      </header>

      <div className={styles.card}>
        <p className={styles.text}>
          PokeiApi es una aplicación web para explorar datos de Pokémon usando la
          PokéAPI. Busca Pokémon por nombre o número, consulta sus estadísticas,
          tipos, habilidades y movimientos.
        </p>

        <div className={styles.divider} />

        <div className={styles.section}>
          <h2 className={styles.heading}>Autor</h2>
          <p className={styles.text}>
            Esta aplicación fue desarrollada por <strong className={styles.highlight}>hevieri</strong> como
            proyecto de práctica para explorar y demostrar el uso de diversas
            tecnologías modernas de desarrollo web, combinadas con inteligencia
            artificial como herramienta de apoyo para la generación de código,
            diseño dinámico y resolución de problemas.
          </p>
          <p className={styles.text}>
            El objetivo es crear una experiencia interactiva, visualmente atractiva
            y funcional, que sirva como muestra de habilidades técnicas para el
            repositorio de GitHub y el portafolio personal del autor.
          </p>
        </div>

        <div className={styles.divider} />

        <div className={styles.section}>
          <h2 className={styles.heading}>Tecnologías</h2>
          <ul className={styles.list}>
            <li>React</li>
            <li>Vite</li>
            <li>Tailwind CSS</li>
            <li>CSS Modules</li>
            <li>PokéAPI</li>
            <li>LocalStorage API</li>
          </ul>
        </div>

        <div className={styles.divider} />

        <p className={styles.footer}>
          Pokémon es propiedad de Nintendo, Game Freak y The Pokémon Company.
        </p>
      </div>
    </section>
  )
}
