import { COMMON_STYLES } from "../../constants/theme";

/**
 * Componente de card reutilizavel.
 *
 * @param {Object} props
 * @param {boolean} [props.hoverable=false] - Adiciona efeito hover
 * @param {string} [props.className] - Classes CSS adicionais
 * @param {React.ReactNode} props.children - Conteudo do card
 *
 * @example
 * <Card>
 *   <h3>Titulo</h3>
 *   <p>Conteudo do card</p>
 * </Card>
 *
 * <Card hoverable className="p-4">
 *   Conteudo com hover
 * </Card>
 */
export default function Card({
  hoverable = false,
  className = "",
  children,
  ...props
}) {
  const hoverStyles = hoverable ? COMMON_STYLES.cardHover : "";

  return (
    <div
      className={`${COMMON_STYLES.card} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Header do card com estilo padronizado.
 */
Card.Header = function CardHeader({ className = "", children, ...props }) {
  return (
    <div
      className={`px-4 py-3 border-b border-gray-200 dark:border-gray-700 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Corpo do card com padding padrao.
 */
Card.Body = function CardBody({ className = "", children, ...props }) {
  return (
    <div className={`p-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

/**
 * Footer do card com estilo padronizado.
 */
Card.Footer = function CardFooter({ className = "", children, ...props }) {
  return (
    <div
      className={`px-4 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
