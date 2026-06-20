import { useState, useEffect, useRef } from 'react'
import useCatches from '../features/pokedex/hooks/useCatches.js'
import styles from './WelcomePage.module.css'

const STARTER_IDS = new Set([1, 4, 7, 25, 152, 155, 158, 252, 255, 258])

function pickStarter(list) {
  const starters = list.filter(p => STARTER_IDS.has(p.id))
  return starters[Math.floor(Math.random() * starters.length)]
}

export default function WelcomePage({ onComplete }) {
  const { catchPokemon } = useCatches()
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState(null)
  const fetchedRef = useRef(false)

  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true

    fetch('https://pokeapi.co/api/v2/pokemon?limit=10000')
      .then(r => r.json())
      .then(data => {
        const list = data.results.map((p, i) => ({ name: p.name, id: i + 1 }))
        setSelected(pickStarter(list))
      })
  }, [])

  useEffect(() => {
    if (step === 1) {
      const timer = setTimeout(() => setStep(2), 2800)
      return () => clearTimeout(timer)
    }
  }, [step])

  const handleFinish = () => {
    if (selected) {
      catchPokemon(selected.id)
      onComplete()
    }
  }

  return (
    <section className={styles.overlay}>
      <div className={styles.inner}>
        {step === 0 && (
          <>
            <p className={styles.message}>Bienvenido entrenador</p>
            <p className={styles.submessage}>El profesor Oak tiene un regalo para ti</p>
            <button className={styles.actionBtn} onClick={() => setStep(1)}>
              Comenzar
            </button>
          </>
        )}

        {step === 1 && (
          <>
            <p className={styles.message}>Eligiendo a tu compañero...</p>
            <div className={`${styles.ball} ${styles.ballSpin}`} />
          </>
        )}

        {step === 2 && selected && (
          <div className={styles.revealBox}>
            <div className={styles.spriteWrap}>
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${selected.id}.png`}
                alt={selected.name}
                className={styles.sprite}
              />
            </div>
            <p className={styles.revealText}>¡Este va a ser tu nuevo compañero!</p>
            <p className={styles.pokemonName}>{selected.name}</p>
            <button className={styles.actionBtn} onClick={handleFinish}>
              Reclamar
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
