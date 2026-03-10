import { createContext, useContext, useState, useEffect } from "react";

const THEME_KEY = "study-tracker-theme";

const ThemeContext = createContext(undefined);

/**
 * Provider de tema para a aplicacao.
 * Gerencia o estado do tema (dark/light) e persiste no localStorage.
 *
 * @example
 * // No App.jsx
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 *
 * // Em qualquer componente filho
 * const { darkMode, toggleTheme } = useTheme();
 */
export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved) return saved === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem(THEME_KEY, darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((prev) => !prev);
  const setTheme = (isDark) => setDarkMode(isDark);

  const value = {
    darkMode,
    toggleTheme,
    setTheme,
    theme: darkMode ? "dark" : "light",
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook para acessar o contexto de tema.
 *
 * @returns {{ darkMode: boolean, toggleTheme: () => void, setTheme: (isDark: boolean) => void, theme: 'dark' | 'light' }}
 *
 * @example
 * const { darkMode, toggleTheme } = useTheme();
 *
 * return (
 *   <button onClick={toggleTheme}>
 *     {darkMode ? 'Modo Claro' : 'Modo Escuro'}
 *   </button>
 * );
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme deve ser usado dentro de um ThemeProvider");
  }
  return context;
}

export default ThemeContext;
