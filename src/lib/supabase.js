import { createClient } from "@supabase/supabase-js";

/**
 * Configuração do Supabase
 *
 * Para configurar:
 * 1. Crie uma conta em https://supabase.com
 * 2. Crie um novo projeto
 * 3. Vá em Settings > API
 * 4. Copie a URL e a anon key
 * 5. Crie um arquivo .env.local com:
 *    VITE_SUPABASE_URL=sua_url
 *    VITE_SUPABASE_ANON_KEY=sua_key
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Cliente Supabase (null se não configurado)
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

/**
 * Verifica se o Supabase está configurado
 */
export const isSupabaseConfigured = () => {
  return supabase !== null;
};

/**
 * Obtém ou cria um ID único para o usuário (anônimo)
 */
export const getUserId = () => {
  let userId = localStorage.getItem("study-tracker-user-id");
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem("study-tracker-user-id", userId);
  }
  return userId;
};
