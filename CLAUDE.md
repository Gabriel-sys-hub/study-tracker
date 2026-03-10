# Study Tracker - Guia para Claude Code

## Visao Geral

Aplicacao React para tracking de estudos com plano de 4 meses (16 semanas) focado em IA e desenvolvimento avancado.

## Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS v4
- **Storage**: localStorage

## Estrutura do Projeto

```
src/
├── components/
│   ├── ui/              # Componentes reutilizaveis (Button, Card, Badge, ThemeToggle)
│   ├── TopicDetails.jsx # Detalhes de cada topico (videos, livros, exercicios)
│   └── NotesEditor.jsx  # Editor de notas com Markdown
├── constants/
│   └── theme.js         # Cores e estilos centralizados
├── contexts/
│   └── ThemeContext.jsx # Contexto de tema dark/light
├── data/
│   └── studyResources.js # Recursos de estudo por topico
├── utils/
│   ├── helpers.js       # cn(), percentage(), pluralize(), debounce()
│   └── storage.js       # saveToStorage(), loadFromStorage()
└── App.jsx              # Componente principal
```

## Padroes de Codigo

### Tema e Cores

**SEMPRE** use as constantes de `constants/theme.js`:

```jsx
import { CATEGORY_COLORS, STATUS_CONFIG, COMMON_STYLES } from "./constants/theme";
```

**SEMPRE** inclua variantes dark mode:

```jsx
// Correto
"bg-white dark:bg-gray-800"
"text-gray-700 dark:text-gray-200"
"border-gray-200 dark:border-gray-700"

// Incorreto - falta dark mode
"bg-white"
"text-gray-700"
```

### Componentes

Use os componentes UI existentes:

```jsx
import { Button, Card, Badge, ThemeToggle } from "./components/ui";
```

### Funcoes Utilitarias

```jsx
import { cn, percentage, saveToStorage, loadFromStorage } from "./utils";
```

### Novas Cores

Ao adicionar novas cores, siga o padrao:

```jsx
// Em constants/theme.js
export const NEW_COLOR = {
  bg: "bg-[color]-50 dark:bg-[color]-950",
  border: "border-[color]-200 dark:border-[color]-800",
  text: "text-[color]-600 dark:text-[color]-400",
  // ...
};
```

## Documentacao

Veja `docs/PATTERNS.md` para documentacao completa dos padroes.

## Comandos

```bash
npm run dev              # Servidor de desenvolvimento (auto-gera modulos)
npm run build            # Build de producao (auto-gera modulos)
npm run generate:modules # Gera studyScripts.js a partir de src/estudos/
npm run new:module       # Cria um novo modulo de estudo
npm run preview          # Preview do build
```

## Scripts de Estudo (Automacao)

Os scripts Python sao gerenciados automaticamente.

### Estrutura

```
src/estudos/
  semana-01-arquitetura-llms/
    01-self-attention/
      module.json        <- Configuracao do modulo
      README.md          <- Documentacao
      self_attention.py  <- Scripts Python
      ...
```

### Criar Novo Modulo

```bash
npm run new:module 2 prompt-engineering
npm run new:module 1 tokenizacao "Tokenizacao" "🔤"
```

### module.json

```json
{
  "id": "nome-do-modulo",
  "title": "Titulo do Modulo",
  "description": "Descricao breve",
  "icon": "🧠",
  "color": "blue",
  "week": 1
}
```

### Metadados Automaticos

O script extrai a descricao do docstring do Python:

```python
"""
Titulo do Script - Esta linha vira a descricao.
Mais detalhes aqui (ignorados).
"""
```

### Cores Disponiveis

- `blue` - Mes 1 (IA & LLMs)
- `purple` - Mes 2 (Agentes & RAG)
- `green` - Mes 3 (Cloud)
- `orange` - Mes 4 (Full Stack)

## Checklist para Novos Componentes

- [ ] Aceita `className` como prop
- [ ] Usa constantes de `theme.js` para cores
- [ ] Inclui variantes dark mode
- [ ] Documentado com JSDoc
- [ ] Exportado em `components/ui/index.js` se for UI reutilizavel
