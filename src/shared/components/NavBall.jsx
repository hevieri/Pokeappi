import { useState, useCallback } from 'react'
import styles from './NavBall.module.css'

const pages = [
  { id: 'home', label: 'Inicio', icon: '🏠' },
  { id: 'trainer', label: 'Entrenador', icon: '👤' },
  { id: 'pokedex', label: 'Pokédex', icon: '⚡' },
  { id: 'about', label: 'Acerca de', icon: 'ℹ️' },
]

export default function NavBall({ currentPage, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  const handleNav = useCallback((pageId) => {
    onNavigate(pageId)
    setIsOpen(false)
  }, [onNavigate])

  return (
    <div className={`${styles.wrapper} ${isOpen ? styles.wrapperOpen : ''}`}>
      {isOpen && (
        <nav className={styles.menu}>
          {pages.map((page, i) => (
              <button
                key={page.id}
                className={`${styles.item} ${page.id === currentPage ? styles.itemActive : ''}`}
                style={{ animationDelay: `${i * 0.07}s` }}
                onClick={() => handleNav(page.id)}
              >
                <span>{page.icon}</span>
                {page.label}
              </button>
            ))}
        </nav>
      )}
      <button
        className={`${styles.ball} ${isOpen ? styles.ballOpen : ''}`}
        onClick={handleToggle}
        aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
      />
    </div>
  )
}
