/**
 * Utilitarios para persistencia de dados no localStorage.
 */

/**
 * Salva dados no localStorage com tratamento de erro.
 *
 * @param {string} key - Chave de armazenamento
 * @param {*} value - Valor a ser salvo (sera convertido para JSON)
 * @returns {boolean} - true se salvou com sucesso
 *
 * @example
 * saveToStorage('user-prefs', { theme: 'dark', language: 'pt' });
 */
export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Erro ao salvar ${key}:`, error);
    return false;
  }
}

/**
 * Carrega dados do localStorage com tratamento de erro.
 *
 * @param {string} key - Chave de armazenamento
 * @param {*} [defaultValue=null] - Valor padrao se nao encontrar
 * @returns {*} - Valor armazenado ou defaultValue
 *
 * @example
 * const prefs = loadFromStorage('user-prefs', { theme: 'light' });
 */
export function loadFromStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Erro ao carregar ${key}:`, error);
    return defaultValue;
  }
}

/**
 * Remove dados do localStorage.
 *
 * @param {string} key - Chave a ser removida
 * @returns {boolean} - true se removeu com sucesso
 */
export function removeFromStorage(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Erro ao remover ${key}:`, error);
    return false;
  }
}
