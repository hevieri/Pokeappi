import { useState, useEffect } from 'react'
import { getTypeConfig, getAbilityIcon } from '../../features/pokedex/components/pokedex/typeConfig'
import useFavorite from '../../features/pokedex/hooks/useFavorite'
import styles from './PokemonModal.module.css'

function formatGender(rate) {
  if (rate === -1) return { icon: '⚲', label: 'Sin género' }
  if (rate === 0) return { icon: '♂', label: '100% ♂' }
  if (rate === 8) return { icon: '♀', label: '100% ♀' }
  const female = Math.round((rate / 8) * 100)
  const male = 100 - female
  return { icon: '♂/♀', label: `${male}% ♂ / ${female}% ♀` }
}

function titleCase(v) {
  return v.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ')
}

export default function PokemonModal({ pokemonId, onClose, onGoStats }) {
  const [data, setData] = useState(null)
  const [species, setSpecies] = useState(null)
  const [error, setError] = useState(false)
  const { favorite, toggleFavorite } = useFavorite()

  useEffect(() => {
    if (!pokemonId) return
    setError(false)

    Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`),
    ]).then(async ([pokemonRes, speciesRes]) => {
      if (!pokemonRes.ok || !speciesRes.ok) throw new Error('Not found')
      const [pokemon, speciesData] = await Promise.all([pokemonRes.json(), speciesRes.json()])
      const officialArt = pokemon.sprites?.other?.['official-artwork']?.front_default
      const sprite = officialArt || pokemon.sprites?.front_default || ''
      const ability = titleCase(pokemon.abilities[0]?.ability?.name || 'Unknown')

      const statMap = { HP: 0, ATK: 0, DEF: 0, SPD: 0, SPATK: 0, SPDEF: 0 }
      pokemon.stats.forEach(s => {
        const n = s.stat.name
        if (n === 'hp') statMap.HP = s.base_stat
        else if (n === 'attack') statMap.ATK = s.base_stat
        else if (n === 'defense') statMap.DEF = s.base_stat
        else if (n === 'speed') statMap.SPD = s.base_stat
        else if (n === 'special-attack') statMap.SPATK = s.base_stat
        else if (n === 'special-defense') statMap.SPDEF = s.base_stat
      })

      const flavorEntry = speciesData.flavor_text_entries?.find(e => e.language.name === 'es')
      const flavor = flavorEntry
        ? flavorEntry.flavor_text.replace(/[\n\f]/g, ' ')
        : null

      setData({
        id: pokemon.id,
        name: titleCase(pokemon.name),
        sprite,
        types: pokemon.types.map(t => t.type.name),
        height: `${(pokemon.height / 10).toFixed(1)} m`,
        weight: `${(pokemon.weight / 10).toFixed(1)} kg`,
        ability,
        stats: statMap,
        flavor,
      })
      setSpecies({
        genderRate: speciesData.gender_rate,
        habitat: speciesData.habitat?.name ? titleCase(speciesData.habitat.name) : null,
        captureRate: speciesData.capture_rate,
        baseHappiness: speciesData.base_happiness,
        growthRate: speciesData.growth_rate?.name ? titleCase(speciesData.growth_rate.name) : null,
        eggGroups: speciesData.egg_groups?.map(g => titleCase(g.name)) ?? [],
        genera: speciesData.genera?.find(g => g.language.name === 'es')?.genus ?? null,
      })
    }).catch(() => setError(true))
  }, [pokemonId])

  if (error) {
    return (
      <div className={styles.backdrop} onClick={onClose}>
        <div className={styles.modal} onClick={e => e.stopPropagation()}>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
          <p className="text-center text-sm text-slate-400">No se pudieron cargar los datos de este Pokémon.</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className={styles.backdrop} onClick={onClose}>
        <div className={styles.modal} onClick={e => e.stopPropagation()}>
          <p className="text-center text-sm text-slate-400">Cargando...</p>
        </div>
      </div>
    )
  }

  const gender = species ? formatGender(species.genderRate) : null
  const maxStat = 120

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>

        <div className={styles.top}>
          <div className={styles.spriteBox}>
            <img src={data.sprite} alt={data.name} className={styles.sprite} />
          </div>

          <div className={styles.info}>
            <h2 className={styles.name}>{data.name}</h2>
            <span className={styles.id}>#{String(data.id).padStart(3, '0')}</span>

            {species?.genera && <p className={styles.genus}>{species.genera}</p>}
            {data.flavor && <p className={styles.flavor}>{data.flavor}</p>}

            <div className={styles.typeRow}>
              {data.types.map(t => {
                const config = getTypeConfig(t)
                return (
                  <span key={t} className={styles.typeChip} style={{ background: config.color }}>
                    {t}
                  </span>
                )
              })}
            </div>

            <div className={styles.detailGrid}>
              <div><span className={styles.detailLabel}>Altura</span><span className={styles.detailVal}>{data.height}</span></div>
              <div><span className={styles.detailLabel}>Peso</span><span className={styles.detailVal}>{data.weight}</span></div>
              <div><span className={styles.detailLabel}>Habilidad</span><span className={styles.detailVal}>{getAbilityIcon(data.ability)} {data.ability}</span></div>
              <div><span className={styles.detailLabel}>Género</span><span className={styles.detailVal}>{gender?.icon} {gender?.label}</span></div>
              {species?.habitat && <div><span className={styles.detailLabel}>Hábitat</span><span className={styles.detailVal}>{species.habitat}</span></div>}
              {species?.captureRate != null && <div><span className={styles.detailLabel}>Captura</span><span className={styles.detailVal}>{species.captureRate}</span></div>}
              {species?.growthRate && <div><span className={styles.detailLabel}>Crecimiento</span><span className={styles.detailVal}>{species.growthRate}</span></div>}
              {species?.eggGroups?.length > 0 && <div className={styles.eggRow}><span className={styles.detailLabel}>Huevo</span><span className={styles.detailVal}>{species.eggGroups.join(', ')}</span></div>}
            </div>
          </div>
        </div>

        <div className={styles.statsSection}>
          <p className={styles.sectionTitle}>Estadísticas Base</p>
          {['HP', 'ATK', 'DEF', 'SPD', 'SPATK', 'SPDEF'].map(stat => {
            const val = data.stats[stat] ?? 0
            const pct = Math.min(100, Math.round((val / maxStat) * 100))
            return (
              <div key={stat} className={styles.statRow}>
                <span className={styles.statLabel}>{stat}</span>
                <span className={styles.statTrack}>
                  <span className={styles.statFill} style={{ width: `${pct}%` }} />
                </span>
                <span className={styles.statVal}>{val}</span>
              </div>
            )
          })}
        </div>

        <div className={styles.actionsRow}>
          <button
            className={`${styles.favBtn} ${favorite === data.id ? styles.favBtnActive : ''}`}
            onClick={() => toggleFavorite(data.id)}
          >
            {favorite === data.id ? '★' : '☆'} {favorite === data.id ? 'Favorito' : 'Marcar como favorito'}
          </button>

          <button
            className={styles.statsBtn}
            onClick={() => { onGoStats(data.id); onClose() }}
          >
            Ver estadísticas completas
          </button>
        </div>
      </div>
    </div>
  )
}
