/**
 * NavButton
 *
 * Botón de navegación entre páginas. Usa el estilo del botón
 * "Entrar" (redondo, rojo, con hover de escala).
 *
 * Props:
 *   - onClick {function}: Callback al hacer clic.
 *   - children {ReactNode}: Texto o contenido del botón.
 *   - disabled {boolean}: Si está deshabilitado.
 */

export default function NavButton({ onClick, children, disabled }) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`rounded-full bg-pokeball-red px-8 py-3.5 text-sm font-bold text-white tracking-wider uppercase transition hover:scale-105 active:scale-100 ${
        disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : 'hover:bg-red-600'
      }`}
    >
      {children}
    </button>
  )
}
