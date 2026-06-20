import { useEffect, useRef, useState } from 'react'
import useCombat from './hooks/useCombat'
import styles from './CombatPage.module.css'

const SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork'
const delay = (ms) => new Promise(r => setTimeout(r, ms))

export default function CombatPage({ playerPokemon, wins, streak, onBack, onWin, onDefeat, onCatch }) {
  const {
    phase, player, enemy,
    playerHP, enemyHP, playerMaxHP, enemyMaxHP,
    log, hitting, blackout, dramaticText,
    battleMoves, turnPhase, lastEnemyMove, enemyId,
    startBattle, selectMove, reset,
  } = useCombat()

  const logEndRef = useRef(null)
  const [winCounted, setWinCounted] = useState(false)
  const [defeatCounted, setDefeatCounted] = useState(false)
  const [catchPhase, setCatchPhase] = useState(null)
  const [catchResult, setCatchResult] = useState(null)

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [log])

  useEffect(() => {
    if (playerPokemon && phase === 'idle') {
      resetCatchState()
      startBattle(playerPokemon, wins)
    }
  }, [playerPokemon, wins, phase, startBattle])

  useEffect(() => {
    if (phase === 'victory' && onWin && !winCounted) {
      setWinCounted(true)
      onWin()
    }
  }, [phase, onWin, winCounted])

  useEffect(() => {
    if (phase === 'defeat' && onDefeat && !defeatCounted) {
      setDefeatCounted(true)
      onDefeat()
    }
  }, [phase, onDefeat, defeatCounted])

  const resetCatchState = () => {
    setCatchPhase(null)
    setCatchResult(null)
  }

  useEffect(() => {
    if (phase === 'idle') {
      setWinCounted(false)
      setDefeatCounted(false)
      resetCatchState()
    }
  }, [phase])

  const pPct = playerMaxHP > 0 ? Math.max(0, Math.round((playerHP / playerMaxHP) * 100)) : 0
  const ePct = enemyMaxHP > 0 ? Math.max(0, Math.round((enemyHP / enemyMaxHP) * 100)) : 0

  const handleRestart = () => reset()
  const handleBack = () => { reset(); onBack() }

  const handleCatch = async () => {
    setCatchPhase('thrown')
    await delay(700)
    setCatchPhase('shake1')
    await delay(450)
    setCatchPhase('shake2')
    await delay(450)
    setCatchPhase('shake3')
    await delay(450)

    const success = Math.random() < 0.5
    if (success) {
      if (enemyId && onCatch) onCatch(enemyId)
      setCatchPhase('caught')
      setCatchResult('caught')
    } else {
      setCatchPhase('escaped')
      setCatchResult('escaped')
    }
  }

  const handleCatchContinue = () => {
    setCatchPhase(null)
  }

  const blackoutClass = blackout
    ? `${styles.blackout} ${styles[`blackout${blackout.charAt(0).toUpperCase()}${blackout.slice(1)}`] || ''}`
    : ''

  const typeClassFor = (type) => styles[`moveType${type.charAt(0).toUpperCase()}${type.slice(1)}`] || ''

  return (
    <section className={styles.page}>
      {hitting && <div className={styles.flash} />}

      {blackout && !dramaticText && (
        <div className={blackoutClass} />
      )}

      {dramaticText && (
        <div className={styles.dramaticOverlay}>
          <span className={
            phase === 'defeat'
              ? `${styles.dramaticText} ${styles.defeatDramaticText}`
              : styles.dramaticText
          }>
            {dramaticText}
          </span>
        </div>
      )}

      {(phase === 'idle' || phase === 'intro') && (
        <div className={styles.overlay}>
          <div className={styles.introText}>
            {phase === 'intro' && enemy && (
              <>
                <p className={styles.introLine}>¡Un {enemy.name} salvaje aparece!</p>
                <div className={styles.introSprite}>
                  <img src={enemy.sprite} alt={enemy.name} />
                </div>
              </>
            )}
            {phase === 'idle' && (
              <p className={styles.introLine}>Preparando combate...</p>
            )}
          </div>
        </div>
      )}

      {/* ── Catch animation overlay ── */}
      {catchPhase && (
        <div className={styles.catchOverlay}>
          <div className={styles.catchInner}>
            <div className={`${styles.pokeball} ${
              catchPhase === 'thrown' ? styles.ballThrown :
              catchPhase.startsWith('shake') ? styles.ballShake :
              catchPhase === 'caught' ? styles.ballCaught :
              catchPhase === 'escaped' ? styles.ballEscaped : ''
            }`} />

            <p className={
              catchPhase === 'caught' ? styles.catchLabelSuccess :
              catchPhase === 'escaped' ? styles.catchLabelFail :
              styles.catchLabel
            }>
              {catchPhase === 'thrown' && 'Lanzando Pokéball...'}
              {catchPhase.startsWith('shake') && '...'}
              {catchPhase === 'caught' && `¡${enemy?.name} capturado!`}
              {catchPhase === 'escaped' && `¡${enemy?.name} escapó!`}
            </p>

            {(catchPhase === 'caught' || catchPhase === 'escaped') && (
              <button className={styles.actionBtn} onClick={handleCatchContinue}>
                Continuar
              </button>
            )}
          </div>
        </div>
      )}

      <div className={styles.arena}>
        <div className={styles.enemyArea}>
          {enemy && (
            <div className={`${styles.spriteBox} ${styles.enemySprite} ${hitting === 'enemy' ? styles.hitEnemy : ''}`}>
              <img src={enemy.sprite} alt={enemy.name} />
            </div>
          )}
        </div>

        <div className={styles.playerArea}>
          {player && (
            <div className={`${styles.spriteBox} ${styles.playerSprite} ${hitting === 'player' ? styles.hitPlayer : ''}`}>
              <img src={`${SPRITE_BASE}/${playerPokemon?.id}.png`} alt={player.name} />
            </div>
          )}
        </div>
      </div>

      <div className={styles.hud}>
        <div className={styles.hudRow}>
          <div className={styles.hudCard}>
            <div className={styles.hudTop}>
              <span className={styles.hudName}>
                {enemy?.name ?? '???'}
                {enemy?.types?.map(t => (
                  <span key={t} className={`${styles.typeBadge} ${styles[`type${t.charAt(0).toUpperCase()}${t.slice(1)}`] || ''}`}>
                    {t}
                  </span>
                ))}
              </span>
              <span className={styles.hudLv}>Lv.{enemy ? 1 + Math.floor((wins || 0) / 2) : '?'}</span>
            </div>
            <div className={styles.hpBarOuter}>
              <div className={styles.hpBarInner} style={{ width: `${ePct}%` }} />
            </div>
            <span className={styles.hpText}>{enemyHP}/{enemyMaxHP}</span>
          </div>
        </div>

        <div className={styles.hudRow}>
          <div className={styles.hudCard}>
            <div className={styles.hudTop}>
              <span className={styles.hudName}>
                {player?.name ?? '???'}
                {player?.types?.map(t => (
                  <span key={t} className={`${styles.typeBadge} ${styles[`type${t.charAt(0).toUpperCase()}${t.slice(1)}`] || ''}`}>
                    {t}
                  </span>
                ))}
              </span>
              <span className={styles.hudLv}>Lv.{player ? 5 + Math.floor((wins || 0) / 3) : '?'}</span>
            </div>
            <div className={styles.hpBarOuter}>
              <div className={`${styles.hpBarInner} ${styles.hpBarPlayer}`} style={{ width: `${pPct}%` }} />
            </div>
            <span className={styles.hpText}>{playerHP}/{playerMaxHP}</span>
          </div>
        </div>
      </div>

      <div className={styles.logBox}>
        <div className={styles.log}>
          {log.map((msg, i) => (
            <p key={i} className={styles.logLine}>{msg}</p>
          ))}
          <div ref={logEndRef} />
        </div>
      </div>

      {/* ── Move selection ── */}
      {turnPhase === 'player' && battleMoves.length === 4 && (
        <div className={styles.movePanel}>
          <div className={styles.panelTitle}>Elige un ataque:</div>
          <div className={styles.moveGrid}>
            {battleMoves.map((move, i) => (
              <button key={i} className={styles.moveBtn} onClick={() => selectMove(i)}>
                <span className={`${styles.moveTypeBadge} ${typeClassFor(move.type)}`}>{move.type}</span>
                <span className={styles.moveName}>{move.name}</span>
                <span className={styles.movePower}>{move.power}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Enemy move display ── */}
      {turnPhase === 'enemy' && lastEnemyMove && (
        <div className={styles.movePanel}>
          <div className={styles.panelEnemyTitle}>El enemigo usó:</div>
          <div className={styles.moveGrid}>
            <div className={`${styles.moveBtn} ${styles.enemyMoveBtn}`}>
              <span className={`${styles.moveTypeBadge} ${typeClassFor(lastEnemyMove.type)}`}>{lastEnemyMove.type}</span>
              <span className={styles.moveName}>{lastEnemyMove.name}</span>
              <span className={styles.movePower}>{lastEnemyMove.power}</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Victory screen ── */}
      {phase === 'victory' && (
        <div className={styles.overlay}>
          <div className={styles.resultBox}>
            <h2 className={styles.resultTitle}>¡VICTORIA!</h2>
            <p className={styles.resultSub}>Has derrotado a {enemy?.name}.</p>
            <p className={styles.defeatHint}>+1 victoria | Rachas: {streak || 0}</p>

            {streak >= 3 && catchPhase === null && catchResult === null && (
              <div className={styles.catchSection}>
                <p className={styles.catchText}>¡Puedes intentar atrapar a {enemy?.name}!</p>
                <button className={`${styles.actionBtn} ${styles.catchBtn}`} onClick={handleCatch}>
                  Atrapar (50%)
                </button>
              </div>
            )}

            {catchPhase === null && catchResult === 'caught' && (
              <div className={styles.catchSection}>
                <p className={styles.catchSuccess}>¡{enemy?.name} atrapado!</p>
              </div>
            )}

            {catchPhase === null && catchResult === 'escaped' && (
              <div className={styles.catchSection}>
                <p className={styles.catchFail}>{enemy?.name} escapó...</p>
              </div>
            )}

            <div className={styles.resultActions}>
              <button className={styles.actionBtn} onClick={handleRestart}>Seguir combatiendo</button>
              <button className={`${styles.actionBtn} ${styles.actionBtnSec}`} onClick={handleBack}>Volver</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Defeat screen ── */}
      {phase === 'defeat' && (
        <div className={styles.overlay}>
          <div className={`${styles.resultBox} ${styles.defeatBox}`}>
            <h2 className={`${styles.resultTitle} ${styles.defeatTitle}`}>DERROTA</h2>
            <p className={styles.resultSub}>{player?.name} no puede continuar...</p>
            {enemyHP < enemyMaxHP * 0.2 && (
              <p className={styles.defeatHint}>¡El {enemy?.name} enemigo apenas sobrevivió!</p>
            )}
            <p className={styles.defeatHint}>Entrena a tu Pokémon o consigue uno más fuerte.</p>
            <div className={styles.resultActions}>
              <button className={styles.actionBtn} onClick={handleRestart}>Intentar de nuevo</button>
              <button className={`${styles.actionBtn} ${styles.actionBtnSec}`} onClick={handleBack}>Volver</button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
