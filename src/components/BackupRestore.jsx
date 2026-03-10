import { useState } from "react";
import { loadFromStorage, saveToStorage } from "../utils";

const STORAGE_KEY = "study-tracker-v1";

/**
 * Componente para backup e restauracao do progresso.
 */
export default function BackupRestore() {
  const [message, setMessage] = useState(null);

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleExport = () => {
    const data = loadFromStorage(STORAGE_KEY, { progress: {}, notes: {} });
    const exportData = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      data,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `study-tracker-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    showMessage("Backup exportado com sucesso!");
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);

        if (!imported.data || !imported.version) {
          throw new Error("Formato invalido");
        }

        saveToStorage(STORAGE_KEY, imported.data);
        showMessage("Backup restaurado! Recarregando...");

        setTimeout(() => window.location.reload(), 1500);
      } catch {
        showMessage("Erro ao importar arquivo", "error");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleReset = () => {
    if (confirm("Tem certeza? Todo o progresso sera perdido!")) {
      localStorage.removeItem(STORAGE_KEY);
      showMessage("Progresso resetado! Recarregando...");
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
        <span>💾</span> Backup & Restauracao
      </h3>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleExport}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          📤 Exportar Backup
        </button>

        <label className="px-4 py-2 text-sm font-medium rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors cursor-pointer">
          📥 Importar Backup
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </label>

        <button
          onClick={handleReset}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
        >
          🗑️ Resetar Tudo
        </button>
      </div>

      {message && (
        <div
          className={`mt-3 px-3 py-2 rounded-lg text-sm ${
            message.type === "error"
              ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
              : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
