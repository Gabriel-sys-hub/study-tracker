/**
 * Constantes de tema e cores do projeto.
 * Centraliza todas as cores e estilos para consistência visual.
 */

// Cores base do tema
export const THEME_COLORS = {
  light: {
    bg: {
      primary: "bg-gray-50",
      secondary: "bg-white",
      tertiary: "bg-gray-100",
    },
    text: {
      primary: "text-gray-900",
      secondary: "text-gray-700",
      muted: "text-gray-500",
    },
    border: "border-gray-200",
  },
  dark: {
    bg: {
      primary: "bg-gray-900",
      secondary: "bg-gray-800",
      tertiary: "bg-gray-700",
    },
    text: {
      primary: "text-gray-50",
      secondary: "text-gray-200",
      muted: "text-gray-400",
    },
    border: "border-gray-700",
  },
};

// Cores por categoria (meses do plano de estudos)
export const CATEGORY_COLORS = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950",
    border: "border-blue-200 dark:border-blue-800",
    header: "bg-blue-600 dark:bg-blue-700",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    text: "text-blue-600 dark:text-blue-400",
    hover: "hover:bg-blue-100 dark:hover:bg-blue-900",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-950",
    border: "border-purple-200 dark:border-purple-800",
    header: "bg-purple-600 dark:bg-purple-700",
    badge: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    text: "text-purple-600 dark:text-purple-400",
    hover: "hover:bg-purple-100 dark:hover:bg-purple-900",
  },
  green: {
    bg: "bg-green-50 dark:bg-green-950",
    border: "border-green-200 dark:border-green-800",
    header: "bg-green-600 dark:bg-green-700",
    badge: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    text: "text-green-600 dark:text-green-400",
    hover: "hover:bg-green-100 dark:hover:bg-green-900",
  },
  orange: {
    bg: "bg-orange-50 dark:bg-orange-950",
    border: "border-orange-200 dark:border-orange-800",
    header: "bg-orange-600 dark:bg-orange-700",
    badge: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
    text: "text-orange-600 dark:text-orange-400",
    hover: "hover:bg-orange-100 dark:hover:bg-orange-900",
  },
};

// Status dos tópicos
export const STATUS_CONFIG = {
  todo: {
    label: "A fazer",
    emoji: "⬜",
    className: "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300",
  },
  doing: {
    label: "Em andamento",
    emoji: "🔄",
    className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  },
  done: {
    label: "Concluído",
    emoji: "✅",
    className: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  },
  skipped: {
    label: "Pulado",
    emoji: "⏭️",
    className: "bg-red-100 text-red-500 dark:bg-red-900 dark:text-red-300",
  },
};

// Dificuldade dos exercícios
export const DIFFICULTY_CONFIG = {
  easy: {
    label: "Fácil",
    className: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700",
  },
  medium: {
    label: "Médio",
    className: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-700",
  },
  hard: {
    label: "Difícil",
    className: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-700",
  },
};

// Estilos comuns reutilizáveis
export const COMMON_STYLES = {
  card: "bg-white dark:bg-gray-800 rounded-lg shadow-sm",
  cardHover: "hover:shadow-md transition-shadow",
  button: {
    primary: "bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500",
    secondary: "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600",
    ghost: "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
  },
  input: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent",
  transition: "transition-colors duration-200",
};
