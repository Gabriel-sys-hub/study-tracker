import { useState, useEffect, useRef } from "react";
import { Card, Button } from "./ui";
import { studyModules } from "../data/studyScripts";

/**
 * Executor de Scripts Python no Browser usando Pyodide
 * Carrega Python via WebAssembly e executa scripts dos módulos de estudo
 */
export default function PythonRunner() {
  const [pyodide, setPyodide] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [error, setError] = useState(null);
  const [output, setOutput] = useState([]);
  const [running, setRunning] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedScript, setSelectedScript] = useState(null);
  const [customCode, setCustomCode] = useState("");
  const [mode, setMode] = useState("scripts"); // "scripts" | "playground"
  const outputRef = useRef(null);

  // Load Pyodide
  const loadPyodide = async () => {
    if (pyodide) return pyodide;

    setLoading(true);
    setError(null);

    try {
      setLoadingMessage("Carregando Pyodide (~10MB)...");

      // Load Pyodide from CDN
      if (!window.loadPyodide) {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js";
        script.async = true;
        document.head.appendChild(script);

        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = () => reject(new Error("Falha ao carregar Pyodide"));
        });
      }

      setLoadingMessage("Inicializando Python...");
      const py = await window.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/",
      });

      setLoadingMessage("Configurando ambiente...");

      // Setup stdout/stderr capture
      await py.runPythonAsync(`
import sys
from io import StringIO

class OutputCapture:
    def __init__(self):
        self.outputs = []

    def write(self, text):
        if text.strip():
            self.outputs.append(text)

    def flush(self):
        pass

    def get_output(self):
        result = ''.join(self.outputs)
        self.outputs = []
        return result

_capture = OutputCapture()
sys.stdout = _capture
sys.stderr = _capture
      `);

      setPyodide(py);
      setLoading(false);
      setLoadingMessage("");
      return py;
    } catch (err) {
      setError(`Erro ao carregar Pyodide: ${err.message}`);
      setLoading(false);
      setLoadingMessage("");
      return null;
    }
  };

  // Run Python code
  const runCode = async (code) => {
    setRunning(true);
    setOutput([]);

    try {
      let py = pyodide;
      if (!py) {
        py = await loadPyodide();
        if (!py) {
          setRunning(false);
          return;
        }
      }

      // Clean the code (remove API keys placeholders, etc.)
      let cleanCode = code
        .replace(/os\.environ\.get\(['"]\w+['"]\)/g, '"demo_key"')
        .replace(/import anthropic/g, "# import anthropic (not available in browser)")
        .replace(/anthropic\.Anthropic\(\)/g, "None  # Anthropic client not available in browser");

      // Add print wrapper for better output
      const wrappedCode = `
${cleanCode}

# Get captured output
_output = _capture.get_output()
_output
`;

      const startTime = performance.now();
      const result = await py.runPythonAsync(wrappedCode);
      const endTime = performance.now();

      const outputs = [];

      if (result) {
        outputs.push({ type: "output", text: result });
      }

      outputs.push({
        type: "info",
        text: `Executado em ${(endTime - startTime).toFixed(0)}ms`,
      });

      setOutput(outputs);
    } catch (err) {
      setOutput([
        { type: "error", text: err.message },
      ]);
    }

    setRunning(false);
  };

  // Auto-scroll output
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  // Select a script from modules
  const handleSelectScript = (module, script) => {
    setSelectedModule(module);
    setSelectedScript(script);
    setOutput([]);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
            Python Runner
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Execute scripts Python diretamente no browser
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={mode === "scripts" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setMode("scripts")}
          >
            Scripts
          </Button>
          <Button
            variant={mode === "playground" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setMode("playground")}
          >
            Playground
          </Button>
        </div>
      </div>

      {/* Pyodide status */}
      {!pyodide && !loading && (
        <Card className="mb-6">
          <Card.Body className="text-center py-8">
            <p className="text-4xl mb-3">🐍</p>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Python ainda não carregado. Clique para inicializar.
            </p>
            <Button onClick={loadPyodide}>Carregar Python</Button>
            <p className="text-xs text-gray-400 mt-2">
              Pyodide ~10MB (WebAssembly)
            </p>
          </Card.Body>
        </Card>
      )}

      {loading && (
        <Card className="mb-6">
          <Card.Body className="text-center py-8">
            <div className="animate-spin text-4xl mb-3">⚙️</div>
            <p className="text-gray-600 dark:text-gray-400">{loadingMessage}</p>
          </Card.Body>
        </Card>
      )}

      {error && (
        <Card className="mb-6 border-red-300 dark:border-red-800">
          <Card.Body className="text-center py-4">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <Button variant="ghost" size="sm" onClick={loadPyodide} className="mt-2">
              Tentar novamente
            </Button>
          </Card.Body>
        </Card>
      )}

      {pyodide && (
        <div className="flex items-center gap-2 mb-4 text-sm text-green-600 dark:text-green-400">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Python pronto
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Script selection or playground */}
        <div>
          {mode === "scripts" ? (
            <>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Selecione um script
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {studyModules.map((module) => (
                  <Card key={module.id}>
                    <Card.Header className="py-2 px-3">
                      <span className="text-sm font-medium">
                        {module.icon} {module.title}
                      </span>
                    </Card.Header>
                    <Card.Body className="p-2 space-y-1">
                      {module.scripts.map((script) => (
                        <button
                          key={script.name}
                          onClick={() => handleSelectScript(module, script)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            selectedScript?.name === script.name &&
                            selectedModule?.id === module.id
                              ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                              : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          <span className="font-mono text-xs">{script.name}</span>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                            {script.description}
                          </p>
                        </button>
                      ))}
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Playground
              </h3>
              <textarea
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                placeholder="# Digite seu código Python aqui&#10;print('Hello, World!')"
                className="w-full h-80 px-4 py-3 font-mono text-sm
                         bg-gray-900 text-green-400 rounded-lg
                         border border-gray-700 focus:border-blue-500 focus:outline-none
                         resize-none"
                spellCheck={false}
              />
              <Button
                onClick={() => runCode(customCode)}
                disabled={!customCode.trim() || running || loading}
                className="w-full mt-3"
              >
                {running ? "Executando..." : "Executar"}
              </Button>
            </>
          )}
        </div>

        {/* Right: Code preview and output */}
        <div>
          {mode === "scripts" && selectedScript && (
            <>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {selectedScript.name}
                </h3>
                <Button
                  size="sm"
                  onClick={() => runCode(selectedScript.code)}
                  disabled={running || loading}
                >
                  {running ? "Executando..." : "Executar"}
                </Button>
              </div>

              {/* Code preview */}
              <div className="bg-gray-900 rounded-lg p-4 max-h-48 overflow-auto mb-4">
                <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap">
                  {selectedScript.code.slice(0, 1000)}
                  {selectedScript.code.length > 1000 && "\n... (código truncado)"}
                </pre>
              </div>
            </>
          )}

          {/* Output */}
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Output
          </h3>
          <div
            ref={outputRef}
            className="bg-gray-900 rounded-lg p-4 h-64 overflow-auto font-mono text-sm"
          >
            {output.length === 0 ? (
              <p className="text-gray-500">
                {pyodide
                  ? "Selecione um script e clique em Executar"
                  : "Carregue o Python primeiro"}
              </p>
            ) : (
              output.map((line, i) => (
                <div
                  key={i}
                  className={`whitespace-pre-wrap ${
                    line.type === "error"
                      ? "text-red-400"
                      : line.type === "info"
                      ? "text-gray-500"
                      : "text-green-400"
                  }`}
                >
                  {line.text}
                </div>
              ))
            )}
            {running && (
              <div className="text-yellow-400 animate-pulse">Executando...</div>
            )}
          </div>

          {/* Limitations notice */}
          <p className="text-xs text-gray-400 mt-3">
            Algumas bibliotecas (anthropic, requests) não funcionam no browser.
            Scripts com APIs externas mostrarão versões simuladas.
          </p>
        </div>
      </div>
    </div>
  );
}
