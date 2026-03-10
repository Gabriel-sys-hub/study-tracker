# Padroes de Codigo - Study Tracker

Este documento descreve os padroes de codigo e arquitetura utilizados no projeto.

## Estrutura de Pastas

```
src/
├── components/
│   ├── ui/              # Componentes UI reutilizaveis (Button, Card, Badge)
│   └── [Feature]/       # Componentes especificos de feature
├── constants/           # Constantes e configuracoes
│   └── theme.js         # Cores, estilos e configuracoes de tema
├── contexts/            # React Contexts
│   └── ThemeContext.jsx # Contexto de tema (dark/light)
├── data/                # Dados estaticos
├── utils/               # Funcoes utilitarias
│   ├── helpers.js       # Helpers gerais (cn, percentage, debounce)
│   └── storage.js       # Persistencia localStorage
└── App.jsx              # Componente raiz
```

## Tema e Cores

### Usando o ThemeContext

```jsx
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";

// No App.jsx (wrapper)
<ThemeProvider>
  <App />
</ThemeProvider>

// Em qualquer componente
function MyComponent() {
  const { darkMode, toggleTheme, theme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      {darkMode ? "Modo Claro" : "Modo Escuro"}
    </button>
  );
}
```

### Constantes de Cores

Todas as cores estao centralizadas em `constants/theme.js`:

```jsx
import { CATEGORY_COLORS, STATUS_CONFIG, COMMON_STYLES } from "./constants/theme";

// Cores por categoria (meses)
<div className={CATEGORY_COLORS.blue.bg}>...</div>

// Status de topicos
<span className={STATUS_CONFIG.done.className}>
  {STATUS_CONFIG.done.emoji} {STATUS_CONFIG.done.label}
</span>

// Estilos comuns
<div className={COMMON_STYLES.card}>...</div>
<button className={COMMON_STYLES.button.primary}>...</button>
```

### Classes Dark Mode

Sempre adicione variantes dark nas classes Tailwind:

```jsx
// Padrao para backgrounds
"bg-white dark:bg-gray-800"
"bg-gray-50 dark:bg-gray-900"
"bg-gray-100 dark:bg-gray-700"

// Padrao para textos
"text-gray-900 dark:text-gray-50"
"text-gray-700 dark:text-gray-200"
"text-gray-500 dark:text-gray-400"

// Padrao para bordas
"border-gray-200 dark:border-gray-700"
```

## Componentes UI

### Button

```jsx
import { Button } from "./components/ui";

<Button variant="primary" size="md" onClick={handleClick}>
  Salvar
</Button>

<Button variant="secondary" size="sm">
  Cancelar
</Button>

<Button variant="ghost">
  Link
</Button>
```

### Card

```jsx
import { Card } from "./components/ui";

<Card hoverable>
  <Card.Header>Titulo</Card.Header>
  <Card.Body>Conteudo</Card.Body>
  <Card.Footer>Acoes</Card.Footer>
</Card>
```

### Badge

```jsx
import { Badge } from "./components/ui";

// Pre-definidos
<Badge type="status" value="done" />
<Badge type="difficulty" value="easy" />
<Badge type="category" value="blue">Mes 1</Badge>

// Customizado
<Badge className="bg-purple-100 text-purple-700">
  Custom
</Badge>
```

### ThemeToggle

```jsx
import { ThemeToggle } from "./components/ui";

<ThemeToggle />                    // Apenas icone
<ThemeToggle variant="text" />     // Apenas texto
<ThemeToggle variant="full" />     // Icone + texto
```

## Funcoes Utilitarias

### Helpers

```jsx
import { cn, percentage, pluralize, debounce } from "./utils";

// Concatenar classes condicionalmente
cn("base", isActive && "active", hasError && "error")

// Calcular porcentagem
percentage(3, 10) // => 30

// Pluralizar
pluralize(5, "item") // => "5 itens"

// Debounce
const debouncedSave = debounce(saveData, 300);
```

### Storage

```jsx
import { saveToStorage, loadFromStorage, removeFromStorage } from "./utils";

// Salvar
saveToStorage("user-prefs", { theme: "dark" });

// Carregar com valor padrao
const prefs = loadFromStorage("user-prefs", { theme: "light" });

// Remover
removeFromStorage("user-prefs");
```

## Padroes de Componentes

### Estrutura Basica

```jsx
import { useState } from "react";
import { cn } from "../utils";
import { COMMON_STYLES } from "../constants/theme";

/**
 * Descricao do componente.
 *
 * @param {Object} props
 * @param {string} props.title - Titulo do componente
 * @param {boolean} [props.isActive=false] - Estado ativo
 */
export default function MyComponent({ title, isActive = false, className = "" }) {
  const [state, setState] = useState(null);

  return (
    <div className={cn(COMMON_STYLES.card, isActive && "ring-2", className)}>
      <h2>{title}</h2>
    </div>
  );
}
```

### Convencoes

1. **Nomes de arquivos**: PascalCase para componentes (`Button.jsx`), camelCase para utils (`helpers.js`)
2. **Exports**: Use `export default` para componentes, named exports para utils
3. **Props**: Sempre documente com JSDoc
4. **className**: Sempre aceite `className` como prop para customizacao
5. **Dark mode**: Sempre inclua variantes dark nas classes

## CSS e Tailwind

### index.css

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

:root {
  --bg-primary: #f9fafb;
  /* ... */
}

.dark {
  --bg-primary: #111827;
  /* ... */
}
```

### Ordem de Classes

Siga esta ordem para classes Tailwind:
1. Layout (flex, grid, position)
2. Spacing (p, m, gap)
3. Sizing (w, h)
4. Typography (text, font)
5. Colors (bg, text, border)
6. Effects (shadow, opacity)
7. Transitions
8. Dark mode variants

```jsx
// Exemplo
"flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-colors"
```
