import PropTypes from 'prop-types'
import { Sun, Moon } from 'lucide-react'

function Header({ theme, onToggleTheme }) {
  return (
    <header className="bg-card text-card-foreground py-4 px-6 flex justify-between items-center border-b">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold font-space-grotesk">
          bAbAk0t0 presents: <br>
          Surveillance State Simulator
        </h1>
        <span className="px-2 py-0.5 text-xs font-semibold rounded-full gemini-gradient text-white">
          Powered by Evil & Gemini 1.5
        </span>
      </div>
      <button
        onClick={onToggleTheme}
        className="p-2 rounded-full hover:bg-muted transition-colors"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </button>
    </header>
  )
}

Header.propTypes = {
  theme: PropTypes.string.isRequired,
  onToggleTheme: PropTypes.func.isRequired,
}

export default Header
