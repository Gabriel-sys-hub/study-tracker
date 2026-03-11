/**
 * Sistema de Design - Study Tracker
 *
 * Paleta de cores moderna inspirada em Linear, Vercel e Tailwind UI.
 * Foco em acessibilidade (WCAG AA) e consistência visual.
 *
 * Convenções:
 * - Todas as cores incluem variantes light/dark
 * - Headers usam gradientes sutis para visual moderno
 * - Badges e textos garantem contraste mínimo 4.5:1
 */

// ============================================
// CORES BASE DO TEMA
// ============================================
export const THEME_COLORS = {
  light: {
    bg: {
      primary: "bg-slate-50",
      secondary: "bg-white",
      tertiary: "bg-slate-100",
      elevated: "bg-white shadow-sm",
    },
    text: {
      primary: "text-slate-900",
      secondary: "text-slate-700",
      muted: "text-slate-500",
      inverse: "text-white",
    },
    border: "border-slate-200",
  },
  dark: {
    bg: {
      primary: "bg-slate-950",
      secondary: "bg-slate-900",
      tertiary: "bg-slate-800",
      elevated: "bg-slate-800/80 backdrop-blur-sm",
    },
    text: {
      primary: "text-slate-50",
      secondary: "text-slate-200",
      muted: "text-slate-400",
      inverse: "text-slate-900",
    },
    border: "border-slate-800",
  },
};

// ============================================
// CORES POR CATEGORIA (Meses do Plano)
// ============================================
// Paleta refinada com melhor contraste e gradientes modernos
export const CATEGORY_COLORS = {
  // Azul Índigo - IA & LLMs (Mês 1)
  blue: {
    // Backgrounds
    bg: "bg-indigo-50/80 dark:bg-indigo-950/30",
    bgSolid: "bg-indigo-50 dark:bg-indigo-950",
    // Bordas
    border: "border-indigo-200/80 dark:border-indigo-800/50",
    borderSolid: "border-indigo-300 dark:border-indigo-700",
    // Header com gradiente
    header: "bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-700 dark:to-blue-700",
    headerSolid: "bg-indigo-600 dark:bg-indigo-700",
    // Badges e tags
    badge: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200",
    badgeOutline: "border border-indigo-300 text-indigo-700 dark:border-indigo-700 dark:text-indigo-300",
    // Textos
    text: "text-indigo-700 dark:text-indigo-300",
    textMuted: "text-indigo-600/80 dark:text-indigo-400/80",
    // Estados
    hover: "hover:bg-indigo-100 dark:hover:bg-indigo-900/40",
    active: "bg-indigo-100 dark:bg-indigo-900/50",
    // Ícone/Accent
    accent: "text-indigo-500 dark:text-indigo-400",
    ring: "ring-indigo-500/30 dark:ring-indigo-400/30",
  },

  // Violeta/Roxo - Agentes & RAG (Mês 2)
  purple: {
    bg: "bg-violet-50/80 dark:bg-violet-950/30",
    bgSolid: "bg-violet-50 dark:bg-violet-950",
    border: "border-violet-200/80 dark:border-violet-800/50",
    borderSolid: "border-violet-300 dark:border-violet-700",
    header: "bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-700 dark:to-purple-700",
    headerSolid: "bg-violet-600 dark:bg-violet-700",
    badge: "bg-violet-100 text-violet-800 dark:bg-violet-900/60 dark:text-violet-200",
    badgeOutline: "border border-violet-300 text-violet-700 dark:border-violet-700 dark:text-violet-300",
    text: "text-violet-700 dark:text-violet-300",
    textMuted: "text-violet-600/80 dark:text-violet-400/80",
    hover: "hover:bg-violet-100 dark:hover:bg-violet-900/40",
    active: "bg-violet-100 dark:bg-violet-900/50",
    accent: "text-violet-500 dark:text-violet-400",
    ring: "ring-violet-500/30 dark:ring-violet-400/30",
  },

  // Esmeralda/Verde - Cloud & Ferramentas (Mês 3)
  green: {
    bg: "bg-emerald-50/80 dark:bg-emerald-950/30",
    bgSolid: "bg-emerald-50 dark:bg-emerald-950",
    border: "border-emerald-200/80 dark:border-emerald-800/50",
    borderSolid: "border-emerald-300 dark:border-emerald-700",
    header: "bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-700 dark:to-teal-700",
    headerSolid: "bg-emerald-600 dark:bg-emerald-700",
    badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200",
    badgeOutline: "border border-emerald-300 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300",
    text: "text-emerald-700 dark:text-emerald-300",
    textMuted: "text-emerald-600/80 dark:text-emerald-400/80",
    hover: "hover:bg-emerald-100 dark:hover:bg-emerald-900/40",
    active: "bg-emerald-100 dark:bg-emerald-900/50",
    accent: "text-emerald-500 dark:text-emerald-400",
    ring: "ring-emerald-500/30 dark:ring-emerald-400/30",
  },

  // Âmbar/Laranja - Full Stack Moderno (Mês 4)
  orange: {
    bg: "bg-amber-50/80 dark:bg-amber-950/30",
    bgSolid: "bg-amber-50 dark:bg-amber-950",
    border: "border-amber-200/80 dark:border-amber-800/50",
    borderSolid: "border-amber-300 dark:border-amber-700",
    header: "bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600",
    headerSolid: "bg-amber-600 dark:bg-amber-700",
    badge: "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200",
    badgeOutline: "border border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-300",
    text: "text-amber-700 dark:text-amber-300",
    textMuted: "text-amber-600/80 dark:text-amber-400/80",
    hover: "hover:bg-amber-100 dark:hover:bg-amber-900/40",
    active: "bg-amber-100 dark:bg-amber-900/50",
    accent: "text-amber-500 dark:text-amber-400",
    ring: "ring-amber-500/30 dark:ring-amber-400/30",
  },
};

// ============================================
// STATUS DOS TÓPICOS
// ============================================
export const STATUS_CONFIG = {
  todo: {
    label: "A fazer",
    emoji: "⬜",
    className: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
    dotColor: "bg-slate-400 dark:bg-slate-500",
  },
  doing: {
    label: "Em andamento",
    emoji: "🔄",
    className: "bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300",
    dotColor: "bg-sky-500 dark:bg-sky-400",
  },
  done: {
    label: "Concluído",
    emoji: "✅",
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
    dotColor: "bg-emerald-500 dark:bg-emerald-400",
  },
  skipped: {
    label: "Pulado",
    emoji: "⏭️",
    className: "bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400",
    dotColor: "bg-slate-400 dark:bg-slate-500",
  },
};

// ============================================
// DIFICULDADE DOS EXERCÍCIOS
// ============================================
export const DIFFICULTY_CONFIG = {
  easy: {
    label: "Iniciante",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-800",
    icon: "🟢",
  },
  medium: {
    label: "Intermediário",
    className: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-800",
    icon: "🟡",
  },
  hard: {
    label: "Avançado",
    className: "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/50 dark:text-rose-300 dark:border-rose-800",
    icon: "🔴",
  },
};

// ============================================
// TIPOS DE RECURSOS
// ============================================
export const RESOURCE_TYPE_CONFIG = {
  video: {
    icon: "🎬",
    label: "Vídeo",
    className: "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300",
  },
  article: {
    icon: "📄",
    label: "Artigo",
    className: "bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300",
  },
  docs: {
    icon: "📚",
    label: "Docs",
    className: "bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300",
  },
  tutorial: {
    icon: "💻",
    label: "Tutorial",
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
  },
  course: {
    icon: "🎓",
    label: "Curso",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
  },
  book: {
    icon: "📖",
    label: "Livro",
    className: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300",
  },
};

// ============================================
// ESTILOS COMUNS REUTILIZÁVEIS
// ============================================
export const COMMON_STYLES = {
  // Cards
  card: "bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200/60 dark:border-slate-800/60",
  cardHover: "hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200",
  cardElevated: "bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200/40 dark:border-slate-700/40",

  // Botões
  button: {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 shadow-sm",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700",
    ghost: "text-slate-600 hover:bg-slate-100 active:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800",
    danger: "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 dark:bg-rose-600 dark:hover:bg-rose-500",
    success: "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500",
  },

  // Inputs
  input: "bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 dark:focus:ring-indigo-400/40 dark:focus:border-indigo-400 rounded-lg transition-colors",

  // Transições
  transition: "transition-all duration-200 ease-out",
  transitionFast: "transition-all duration-150 ease-out",
  transitionSlow: "transition-all duration-300 ease-out",

  // Focus rings
  focusRing: "focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:ring-offset-2 dark:focus:ring-offset-slate-900",

  // Gradientes de texto
  gradientText: "bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent",

  // Glassmorphism
  glass: "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/20 dark:border-slate-800/20",
};

// ============================================
// CORES SEMÂNTICAS
// ============================================
export const SEMANTIC_COLORS = {
  success: {
    bg: "bg-emerald-100 dark:bg-emerald-900/50",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-300 dark:border-emerald-700",
    icon: "text-emerald-500 dark:text-emerald-400",
  },
  warning: {
    bg: "bg-amber-100 dark:bg-amber-900/50",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-300 dark:border-amber-700",
    icon: "text-amber-500 dark:text-amber-400",
  },
  error: {
    bg: "bg-rose-100 dark:bg-rose-900/50",
    text: "text-rose-700 dark:text-rose-300",
    border: "border-rose-300 dark:border-rose-700",
    icon: "text-rose-500 dark:text-rose-400",
  },
  info: {
    bg: "bg-sky-100 dark:bg-sky-900/50",
    text: "text-sky-700 dark:text-sky-300",
    border: "border-sky-300 dark:border-sky-700",
    icon: "text-sky-500 dark:text-sky-400",
  },
};

// ============================================
// GRADIENTES PREDEFINIDOS
// ============================================
export const GRADIENTS = {
  // Gradientes de header
  primary: "bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600",
  secondary: "bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-900 dark:to-black",

  // Gradientes de destaque
  sunrise: "bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500",
  ocean: "bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500",
  forest: "bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500",
  sunset: "bg-gradient-to-r from-rose-500 via-pink-500 to-violet-500",

  // Gradientes sutis para backgrounds
  subtlePrimary: "bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/50 dark:to-violet-950/50",
  subtleWarm: "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50",
  subtleCool: "bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/50 dark:to-blue-950/50",
};
