import { useState, useCallback, useRef } from 'react'
import { getEffectiveness } from '../../../shared/data/typeChart'

function scaleStat(base, level) {
  return Math.round(base * (1 + (level - 1) * 0.12))
}

function calculateDamage(atkStat, defStat, level, effectiveness, power = 60) {
  const base = ((2 * level / 5 + 2) * power * atkStat / defStat / 50 + 2)
  const random = 0.85 + Math.random() * 0.15
  const crit = Math.random() < 0.0625 ? 1.5 : 1
  return Math.max(1, Math.floor(base * effectiveness * random * crit))
}

const MOVES_BY_TYPE = {
  normal: [
    { name: 'Placaje', power: 40, type: 'normal' },
    { name: 'Golpe Cuerpo', power: 85, type: 'normal' },
    { name: 'Hiperrayo', power: 150, type: 'normal' },
  ],
  fire: [
    { name: 'Ascuas', power: 40, type: 'fire' },
    { name: 'Lanzallamas', power: 90, type: 'fire' },
    { name: 'Llamarada', power: 110, type: 'fire' },
  ],
  water: [
    { name: 'Pistola Agua', power: 40, type: 'water' },
    { name: 'Hidrobomba', power: 110, type: 'water' },
    { name: 'Cascada', power: 80, type: 'water' },
  ],
  electric: [
    { name: 'Impactrueno', power: 40, type: 'electric' },
    { name: 'Rayo', power: 90, type: 'electric' },
    { name: 'Trueno', power: 110, type: 'electric' },
  ],
  grass: [
    { name: 'Hoja Afilada', power: 55, type: 'grass' },
    { name: 'Rayo Solar', power: 120, type: 'grass' },
    { name: 'Látigo Cepa', power: 35, type: 'grass' },
  ],
  ice: [
    { name: 'Rayo Hielo', power: 90, type: 'ice' },
    { name: 'Ventisca', power: 110, type: 'ice' },
    { name: 'Puño Hielo', power: 75, type: 'ice' },
  ],
  fighting: [
    { name: 'Golpe Karate', power: 50, type: 'fighting' },
    { name: 'Patada Baja', power: 60, type: 'fighting' },
    { name: 'Sumisión', power: 80, type: 'fighting' },
  ],
  poison: [
    { name: 'Ácido', power: 40, type: 'poison' },
    { name: 'Residuos', power: 65, type: 'poison' },
    { name: 'Bomba Lodo', power: 90, type: 'poison' },
  ],
  ground: [
    { name: 'Terremoto', power: 100, type: 'ground' },
    { name: 'Huesomerang', power: 50, type: 'ground' },
    { name: 'Fisura', power: 60, type: 'ground' },
  ],
  flying: [
    { name: 'Tornado', power: 40, type: 'flying' },
    { name: 'Vuelo', power: 90, type: 'flying' },
    { name: 'Ataque Aéreo', power: 60, type: 'flying' },
  ],
  psychic: [
    { name: 'Psicorrayo', power: 65, type: 'psychic' },
    { name: 'Psíquico', power: 90, type: 'psychic' },
    { name: 'Cabezazo Zen', power: 80, type: 'psychic' },
  ],
  bug: [
    { name: 'Picadura', power: 60, type: 'bug' },
    { name: 'Tijera X', power: 80, type: 'bug' },
    { name: 'Polvo Veneno', power: 30, type: 'bug' },
  ],
  rock: [
    { name: 'Lanzarrocas', power: 50, type: 'rock' },
    { name: 'Roca Afilada', power: 75, type: 'rock' },
    { name: 'Avalancha', power: 60, type: 'rock' },
  ],
  ghost: [
    { name: 'Lengüetazo', power: 30, type: 'ghost' },
    { name: 'Bola Sombra', power: 80, type: 'ghost' },
    { name: 'Puño Sombra', power: 60, type: 'ghost' },
  ],
  dragon: [
    { name: 'Garra Dragón', power: 80, type: 'dragon' },
    { name: 'Dragopulso', power: 85, type: 'dragon' },
    { name: 'Cola Dragón', power: 60, type: 'dragon' },
  ],
  dark: [
    { name: 'Mordisco', power: 60, type: 'dark' },
    { name: 'Pulso Umbrío', power: 80, type: 'dark' },
    { name: 'Golpe Bajo', power: 70, type: 'dark' },
  ],
  steel: [
    { name: 'Puño Meteoro', power: 90, type: 'steel' },
    { name: 'Cabeza Metálica', power: 80, type: 'steel' },
    { name: 'Garra Metal', power: 50, type: 'steel' },
  ],
  fairy: [
    { name: 'Carantoña', power: 90, type: 'fairy' },
    { name: 'Brillo Mágico', power: 80, type: 'fairy' },
    { name: 'Viento Hada', power: 40, type: 'fairy' },
  ],
}

function generateMoves(types) {
  const moves = []
  const primary = types[0] || 'normal'
  const secondary = types.length > 1 ? types[1] : null
  const allTypes = Object.keys(MOVES_BY_TYPE)

  const pickMove = (type) => {
    const pool = MOVES_BY_TYPE[type] || MOVES_BY_TYPE.normal
    return pool[Math.floor(Math.random() * pool.length)]
  }

  moves.push(pickMove(primary))
  moves.push(pickMove(primary))

  if (secondary && secondary !== primary) {
    moves.push(pickMove(secondary))
  } else {
    moves.push(pickMove('normal'))
  }

  const coverageTypes = allTypes.filter(t => t !== primary && t !== secondary)
  if (coverageTypes.length > 0) {
    const coverageType = coverageTypes[Math.floor(Math.random() * coverageTypes.length)]
    moves.push(pickMove(coverageType))
  } else {
    moves.push(pickMove('normal'))
  }

  return moves
}

export default function useCombat() {
  const [phase, setPhase] = useState('idle')
  const [player, setPlayer] = useState(null)
  const [enemy, setEnemy] = useState(null)
  const [playerHP, setPlayerHP] = useState(0)
  const [enemyHP, setEnemyHP] = useState(0)
  const [playerMaxHP, setPlayerMaxHP] = useState(0)
  const [enemyMaxHP, setEnemyMaxHP] = useState(0)
  const [log, setLog] = useState([])
  const [hitting, setHitting] = useState(null)
  const [blackout, setBlackout] = useState(null)
  const [dramaticText, setDramaticText] = useState('')
  const [battleMoves, setBattleMoves] = useState([])
  const [turnPhase, setTurnPhase] = useState('idle')
  const [lastEnemyMove, setLastEnemyMove] = useState(null)
  const [enemyId, setEnemyId] = useState(null)

  const moveResolverRef = useRef(null)

  const addLog = useCallback((msg) => {
    setLog(prev => [...prev, msg])
  }, [])

  const delay = (ms) => new Promise(r => setTimeout(r, ms))

  const triggerHit = useCallback(async (target) => {
    setHitting(target)
    await delay(350)
    setHitting(null)
    await delay(150)
  }, [])

  const waitForPlayerMove = useCallback(() => {
    return new Promise(resolve => {
      moveResolverRef.current = resolve
    })
  }, [])

  const selectMove = useCallback((moveIndex) => {
    const resolver = moveResolverRef.current
    if (resolver) {
      moveResolverRef.current = null
      resolver(moveIndex)
    }
  }, [])

  const startBattle = useCallback(async (playerMon, wins) => {
    const enemyLevel = 1 + Math.floor(wins / 2)
    const playerLevel = 5 + Math.floor(wins / 3)

    const enemyId = 1 + Math.floor(Math.random() * 898)
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${enemyId}`)
    const raw = await res.json()

    const eStats = {
      HP: raw.stats.find(s => s.stat.name === 'hp').base_stat,
      ATK: raw.stats.find(s => s.stat.name === 'attack').base_stat,
      DEF: raw.stats.find(s => s.stat.name === 'defense').base_stat,
      SPD: raw.stats.find(s => s.stat.name === 'speed').base_stat,
    }
    const eName = raw.name.charAt(0).toUpperCase() + raw.name.slice(1)
    const eTypes = raw.types.map(t => t.type.name)
    const eSprite = raw.sprites?.other?.['official-artwork']?.front_default || raw.sprites?.front_default || ''

    const pStats = {
      HP: playerMon.stats.HP || 50,
      ATK: playerMon.stats.ATK || 50,
      DEF: playerMon.stats.DEF || 50,
      SPD: playerMon.stats.SPD || 50,
    }
    const pName = playerMon.name
    const pTypes = playerMon.types

    const eScaled = {
      HP: scaleStat(eStats.HP, enemyLevel),
      ATK: scaleStat(eStats.ATK, enemyLevel),
      DEF: scaleStat(eStats.DEF, enemyLevel),
      SPD: scaleStat(eStats.SPD, enemyLevel),
    }
    const pScaled = {
      HP: scaleStat(pStats.HP, playerLevel),
      ATK: scaleStat(pStats.ATK, playerLevel),
      DEF: scaleStat(pStats.DEF, playerLevel),
      SPD: scaleStat(pStats.SPD, playerLevel),
    }

    const pMax = pScaled.HP
    const eMax = eScaled.HP

    const playerMoves = generateMoves(pTypes)
    const enemyMoves = generateMoves(eTypes)

    setPlayer({ name: pName, types: pTypes, stats: pScaled })
    setEnemy({ name: eName, types: eTypes, stats: eScaled, sprite: eSprite })
    setPlayerHP(pMax)
    setEnemyHP(eMax)
    setPlayerMaxHP(pMax)
    setEnemyMaxHP(eMax)
    setBattleMoves(playerMoves)
    setLog([])
    setTurnPhase('idle')
    setLastEnemyMove(null)
    setEnemyId(enemyId)
    setPhase('intro')

    // Dramatic intro
    setBlackout('entering')
    addLog(`¡Un ${eName} salvaje aparece!`)
    await delay(1800)
    setBlackout(null)
    await delay(800)

    let pHP = pMax
    let eHP = eMax
    let turnCount = 0
    let climaxUsed = false

    while (pHP > 0 && eHP > 0) {
      turnCount++
      setPhase('battle')

      // ── Player turn: wait for input ──
      setTurnPhase('player')
      const moveIndex = await waitForPlayerMove()
      const selectedMove = playerMoves[moveIndex]
      setTurnPhase('animating')

      const pEff = getEffectiveness([selectedMove.type], eTypes)
      const pDmg = calculateDamage(pScaled.ATK, eScaled.DEF, playerLevel, pEff, selectedMove.power)
      eHP = Math.max(0, eHP - pDmg)
      setEnemyHP(eHP)

      let pEffText = ''
      if (pEff > 1) pEffText = ' ¡Es muy efectivo!'
      else if (pEff < 1 && pEff > 0) pEffText = ' No es muy efectivo...'
      else if (pEff === 0) pEffText = ' No afecta...'

      addLog(`¡${pName} usa ${selectedMove.name}!${pEffText}`)
      await delay(500)
      await triggerHit('enemy')
      setEnemyHP(eHP)
      await delay(400)

      if (eHP <= 0) {
        setBlackout('strike')
        await delay(600)
        setBlackout(null)
        setTurnPhase('idle')
        setPhase('victory')
        addLog(`¡${eName} ha sido derrotado!`)
        return 'win'
      }

      // ── Climax check ──
      if (!climaxUsed && ((pHP < pMax * 0.35 && eHP < eMax * 0.35) || (pHP < pMax * 0.2 || eHP < eMax * 0.2))) {
        climaxUsed = true
        setTurnPhase('animating')
        setBlackout('dramatic')
        setDramaticText('¡CLÍMAX!')
        await delay(1500)
        setDramaticText('')
        setBlackout(null)
        await delay(400)

        addLog('Ambos Pokémon se preparan para el golpe final...')
        await delay(1200)

        const climaxMove = enemyMoves[Math.floor(Math.random() * enemyMoves.length)]
        setLastEnemyMove(climaxMove)
        addLog(`¡${eName} ataca con ${climaxMove.name}!`)
        await delay(700)
        const climaxDmg = calculateDamage(eScaled.ATK, pScaled.DEF, enemyLevel, getEffectiveness([climaxMove.type], pTypes), climaxMove.power * 1.2)
        pHP = Math.max(0, pHP - climaxDmg)
        setPlayerHP(pHP)
        await triggerHit('player')
        await delay(500)

        if (pHP <= 0) {
          setBlackout('falling')
          setDramaticText('¡GOLPE CRÍTICO!')
          await delay(1800)
          setDramaticText('')
          setBlackout(null)
          await delay(300)
          setTurnPhase('idle')
          setPhase('defeat')
          addLog(`${eName} respira con dificultad, pero se mantiene en pie.`)
          await delay(700)
          addLog(`¡${pName} ha sido derrotado!`)
          return 'lose'
        }

        addLog(`¡${pName} contraataca!`)
        await delay(700)
        const counterMove = playerMoves[Math.floor(Math.random() * playerMoves.length)]
        const counterEff = getEffectiveness([counterMove.type], eTypes)
        const counterDmg = calculateDamage(pScaled.ATK, eScaled.DEF, playerLevel, counterEff, counterMove.power)
        eHP = Math.max(0, eHP - counterDmg)
        setEnemyHP(eHP)
        await triggerHit('enemy')
        await delay(500)

        if (eHP <= 0) {
          setBlackout('strike')
          await delay(600)
          setBlackout(null)
          setTurnPhase('idle')
          setPhase('victory')
          addLog(`¡${eName} cae en el último suspiro!`)
          return 'win'
        }

        addLog('Ambos siguen en pie... apenas.')
        await delay(1000)
        continue
      }

      // ── Enemy turn (auto) ──
      setTurnPhase('enemy')
      await delay(700)

      const enemyMove = enemyMoves[Math.floor(Math.random() * enemyMoves.length)]
      setLastEnemyMove(enemyMove)
      const eEff = getEffectiveness([enemyMove.type], pTypes)
      const eDmg = calculateDamage(eScaled.ATK, pScaled.DEF, enemyLevel, eEff, enemyMove.power)
      pHP = Math.max(0, pHP - eDmg)
      setPlayerHP(pHP)

      let eEffText = ''
      if (eEff > 1) eEffText = ' ¡Es muy efectivo!'
      else if (eEff < 1 && eEff > 0) eEffText = ' No es muy efectivo...'

      addLog(`¡${eName} usa ${enemyMove.name}!${eEffText}`)
      await delay(500)
      await triggerHit('player')
      setPlayerHP(pHP)
      await delay(400)

      if (pHP <= 0) {
        setTurnPhase('animating')
        if (eHP < eMax * 0.2) {
          setBlackout('dramatic')
          setDramaticText('¡CASI!')
          await delay(1200)
          setDramaticText('')
          setBlackout(null)
          await delay(200)

          addLog(`${eName} apenas respira...`)
          await delay(800)
          addLog(`¡${pName} cae justo antes de lograr la victoria!`)
          await delay(600)
        } else {
          addLog(`${pName} ha sido derrotado...`)
          await delay(800)
        }

        setBlackout('falling')
        await delay(1000)
        setBlackout(null)
        setTurnPhase('idle')
        setPhase('defeat')
        addLog(`¡${pName} ya no puede continuar!`)
        return 'lose'
      }
    }
  }, [addLog, triggerHit, waitForPlayerMove])

  const reset = useCallback(() => {
    setPhase('idle')
    setPlayer(null)
    setEnemy(null)
    setPlayerHP(0)
    setEnemyHP(0)
    setLog([])
    setBlackout(null)
    setDramaticText('')
    setHitting(null)
    setBattleMoves([])
    setTurnPhase('idle')
    setLastEnemyMove(null)
    setEnemyId(null)
    moveResolverRef.current = null
  }, [])

  return {
    phase, player, enemy,
    playerHP, enemyHP, playerMaxHP, enemyMaxHP,
    log, hitting, blackout, dramaticText,
    battleMoves, turnPhase, lastEnemyMove, enemyId,
    startBattle, selectMove, reset,
  }
}
