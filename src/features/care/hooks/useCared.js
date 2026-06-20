import { useState, useEffect } from 'react'

const COUNT_KEY = 'pokeappi_care_count'

export default function useCared(resetKey) {
  const [careCount, setCareCount] = useState(0)

  useEffect(() => {
    try {
      const stored = parseInt(localStorage.getItem(COUNT_KEY), 10)
      if (!isNaN(stored)) setCareCount(stored)
    } catch {}
  }, [])

  useEffect(() => {
    setCareCount(0)
    localStorage.setItem(COUNT_KEY, '0')
  }, [resetKey])

  const useCare = () => {
    setCareCount(prev => {
      const next = prev + 1
      localStorage.setItem(COUNT_KEY, String(next))
      return next
    })
  }

  const careDisabled = careCount >= 2

  return { careCount, careDisabled, useCare }
}
