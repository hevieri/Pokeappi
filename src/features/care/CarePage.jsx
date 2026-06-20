import { useState, useEffect } from 'react'
import styles from './CarePage.module.css'

export default function CarePage({ pokemonId, onBack }) {
  const [name, setName] = useState('')
  const [sprite, setSprite] = useState('')

  useEffect(() => {
    if (pokemonId == null) return
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
      .then(r => r.json())
      .then(p => {
        setName(p.name.charAt(0).toUpperCase() + p.name.slice(1))
        const official = p.sprites?.other?.['official-artwork']?.front_default
        setSprite(official || p.sprites?.front_default || '')
      })
      .catch(() => {})
  }, [pokemonId])

  return (
    <section className={styles.page}>
      <button className={styles.backBtn} onClick={onBack}>← Volver</button>
      {sprite && (
        <img
          className={styles.sprite}
          src={sprite}
          alt={name || 'Pokémon'}
        />
      )}
      {name && <p className={styles.name}>{name}</p>}
    </section>
  )
}
