import { useState, useEffect } from 'react'

const STORAGE_KEY = 'pokeappi_favorite'

export default function useFavorite() {
  const [favorite, setFavorite] = useState(null)

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
      if (typeof stored === 'number') setFavorite(stored)
    } catch {}
  }, [])

  const toggleFavorite = (id) => {
    setFavorite(prev => {
      if (prev === id) {
        localStorage.removeItem(STORAGE_KEY)
        return null
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(id))
      return id
    })
  }

  return { favorite, toggleFavorite }
}
