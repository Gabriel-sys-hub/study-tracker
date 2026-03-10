#!/usr/bin/env node
/**
 * Script para criar um novo modulo de estudo
 *
 * Uso: node scripts/create-module.js <semana> <nome-do-modulo>
 * Exemplo: node scripts/create-module.js 2 prompt-engineering
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ESTUDOS_DIR = path.join(__dirname, "../src/estudos");

const ICONS = ["🧠", "📊", "🪟", "🎛️", "🔧", "📝", "💡", "🚀", "⚡", "🎯"];
const COLORS = ["blue", "purple", "green", "orange"];

function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log(`
Uso: node scripts/create-module.js <semana> <nome-do-modulo> [titulo] [icone]

Exemplos:
  node scripts/create-module.js 2 prompt-engineering
  node scripts/create-module.js 1 tokenizacao "Tokenizacao" "🔤"

Isso cria:
  src/estudos/semana-02-xxx/prompt-engineering/
    ├── module.json
    ├── README.md
    └── exemplo.py
`);
    process.exit(1);
  }

  const [weekStr, moduleName, customTitle, customIcon] = args;
  const weekNumber = parseInt(weekStr);

  if (isNaN(weekNumber) || weekNumber < 1 || weekNumber > 16) {
    console.error("Erro: Semana deve ser um numero entre 1 e 16");
    process.exit(1);
  }

  // Encontra ou cria a pasta da semana
  const weekPadded = weekNumber.toString().padStart(2, "0");
  const existingWeeks = fs.existsSync(ESTUDOS_DIR)
    ? fs.readdirSync(ESTUDOS_DIR).filter((f) => f.startsWith(`semana-${weekPadded}`))
    : [];

  let weekFolder;
  if (existingWeeks.length > 0) {
    weekFolder = existingWeeks[0];
  } else {
    // Determina o nome da semana baseado no plano
    const weekNames = {
      1: "arquitetura-llms",
      2: "prompt-engineering",
      3: "apis-llms",
      4: "function-calling",
      5: "embeddings-busca",
      6: "rag-pipeline",
      7: "agentes-patterns",
      8: "avaliacao-observabilidade",
      9: "aws-ia",
      10: "arquitetura-sistemas",
      11: "ferramentas-dev",
      12: "finops-seguranca",
      13: "typescript-avancado",
      14: "nextjs-app-router",
      15: "trpc-drizzle-vercel",
      16: "projeto-final",
    };
    weekFolder = `semana-${weekPadded}-${weekNames[weekNumber] || "estudos"}`;
  }

  const weekPath = path.join(ESTUDOS_DIR, weekFolder);

  // Conta modulos existentes para numerar
  const existingModules = fs.existsSync(weekPath)
    ? fs.readdirSync(weekPath).filter((f) => fs.statSync(path.join(weekPath, f)).isDirectory())
    : [];

  const moduleNumber = (existingModules.length + 1).toString().padStart(2, "0");
  const moduleFolder = `${moduleNumber}-${moduleName}`;
  const modulePath = path.join(weekPath, moduleFolder);

  // Cria as pastas
  fs.mkdirSync(modulePath, { recursive: true });

  // Titulo e icone
  const title =
    customTitle ||
    moduleName
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

  const icon = customIcon || ICONS[existingModules.length % ICONS.length];
  const color = COLORS[existingModules.length % COLORS.length];

  // Cria module.json
  const moduleJson = {
    id: moduleName,
    title: title,
    description: `Modulo sobre ${title.toLowerCase()}`,
    icon: icon,
    color: color,
    week: weekNumber,
  };

  fs.writeFileSync(
    path.join(modulePath, "module.json"),
    JSON.stringify(moduleJson, null, 2) + "\n"
  );

  // Cria README.md
  const readme = `# ${icon} ${title}

## Objetivo

Descreva aqui o objetivo deste modulo de estudo.

## Conceitos

- Conceito 1
- Conceito 2
- Conceito 3

## Scripts

| Script | Descricao |
|--------|-----------|
| \`exemplo.py\` | Script de exemplo |

## Referencias

- [Link 1](https://example.com)
- [Link 2](https://example.com)
`;

  fs.writeFileSync(path.join(modulePath, "README.md"), readme);

  // Cria script de exemplo
  const exampleScript = `"""
${title} - Script de exemplo
Descricao breve do que este script faz.
"""

def main():
    """Funcao principal."""
    print("=" * 60)
    print("${title.toUpperCase()}")
    print("=" * 60)

    # Seu codigo aqui
    print("\\nImplemente seu estudo aqui!")


if __name__ == "__main__":
    main()
`;

  fs.writeFileSync(path.join(modulePath, "exemplo.py"), exampleScript);

  console.log(`
✅ Modulo criado com sucesso!

📁 ${modulePath.replace(/\\/g, "/")}
   ├── module.json
   ├── README.md
   └── exemplo.py

Proximos passos:
1. Edite o README.md com a documentacao
2. Crie seus scripts Python
3. Execute: npm run generate:modules

O modulo aparecera automaticamente na interface!
`);
}

main();
