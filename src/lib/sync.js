import { supabase, isSupabaseConfigured, getUserId } from "./supabase";

/**
 * Serviço de sincronização com Supabase
 * Sincroniza dados do localStorage com o banco de dados
 */

const SYNC_KEYS = [
  "study-tracker-v1",
  "study-tracker-goals",
  "study-tracker-flashcards",
  "study-tracker-quiz",
  "study-tracker-resources",
];

/**
 * Salva dados no Supabase
 */
export async function syncToCloud(key, data) {
  if (!isSupabaseConfigured()) return { success: false, error: "Supabase não configurado" };

  try {
    const userId = getUserId();

    const { error } = await supabase
      .from("user_data")
      .upsert(
        {
          user_id: userId,
          data_key: key,
          data_value: data,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,data_key",
        }
      );

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Erro ao sincronizar:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Carrega dados do Supabase
 */
export async function loadFromCloud(key) {
  if (!isSupabaseConfigured()) return { success: false, data: null };

  try {
    const userId = getUserId();

    const { data, error } = await supabase
      .from("user_data")
      .select("data_value, updated_at")
      .eq("user_id", userId)
      .eq("data_key", key)
      .single();

    if (error && error.code !== "PGRST116") throw error; // PGRST116 = not found

    return { success: true, data: data?.data_value || null, updatedAt: data?.updated_at };
  } catch (error) {
    console.error("Erro ao carregar:", error);
    return { success: false, data: null, error: error.message };
  }
}

/**
 * Sincroniza todos os dados do localStorage para o Supabase
 */
export async function syncAllToCloud() {
  if (!isSupabaseConfigured()) return { success: false };

  const results = [];

  for (const key of SYNC_KEYS) {
    const localData = localStorage.getItem(key);
    if (localData) {
      const result = await syncToCloud(key, JSON.parse(localData));
      results.push({ key, ...result });
    }
  }

  return { success: results.every((r) => r.success), results };
}

/**
 * Carrega todos os dados do Supabase para o localStorage
 */
export async function loadAllFromCloud() {
  if (!isSupabaseConfigured()) return { success: false };

  const results = [];

  for (const key of SYNC_KEYS) {
    const result = await loadFromCloud(key);
    if (result.success && result.data) {
      localStorage.setItem(key, JSON.stringify(result.data));
      results.push({ key, ...result });
    }
  }

  return { success: true, results };
}

/**
 * Obtém status da última sincronização
 */
export async function getSyncStatus() {
  if (!isSupabaseConfigured()) {
    return { configured: false, lastSync: null };
  }

  try {
    const userId = getUserId();

    const { data, error } = await supabase
      .from("user_data")
      .select("updated_at")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    return {
      configured: true,
      lastSync: data?.updated_at ? new Date(data.updated_at) : null,
    };
  } catch (error) {
    return { configured: true, lastSync: null, error: error.message };
  }
}
