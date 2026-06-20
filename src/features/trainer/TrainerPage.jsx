import { useState, useEffect } from 'react'
import useCatches from '../pokedex/hooks/useCatches.js'
import useFavorite from '../pokedex/hooks/useFavorite'
import NavButton from '../../shared/components/NavButton.jsx'
import styles from './TrainerPage.module.css'

const TOTAL = 151
const SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork'

export default function TrainerPage({ onGoGift, onGoWelcome, onGoStats, onGoCombat }) {
  const { catches } = useCatches()
  const { favorite } = useFavorite()
  const [pokeName, setPokeName] = useState('')
  const [wins, setWins] = useState(0)

  const progress = Math.min(catches.length / TOTAL, 1)
  const pct = Math.round(progress * 100)

  useEffect(() => {
    try {
      const stored = parseInt(localStorage.getItem('pokeiapi_wins'), 10)
      if (!isNaN(stored)) setWins(stored)
    } catch {}
  }, [])

  useEffect(() => {
    if (favorite == null) {
      setPokeName('')
      return
    }
    fetch(`https://pokeapi.co/api/v2/pokemon/${favorite}`)
      .then(r => r.json())
      .then(p => setPokeName(p.name.charAt(0).toUpperCase() + p.name.slice(1)))
      .catch(() => setPokeName(''))
  }, [favorite])

  const handleSearch = () => {
    if (catches.length === 0) {
      onGoWelcome()
    } else if (catches.length % 10 === 0) {
      onGoGift()
    }
  }

  const buttonDisabled = catches.length > 0 && catches.length % 10 !== 0

  const handleFavClick = () => {
    if (favorite != null) onGoStats(favorite)
  }

  return (
    <section className="flex flex-col items-center min-h-[calc(100vh-8rem)] relative">
      <header className="mb-12 sm:mb-16 text-center">
        <div className="mb-2">
          <h1
            className="font-display text-[2.8rem] sm:text-[3.8rem] lg:text-[4.8rem] leading-none tracking-[0.06em] text-pk-yellow"
            style={{
              textShadow: '0 0 0 #2a6bb6, 2px 2px 0 #2a6bb6, 4px 4px 0 #2a6bb6, 6px 6px 0 #1a4a8a, 8px 8px 0 #1a4a8a, 10px 10px 0 #0f3460, 0 0 30px rgba(42,107,182,0.4)',
            }}
          >
            ENTRENADOR
          </h1>
        </div>
        <p className="text-xs uppercase tracking-[0.35em] text-pokeball-red font-semibold">Perfil</p>
      </header>

      <div className={styles.cardsRow}>
        <div className={styles.card}>
          <div className={styles.avatar}>
            <span className={styles.avatarIcon}>🔴</span>
          </div>

          <h2 className={styles.name}>Tú</h2>

          <div className={styles.statsRow}>
            <span className={styles.statValue}>{catches.length}</span>
            <span className={styles.statLabel}>atrapados de {TOTAL}</span>
          </div>

          <div className={styles.bar}>
            <div className={styles.barFill} style={{ width: `${pct}%` }} />
          </div>
          <span className={styles.pct}>{pct}%</span>

          <NavButton onClick={handleSearch} disabled={buttonDisabled}>
            Buscar Pokémon
          </NavButton>

          {buttonDisabled && (
            <p className={styles.hint}>
              Aventúrate como entrenador para que el profesor Oak te dé un obsequio
            </p>
          )}
        </div>

        <div className={`${styles.card} ${styles.combatCard}`}>
          <div className={styles.combatAvatar}>
            <span>⚔️</span>
          </div>

          <h2 className={styles.name}>Combate</h2>

          <div className={styles.statsRow}>
            <span className={styles.statValue}>{wins}</span>
            <span className={styles.statLabel}>victorias</span>
          </div>

          <div className={styles.bar}>
            <div className={styles.barFillCombat} style={{ width: `${Math.min(100, wins * 5)}%` }} />
          </div>
          <span className={styles.pct}>Nivel {1 + Math.floor(wins / 2)}</span>

          <NavButton onClick={() => onGoCombat()} disabled={catches.length === 0}>
            Combatir
          </NavButton>
        </div>
      </div>

      {favorite != null && (
        <div className={styles.favSection} onClick={handleFavClick}>
          <img
            className={styles.favSprite}
            src={`${SPRITE_BASE}/${favorite}.png`}
            alt={pokeName || 'Favorito'}
          />
          <p className={styles.favName}>{pokeName || `#${favorite}`}</p>
        </div>
      )}
    </section>
  )
}
