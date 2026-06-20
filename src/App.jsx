import { useState, useCallback, useEffect } from 'react'
import Home from './pages/Home.jsx'
import TrainerPage from './features/trainer/TrainerPage.jsx'
import WelcomePage from './pages/WelcomePage.jsx'
import GiftPage from './features/gift/GiftPage.jsx'
import Stats from './pages/Stats.jsx'
import PokedexPage from './features/pokedex/PokedexPage.jsx'
import About from './pages/About.jsx'
import CarePage from './features/care/CarePage.jsx'
import CombatPage from './features/combat/CombatPage.jsx'
import useCatches from './features/pokedex/hooks/useCatches.js'
import useFavorite from './features/pokedex/hooks/useFavorite'
import NavBall from './shared/components/NavBall.jsx'

export default function App() {
  const [page, setPage] = useState('home')
  const [pendingPokemonId, setPendingPokemonId] = useState(null)
  const { catches, catchPokemon } = useCatches()
  const { favorite } = useFavorite()
  const [combatPokemon, setCombatPokemon] = useState(null)
  const [wins, setWins] = useState(0)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    try {
      const w = parseInt(localStorage.getItem('pokeiapi_wins'), 10)
      if (!isNaN(w)) setWins(w)
      const s = parseInt(localStorage.getItem('pokeiapi_streak'), 10)
      if (!isNaN(s)) setStreak(s)
    } catch {}
  }, [page])

  const goToGift = useCallback(() => setPage('gift'), [])
  const goToWelcome = useCallback(() => setPage('welcome'), [])
  const goToStats = useCallback((id) => {
    setPendingPokemonId(id ?? null)
    setPage('stats')
  }, [])
  const goToCare = useCallback((id) => {
    setPendingPokemonId(id ?? null)
    setPage('care')
  }, [])

  const goToCombat = useCallback(() => {
    const id = favorite ?? catches[0]
    if (id == null) return
    setPendingPokemonId(id)
    setCombatPokemon(null)

    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then(r => r.json())
      .then(p => {
        const statMap = { HP: 0, ATK: 0, DEF: 0, SPD: 0, SPATK: 0, SPDEF: 0 }
        p.stats.forEach(s => {
          const n = s.stat.name
          if (n === 'hp') statMap.HP = s.base_stat
          else if (n === 'attack') statMap.ATK = s.base_stat
          else if (n === 'defense') statMap.DEF = s.base_stat
          else if (n === 'speed') statMap.SPD = s.base_stat
          else if (n === 'special-attack') statMap.SPATK = s.base_stat
          else if (n === 'special-defense') statMap.SPDEF = s.base_stat
        })
        setCombatPokemon({
          id: p.id,
          name: p.name.charAt(0).toUpperCase() + p.name.slice(1),
          types: p.types.map(t => t.type.name),
          stats: statMap,
          sprite: p.sprites?.other?.['official-artwork']?.front_default || p.sprites?.front_default || '',
        })
        setPage('combat')
      })
  }, [favorite, catches])

  const handleCombatBack = useCallback(() => {
    try {
      const w = parseInt(localStorage.getItem('pokeiapi_wins'), 10)
      if (!isNaN(w)) setWins(w)
      const s = parseInt(localStorage.getItem('pokeiapi_streak'), 10)
      if (!isNaN(s)) setStreak(s)
    } catch {}
    setCombatPokemon(null)
    setPage('trainer')
  }, [])

  const handleWin = useCallback(() => {
    const newWins = (wins || 0) + 1
    const newStreak = (streak || 0) + 1
    setWins(newWins)
    setStreak(newStreak)
    localStorage.setItem('pokeiapi_wins', String(newWins))
    localStorage.setItem('pokeiapi_streak', String(newStreak))
  }, [wins, streak])

  const handleDefeat = useCallback(() => {
    setStreak(0)
    localStorage.setItem('pokeiapi_streak', '0')
  }, [])

  const handleCatch = useCallback((id) => {
    catchPokemon(id)
  }, [catchPokemon])

  const renderPage = () => {
    switch (page) {
      case 'trainer':
        return <TrainerPage onGoGift={goToGift} onGoWelcome={goToWelcome} onGoStats={goToStats} onGoCombat={goToCombat} />
      case 'welcome':
        return <WelcomePage onComplete={() => setPage('trainer')} />
      case 'gift':
        return <GiftPage onComplete={() => setPage('trainer')} />
      case 'stats':
        return <Stats key={pendingPokemonId ?? 'default'} initialPokemonId={pendingPokemonId} onGoCare={goToCare} />
      case 'care':
        return <CarePage pokemonId={pendingPokemonId} onBack={() => setPage('stats')} />
      case 'combat':
        return (
          <CombatPage
            playerPokemon={combatPokemon}
            wins={wins}
            streak={streak}
            onBack={handleCombatBack}
            onWin={handleWin}
            onDefeat={handleDefeat}
            onCatch={handleCatch}
          />
        )
      case 'pokedex':
        return <PokedexPage onGoStats={goToStats} />
      case 'about':
        return <About />
      case 'home':
      default:
        return <Home onGoStats={() => setPage('trainer')} />
    }
  }

  return (
    <main className="min-h-screen px-6 sm:px-8 lg:px-10 py-6 sm:py-8 lg:py-10 pb-20">
      {renderPage()}
      <NavBall currentPage={page} onNavigate={setPage} />
    </main>
  )
}
