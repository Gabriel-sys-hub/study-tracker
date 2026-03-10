import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { studyModules } from "../data/studyScripts";
import { CATEGORY_COLORS } from "../constants/theme";

const difficultyConfig = {
  easy: {
    label: "Facil",
    className: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  },
  medium: {
    label: "Medio",
    className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  },
  hard: {
    label: "Dificil",
    className: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  },
};

function CodeBlock({ code, fileName }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between bg-gray-800 dark:bg-gray-950 text-gray-300 px-4 py-2 rounded-t-lg">
        <span className="text-sm font-mono">{fileName}</span>
        <button
          onClick={copyToClipboard}
          className="text-xs px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
        >
          {copied ? "Copiado!" : "Copiar"}
        </button>
      </div>
      <pre className="bg-gray-900 dark:bg-black text-gray-100 p-4 rounded-b-lg overflow-x-auto text-sm font-mono max-h-96 overflow-y-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function ModuleCard({ module, isSelected, onClick }) {
  const colors = CATEGORY_COLORS[module.color];

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
        isSelected
          ? `${colors.border} ${colors.bg} shadow-lg`
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{module.icon}</span>
        <div className="flex-1">
          <h3 className={`font-bold ${isSelected ? colors.text : "text-gray-800 dark:text-gray-200"}`}>
            {module.title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {module.description}
          </p>
        </div>
        <div className="text-right">
          <span className={`text-xs px-2 py-1 rounded-full ${colors.badge}`}>
            Semana {module.week}
          </span>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {module.scripts.length} script{module.scripts.length > 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </button>
  );
}

function ScriptViewer({ script }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const diff = difficultyConfig[script.difficulty];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">🐍</span>
          <div className="text-left">
            <h4 className="font-medium text-gray-800 dark:text-gray-200">
              {script.name}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {script.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs px-2 py-1 rounded-full ${diff.className}`}>
            {diff.label}
          </span>
          <span className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}>
            ▼
          </span>
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <CodeBlock code={script.code} fileName={script.name} />
        </div>
      )}
    </div>
  );
}

function MarkdownViewer({ content }) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none
      prose-headings:text-gray-800 dark:prose-headings:text-gray-200
      prose-p:text-gray-600 dark:prose-p:text-gray-300
      prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
      prose-pre:bg-gray-900 dark:prose-pre:bg-black prose-pre:text-gray-100
      prose-table:text-sm
      prose-th:bg-gray-100 dark:prose-th:bg-gray-800 prose-th:p-2
      prose-td:p-2 prose-td:border prose-td:border-gray-200 dark:prose-td:border-gray-700
    ">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}

export default function StudyScripts() {
  const [selectedModule, setSelectedModule] = useState(studyModules[0]);
  const [activeTab, setActiveTab] = useState("readme");

  const colors = CATEGORY_COLORS[selectedModule.color];

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          📁 Meus Scripts de Estudo
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Scripts Python com explicacoes visuais e documentacao em Markdown
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar - Module List */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">
            Modulos
          </h3>
          {studyModules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              isSelected={selectedModule.id === module.id}
              onClick={() => {
                setSelectedModule(module);
                setActiveTab("readme");
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Module Header */}
          <div className={`${colors.bg} ${colors.border} border rounded-xl p-4 mb-4`}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selectedModule.icon}</span>
              <div>
                <h3 className={`text-lg font-bold ${colors.text}`}>
                  {selectedModule.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedModule.description}
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
            <button
              onClick={() => setActiveTab("readme")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "readme"
                  ? `${colors.text} border-current`
                  : "text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              📖 Documentacao
            </button>
            <button
              onClick={() => setActiveTab("scripts")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "scripts"
                  ? `${colors.text} border-current`
                  : "text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              🐍 Scripts ({selectedModule.scripts.length})
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "readme" && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <MarkdownViewer content={selectedModule.readme} />
            </div>
          )}

          {activeTab === "scripts" && (
            <div className="space-y-3">
              {selectedModule.scripts.map((script, idx) => (
                <ScriptViewer key={idx} script={script} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
