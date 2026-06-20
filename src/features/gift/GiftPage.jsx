import { useState, useEffect, useRef } from 'react'
import useCatches from '../pokedex/hooks/useCatches.js'
import { fetchBaseForms } from '../../shared/utils/baseForms.js'
import styles from './GiftPage.module.css'

export default function GiftPage({ onComplete }) {
  const { catchPokemon } = useCatches()
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState(null)
  const fetchedRef = useRef(false)

  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true

    fetchBaseForms().then(list => {
      const pick = list[Math.floor(Math.random() * list.length)]
      setSelected(pick)
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
            <p className={styles.message}>¡Felicidades entrenador!</p>
            <p className={styles.submessage}>El profesor Oak te ofrece un nuevo compañero</p>
            <button className={styles.actionBtn} onClick={() => setStep(1)}>
              Recibir
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
            <p className={styles.revealText}>¡{selected.name} se ha unido a ti!</p>
            <button className={styles.actionBtn} onClick={handleFinish}>
              Reclamar
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
