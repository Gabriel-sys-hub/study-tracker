import { useTheme } from "../../contexts/ThemeContext";

/**
 * Botao de toggle para alternar entre tema claro e escuro.
 *
 * @param {Object} props
 * @param {'icon' | 'text' | 'full'} [props.variant='icon'] - Variante visual
 * @param {string} [props.className] - Classes CSS adicionais
 *
 * @example
 * // Apenas icone
 * <ThemeToggle />
 *
 * // Com texto
 * <ThemeToggle variant="text" />
 *
 * // Completo (icone + texto)
 * <ThemeToggle variant="full" />
 */
export default function ThemeToggle({ variant = "icon", className = "" }) {
  const { darkMode, toggleTheme } = useTheme();

  const baseStyles = "rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";
  const buttonStyles = "p-2 bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600";

  const icon = darkMode ? "☀️" : "🌙";
  const text = darkMode ? "Modo Claro" : "Modo Escuro";

  const content = {
    icon: icon,
    text: text,
    full: `${icon} ${text}`,
  };

  return (
    <button
      onClick={toggleTheme}
      className={`${baseStyles} ${buttonStyles} ${className}`}
      title={text}
      aria-label={text}
    >
      {content[variant]}
    </button>
  );
}
