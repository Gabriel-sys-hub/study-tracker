/**
 * Script para gerar automaticamente o arquivo studyScripts.js
 * baseado na estrutura de pastas em src/estudos/
 *
 * Uso: node scripts/generate-study-modules.js
 *
 * Estrutura esperada:
 * src/estudos/
 *   semana-XX-nome/
 *     01-topico/
 *       module.json     <- Configuracao do modulo
 *       README.md       <- Documentacao (opcional)
 *       script1.py      <- Scripts Python
 *       script2.py
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ESTUDOS_DIR = path.join(__dirname, "../src/estudos");
const OUTPUT_FILE = path.join(__dirname, "../src/data/studyScripts.js");

// Cores disponiveis para os modulos
const COLORS = ["blue", "purple", "green", "orange"];

// Escapa caracteres especiais para uso em strings JS
function escapeString(str) {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "")
    .replace(/[""]/g, '\\"')  // Aspas curvas
    .replace(/['']/g, "\\'"); // Apostrofos curvos
}

// Extrai metadados do docstring do Python
function extractPythonMeta(content) {
  const docstringMatch = content.match(/^"""([\s\S]*?)"""/);
  if (!docstringMatch) return {};

  const docstring = docstringMatch[1].trim();
  const lines = docstring.split("\n");

  return {
    description: escapeString(lines[0] || ""),
  };
}

// Determina dificuldade baseado em heuristicas
function guessDifficulty(filename, content) {
  const name = filename.toLowerCase();

  if (name.includes("explicado") || name.includes("basic")) {
    return "easy";
  }
  if (name.includes("visual") || name.includes("calculo") || name.includes("api")) {
    return "medium";
  }
  if (name.includes("advanced") || name.includes("otimizado")) {
    return "hard";
  }

  // Heuristica por tamanho/complexidade
  const lines = content.split("\n").length;
  if (lines < 50) return "easy";
  if (lines < 150) return "medium";
  return "hard";
}

// Converte nome de arquivo para descricao legivel
function fileNameToDescription(filename) {
  const desc = filename
    .replace(".py", "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
  return escapeString(desc);
}

// Escaneia uma pasta de modulo
function scanModule(modulePath, weekNumber, colorIndex) {
  const moduleJsonPath = path.join(modulePath, "module.json");
  const readmePath = path.join(modulePath, "README.md");
  const moduleName = path.basename(modulePath);

  // Configuracao padrao
  let config = {
    id: moduleName,
    title: moduleName.replace(/^\d+-/, "").replace(/-/g, " "),
    description: "",
    icon: "📁",
    color: COLORS[colorIndex % COLORS.length],
    week: weekNumber,
  };

  // Carrega module.json se existir
  if (fs.existsSync(moduleJsonPath)) {
    const moduleJson = JSON.parse(fs.readFileSync(moduleJsonPath, "utf-8"));
    config = { ...config, ...moduleJson };
  }

  // Lista scripts Python
  const files = fs.readdirSync(modulePath);
  const scripts = [];
  const imports = [];

  for (const file of files) {
    if (file.endsWith(".py")) {
      const filePath = path.join(modulePath, file);
      const content = fs.readFileSync(filePath, "utf-8");
      const meta = extractPythonMeta(content);

      const importName = file
        .replace(".py", "")
        .replace(/[^a-zA-Z0-9]/g, "_")
        .replace(/^_+|_+$/g, "");

      const relativePath = path
        .relative(path.join(__dirname, "../src/data"), filePath)
        .replace(/\\/g, "/");

      imports.push({
        name: importName,
        path: relativePath,
      });

      scripts.push({
        name: file,
        description: meta.description || fileNameToDescription(file),
        importName: importName,
        difficulty: guessDifficulty(file, content),
      });
    }
  }

  // README
  let readmeImport = null;
  if (fs.existsSync(readmePath)) {
    const readmeImportName = `${config.id.replace(/-/g, "_")}_readme`;
    const relativePath = path
      .relative(path.join(__dirname, "../src/data"), readmePath)
      .replace(/\\/g, "/");

    readmeImport = {
      name: readmeImportName,
      path: relativePath,
    };
    config.readmeImportName = readmeImportName;
  }

  return {
    config,
    scripts,
    imports,
    readmeImport,
  };
}

// Escaneia todas as semanas
function scanAllModules() {
  const modules = [];

  if (!fs.existsSync(ESTUDOS_DIR)) {
    console.log("Pasta src/estudos nao encontrada. Criando...");
    fs.mkdirSync(ESTUDOS_DIR, { recursive: true });
    return modules;
  }

  const weeks = fs
    .readdirSync(ESTUDOS_DIR)
    .filter((f) => fs.statSync(path.join(ESTUDOS_DIR, f)).isDirectory())
    .sort();

  let colorIndex = 0;

  for (const week of weeks) {
    const weekPath = path.join(ESTUDOS_DIR, week);
    const weekMatch = week.match(/semana-(\d+)/);
    const weekNumber = weekMatch ? parseInt(weekMatch[1]) : 1;

    const topics = fs
      .readdirSync(weekPath)
      .filter((f) => fs.statSync(path.join(weekPath, f)).isDirectory())
      .sort();

    for (const topic of topics) {
      const topicPath = path.join(weekPath, topic);
      const module = scanModule(topicPath, weekNumber, colorIndex);
      modules.push(module);
      colorIndex++;
    }
  }

  return modules;
}

// Gera o arquivo studyScripts.js
function generateOutput(modules) {
  let output = `/**
 * ARQUIVO GERADO AUTOMATICAMENTE
 * Nao edite manualmente - use: npm run generate:modules
 *
 * Gerado em: ${new Date().toISOString()}
 */

`;

  // Imports
  for (const module of modules) {
    output += `// ${module.config.title}\n`;
    for (const imp of module.imports) {
      output += `import ${imp.name} from "${imp.path}?raw";\n`;
    }
    if (module.readmeImport) {
      output += `import ${module.readmeImport.name} from "${module.readmeImport.path}?raw";\n`;
    }
    output += "\n";
  }

  // Export
  output += "export const studyModules = [\n";

  for (const module of modules) {
    const { config, scripts } = module;

    output += `  {\n`;
    output += `    id: "${config.id}",\n`;
    output += `    title: "${config.title}",\n`;
    output += `    description: "${config.description}",\n`;
    output += `    icon: "${config.icon}",\n`;
    output += `    color: "${config.color}",\n`;
    output += `    week: ${config.week},\n`;

    if (config.readmeImportName) {
      output += `    readme: ${config.readmeImportName},\n`;
    } else {
      output += `    readme: "# ${config.title}\\n\\nDocumentacao pendente.",\n`;
    }

    output += `    scripts: [\n`;
    for (const script of scripts) {
      output += `      {\n`;
      output += `        name: "${script.name}",\n`;
      output += `        description: "${script.description.replace(/"/g, "'")}",\n`;
      output += `        code: ${script.importName},\n`;
      output += `        difficulty: "${script.difficulty}",\n`;
      output += `      },\n`;
    }
    output += `    ],\n`;
    output += `  },\n`;
  }

  output += "];\n\n";
  output += `export const getModuleById = (id) => studyModules.find((m) => m.id === id);\n`;

  return output;
}

// Main
function main() {
  console.log("🔍 Escaneando src/estudos/...\n");

  const modules = scanAllModules();

  if (modules.length === 0) {
    console.log("Nenhum modulo encontrado.");
    return;
  }

  console.log(`📚 Encontrados ${modules.length} modulos:\n`);
  for (const m of modules) {
    console.log(`   ${m.config.icon} ${m.config.title} (${m.scripts.length} scripts)`);
  }

  const output = generateOutput(modules);

  fs.writeFileSync(OUTPUT_FILE, output);
  console.log(`\n✅ Arquivo gerado: src/data/studyScripts.js`);
}

main();
