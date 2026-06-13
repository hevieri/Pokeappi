import styles from './DisplayFrame.module.css'

export default function DisplayFrame({ pokemon, status }) {
  return (
    <section className={styles.displayFrame}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <p className={styles.subtitle}>Pokédex</p>
          <h2 className={styles.title}>{pokemon.name}</h2>
        </div>
        <span className={styles.status}>{status}</span>
      </div>

      <div className={styles.body}>
        <div className={styles.spriteBox}>
          {pokemon.sprite ? (
            <img src={pokemon.sprite} alt={pokemon.name} className={styles.sprite} />
          ) : (
            <div className={styles.spriteBox}>Sin imagen</div>
          )}
        </div>

        <div className={styles.details}>
          <div className={styles.gridTwo}>
            <div className={styles.detailCard}>
              <p className={styles.detailTitle}>ID</p>
              <p className={styles.detailValue}>#{String(pokemon.id).padStart(3, '0')}</p>
            </div>
            <div className={styles.detailCard}>
              <p className={styles.detailTitle}>Tipo</p>
              <div className={styles.chipList}>
                {pokemon.types.map((type) => (
                  <span key={type} className={styles.chip}>
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.gridTwo}>
            <div className={styles.detailCard}>
              <p className={styles.detailTitle}>Altura</p>
              <p className={styles.detailValue}>{pokemon.height}</p>
            </div>
            <div className={styles.detailCard}>
              <p className={styles.detailTitle}>Peso</p>
              <p className={styles.detailValue}>{pokemon.weight}</p>
            </div>
          </div>

          <div className={styles.abilityCard}>
            <p className={styles.detailTitle}>Habilidad</p>
            <p className={styles.detailValue}>{pokemon.ability}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
