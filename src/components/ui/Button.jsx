import { COMMON_STYLES } from "../../constants/theme";

/**
 * Componente de botao reutilizavel com variantes de estilo.
 *
 * @param {Object} props
 * @param {'primary' | 'secondary' | 'ghost'} [props.variant='primary'] - Variante visual do botao
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Tamanho do botao
 * @param {string} [props.className] - Classes CSS adicionais
 * @param {React.ReactNode} props.children - Conteudo do botao
 *
 * @example
 * <Button variant="primary" onClick={handleClick}>
 *   Salvar
 * </Button>
 *
 * <Button variant="secondary" size="sm">
 *   Cancelar
 * </Button>
 */
export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) {
  const baseStyles = "rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";

  const sizeStyles = {
    sm: "px-2 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const variantStyles = COMMON_STYLES.button[variant] || COMMON_STYLES.button.primary;

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
