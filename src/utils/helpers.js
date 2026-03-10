/**
 * Funcoes utilitarias gerais.
 */

/**
 * Concatena classes CSS condicionalmente.
 *
 * @param {...(string | boolean | undefined | null)} classes - Classes a concatenar
 * @returns {string} - Classes concatenadas
 *
 * @example
 * cn('base-class', isActive && 'active', hasError && 'error')
 * // => 'base-class active' (se isActive=true, hasError=false)
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Calcula porcentagem.
 *
 * @param {number} value - Valor atual
 * @param {number} total - Total
 * @returns {number} - Porcentagem arredondada
 *
 * @example
 * percentage(3, 10) // => 30
 */
export function percentage(value, total) {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Debounce de funcao.
 *
 * @param {Function} func - Funcao a ser executada
 * @param {number} wait - Tempo de espera em ms
 * @returns {Function} - Funcao com debounce
 *
 * @example
 * const debouncedSave = debounce(saveData, 300);
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Formata data para exibicao.
 *
 * @param {Date | string} date - Data a formatar
 * @param {string} [locale='pt-BR'] - Locale para formatacao
 * @returns {string} - Data formatada
 *
 * @example
 * formatDate(new Date()) // => '10/03/2026'
 */
export function formatDate(date, locale = "pt-BR") {
  return new Date(date).toLocaleDateString(locale);
}

/**
 * Gera um ID unico simples.
 *
 * @returns {string} - ID unico
 *
 * @example
 * generateId() // => 'abc123xyz'
 */
export function generateId() {
  return Math.random().toString(36).substring(2, 11);
}

/**
 * Pluraliza palavra baseado na quantidade.
 *
 * @param {number} count - Quantidade
 * @param {string} singular - Forma singular
 * @param {string} [plural] - Forma plural (default: singular + 's')
 * @returns {string} - Palavra pluralizada com quantidade
 *
 * @example
 * pluralize(1, 'item') // => '1 item'
 * pluralize(5, 'item') // => '5 itens'
 * pluralize(2, 'artigo', 'artigos') // => '2 artigos'
 */
export function pluralize(count, singular, plural) {
  const pluralForm = plural || singular + "s";
  return `${count} ${count === 1 ? singular : pluralForm}`;
}
