import { useState, useEffect } from 'react'

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    // Set 'dark' as the default theme
    const storedTheme = localStorage.getItem('theme');
    return storedTheme || 'dark';
  });

  useEffect(() => {
    // Apply the theme to the body element
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }

  return { theme, toggleTheme }
}