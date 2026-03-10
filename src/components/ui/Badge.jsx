import { STATUS_CONFIG, DIFFICULTY_CONFIG, CATEGORY_COLORS } from "../../constants/theme";

/**
 * Componente de badge/tag reutilizavel.
 *
 * @param {Object} props
 * @param {'status' | 'difficulty' | 'category' | 'custom'} [props.type='custom'] - Tipo de badge
 * @param {string} [props.value] - Valor para tipos pre-definidos (status, difficulty, category)
 * @param {string} [props.className] - Classes CSS para tipo custom
 * @param {React.ReactNode} props.children - Conteudo do badge
 *
 * @example
 * // Badge de status
 * <Badge type="status" value="done" />
 *
 * // Badge de dificuldade
 * <Badge type="difficulty" value="easy" />
 *
 * // Badge de categoria
 * <Badge type="category" value="blue">Mes 1</Badge>
 *
 * // Badge customizado
 * <Badge className="bg-purple-100 text-purple-700">Custom</Badge>
 */
export default function Badge({
  type = "custom",
  value,
  className = "",
  children,
  ...props
}) {
  const baseStyles = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium";

  let typeStyles = "";
  let content = children;

  switch (type) {
    case "status": {
      const config = STATUS_CONFIG[value];
      if (config) {
        typeStyles = config.className;
        content = content || `${config.emoji} ${config.label}`;
      }
      break;
    }
    case "difficulty": {
      const config = DIFFICULTY_CONFIG[value];
      if (config) {
        typeStyles = `border ${config.className}`;
        content = content || config.label;
      }
      break;
    }
    case "category": {
      const config = CATEGORY_COLORS[value];
      if (config) {
        typeStyles = config.badge;
      }
      break;
    }
    default:
      typeStyles = className;
  }

  return (
    <span
      className={`${baseStyles} ${typeStyles} ${type === "custom" ? className : ""}`}
      {...props}
    >
      {content}
    </span>
  );
}
