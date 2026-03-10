import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

export default function NotesEditor({ value, onChange, weekNumber }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value || "");
  const textareaRef = useRef(null);

  useEffect(() => {
    setLocalValue(value || "");
  }, [value]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      // Auto-resize textarea
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [isEditing]);

  const handleChange = (e) => {
    setLocalValue(e.target.value);
    // Auto-resize textarea
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const handleBlur = () => {
    onChange(localValue);
  };

  const handleKeyDown = (e) => {
    // Ctrl/Cmd + Enter para salvar e sair do modo edição
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      onChange(localValue);
      setIsEditing(false);
    }
    // Tab para inserir espaços
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newValue = localValue.substring(0, start) + "  " + localValue.substring(end);
      setLocalValue(newValue);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
    }
  };

  const insertMarkdown = (syntax, placeholder = "") => {
    if (!textareaRef.current) return;

    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selectedText = localValue.substring(start, end) || placeholder;

    let newText = "";
    let cursorOffset = 0;

    switch (syntax) {
      case "bold":
        newText = `**${selectedText}**`;
        cursorOffset = selectedText === placeholder ? 2 : newText.length;
        break;
      case "italic":
        newText = `*${selectedText}*`;
        cursorOffset = selectedText === placeholder ? 1 : newText.length;
        break;
      case "code":
        newText = `\`${selectedText}\``;
        cursorOffset = selectedText === placeholder ? 1 : newText.length;
        break;
      case "codeblock":
        newText = `\n\`\`\`\n${selectedText}\n\`\`\`\n`;
        cursorOffset = 5;
        break;
      case "link":
        newText = `[${selectedText}](url)`;
        cursorOffset = newText.length - 1;
        break;
      case "list":
        newText = `\n- ${selectedText}`;
        cursorOffset = newText.length;
        break;
      case "checkbox":
        newText = `\n- [ ] ${selectedText}`;
        cursorOffset = newText.length;
        break;
      case "h2":
        newText = `\n## ${selectedText}`;
        cursorOffset = newText.length;
        break;
      case "h3":
        newText = `\n### ${selectedText}`;
        cursorOffset = newText.length;
        break;
      default:
        return;
    }

    const finalValue = localValue.substring(0, start) + newText + localValue.substring(end);
    setLocalValue(finalValue);

    setTimeout(() => {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + cursorOffset;
    }, 0);
  };

  const hasContent = localValue && localValue.trim().length > 0;

  return (
    <div className="mt-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 transition-colors"
        >
          <span>{isExpanded ? "📝" : "📓"}</span>
          <span>Anotações da Semana {weekNumber}</span>
          {hasContent && !isExpanded && (
            <span className="text-xs bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 px-2 py-0.5 rounded-full">
              Com notas
            </span>
          )}
          <span className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}>
            ▼
          </span>
        </button>

        {isExpanded && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors ${
                isEditing
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {isEditing ? "Preview" : "Editar"}
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800">
          {/* Toolbar */}
          {isEditing && (
            <div className="flex flex-wrap items-center gap-1 px-3 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => insertMarkdown("h2", "Título")}
                className="px-2 py-1 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                title="Título (H2)"
              >
                H2
              </button>
              <button
                onClick={() => insertMarkdown("h3", "Subtítulo")}
                className="px-2 py-1 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                title="Subtítulo (H3)"
              >
                H3
              </button>
              <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1" />
              <button
                onClick={() => insertMarkdown("bold", "texto")}
                className="px-2 py-1 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                title="Negrito (Ctrl+B)"
              >
                B
              </button>
              <button
                onClick={() => insertMarkdown("italic", "texto")}
                className="px-2 py-1 text-xs italic text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                title="Itálico (Ctrl+I)"
              >
                I
              </button>
              <button
                onClick={() => insertMarkdown("code", "código")}
                className="px-2 py-1 text-xs font-mono text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                title="Código inline"
              >
                {"</>"}
              </button>
              <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1" />
              <button
                onClick={() => insertMarkdown("list", "item")}
                className="px-2 py-1 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                title="Lista"
              >
                • Lista
              </button>
              <button
                onClick={() => insertMarkdown("checkbox", "tarefa")}
                className="px-2 py-1 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                title="Checkbox"
              >
                ☐ Check
              </button>
              <button
                onClick={() => insertMarkdown("link", "texto")}
                className="px-2 py-1 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                title="Link"
              >
                🔗
              </button>
              <button
                onClick={() => insertMarkdown("codeblock", "código")}
                className="px-2 py-1 text-xs font-mono text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                title="Bloco de código"
              >
                {"```"}
              </button>
              <div className="flex-1" />
              <span className="text-[10px] text-gray-400 dark:text-gray-500">
                Ctrl+Enter para salvar
              </span>
            </div>
          )}

          {/* Editor or Preview */}
          <div className={`${isExpanded ? "min-h-[200px]" : ""}`}>
            {isEditing ? (
              <textarea
                ref={textareaRef}
                value={localValue}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder={`# Anotações da Semana ${weekNumber}

## Recursos utilizados
- Link do curso/vídeo
- Artigo interessante

## Dificuldades encontradas
- Ponto 1
- Ponto 2

## Conquistas
- [x] Completei o módulo X
- [ ] Ainda preciso revisar Y

## Código/Snippets importantes
\`\`\`javascript
// seu código aqui
\`\`\`
`}
                className="w-full min-h-[200px] p-4 text-sm text-gray-700 dark:text-gray-200 dark:bg-gray-800 font-mono resize-none focus:outline-none placeholder-gray-300 dark:placeholder-gray-600"
                style={{ height: "auto" }}
              />
            ) : (
              <div className="p-4 min-h-[200px]">
                {hasContent ? (
                  <div className="prose prose-sm max-w-none prose-headings:font-bold prose-headings:text-gray-800 dark:prose-headings:text-gray-100 prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-700 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-li:text-gray-600 dark:prose-li:text-gray-300 prose-strong:text-gray-800 dark:prose-strong:text-gray-100">
                    <ReactMarkdown
                      components={{
                        // Custom checkbox rendering
                        li: ({ children, ...props }) => {
                          const text = String(children);
                          if (text.startsWith("[ ] ")) {
                            return (
                              <li {...props} className="flex items-start gap-2 list-none">
                                <span className="mt-1">☐</span>
                                <span>{text.slice(4)}</span>
                              </li>
                            );
                          }
                          if (text.startsWith("[x] ") || text.startsWith("[X] ")) {
                            return (
                              <li {...props} className="flex items-start gap-2 list-none">
                                <span className="mt-1 text-green-500">☑</span>
                                <span className="line-through text-gray-400">{text.slice(4)}</span>
                              </li>
                            );
                          }
                          return <li {...props}>{children}</li>;
                        },
                      }}
                    >
                      {localValue}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500 py-8">
                    <span className="text-3xl mb-2">📝</span>
                    <p className="text-sm">Nenhuma anotação ainda</p>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="mt-2 text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Clique em &quot;Editar&quot; para começar
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {hasContent && (
            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {localValue.length} caracteres
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                Markdown suportado
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
