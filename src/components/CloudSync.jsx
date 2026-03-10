import { useState, useEffect } from "react";
import { Card, Button } from "./ui";
import { isSupabaseConfigured, getUserId } from "../lib/supabase";
import { syncAllToCloud, loadAllFromCloud, getSyncStatus } from "../lib/sync";

/**
 * Componente de sincronização com a nuvem
 */
export default function CloudSync() {
  const [status, setStatus] = useState({ configured: false, lastSync: null });
  const [syncing, setSyncing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    const s = await getSyncStatus();
    setStatus(s);
  };

  const handleSync = async () => {
    setSyncing(true);
    setMessage(null);

    try {
      const result = await syncAllToCloud();
      if (result.success) {
        setMessage({ type: "success", text: "Dados sincronizados com sucesso!" });
        await checkStatus();
      } else {
        setMessage({ type: "error", text: "Erro ao sincronizar" });
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }

    setSyncing(false);
  };

  const handleLoad = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const result = await loadAllFromCloud();
      if (result.success) {
        setMessage({ type: "success", text: "Dados carregados! Recarregue a página." });
      } else {
        setMessage({ type: "error", text: "Erro ao carregar dados" });
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }

    setLoading(false);
  };

  const formatDate = (date) => {
    if (!date) return "Nunca";
    return new Date(date).toLocaleString("pt-BR");
  };

  const userId = getUserId();

  if (!status.configured) {
    return (
      <Card>
        <Card.Header>
          <span className="font-medium">☁️ Sincronização na Nuvem</span>
        </Card.Header>
        <Card.Body className="space-y-4">
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
              Supabase não configurado
            </p>
            <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
              Para habilitar a sincronização na nuvem:
            </p>
            <ol className="text-xs text-yellow-700 dark:text-yellow-300 mt-2 list-decimal ml-4 space-y-1">
              <li>Crie uma conta em supabase.com</li>
              <li>Crie um novo projeto</li>
              <li>Execute o SQL de criação da tabela (veja docs/SETUP.md)</li>
              <li>Copie URL e anon key em Settings &gt; API</li>
              <li>Crie .env.local com VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY</li>
            </ol>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Seus dados estão salvos localmente no navegador (localStorage).
          </p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header>
        <span className="font-medium">☁️ Sincronização na Nuvem</span>
      </Card.Header>
      <Card.Body className="space-y-4">
        {/* Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Supabase conectado
            </span>
          </div>
          <span className="text-xs text-gray-400">
            ID: {userId.slice(0, 8)}...
          </span>
        </div>

        {/* Last sync */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium">Última sincronização:</span>{" "}
          {formatDate(status.lastSync)}
        </div>

        {/* Message */}
        {message && (
          <div
            className={`p-3 rounded-lg text-sm ${
              message.type === "success"
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={handleSync}
            disabled={syncing || loading}
            className="flex-1"
          >
            {syncing ? "Sincronizando..." : "⬆️ Enviar para Nuvem"}
          </Button>
          <Button
            variant="ghost"
            onClick={handleLoad}
            disabled={syncing || loading}
            className="flex-1"
          >
            {loading ? "Carregando..." : "⬇️ Baixar da Nuvem"}
          </Button>
        </div>

        <p className="text-xs text-gray-400">
          A sincronização é manual. Seus dados locais serão mesclados com a nuvem.
        </p>
      </Card.Body>
    </Card>
  );
}
