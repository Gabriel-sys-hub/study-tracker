/**
 * ARQUIVO GERADO AUTOMATICAMENTE
 * Nao edite manualmente - use: npm run generate:modules
 *
 * Gerado em: 2026-03-11T11:39:43.231Z
 */

// Self-Attention
import self_attention from "../estudos/semana-01-arquitetura-llms/01-self-attention/self_attention.py?raw";
import self_attention_explicado from "../estudos/semana-01-arquitetura-llms/01-self-attention/self_attention_explicado.py?raw";
import self_attention_visual from "../estudos/semana-01-arquitetura-llms/01-self-attention/self_attention_visual.py?raw";
import self_attention_readme from "../estudos/semana-01-arquitetura-llms/01-self-attention/README.md?raw";

// Word Embeddings
import embedding_aprendizado from "../estudos/semana-01-arquitetura-llms/02-embeddings/embedding_aprendizado.py?raw";
import embedding_calculo from "../estudos/semana-01-arquitetura-llms/02-embeddings/embedding_calculo.py?raw";
import word_embedding_explicado from "../estudos/semana-01-arquitetura-llms/02-embeddings/word_embedding_explicado.py?raw";
import embeddings_readme from "../estudos/semana-01-arquitetura-llms/02-embeddings/README.md?raw";

// Context Window
import context_window_explicado from "../estudos/semana-01-arquitetura-llms/03-context-window/context_window_explicado.py?raw";
import context_window_readme from "../estudos/semana-01-arquitetura-llms/03-context-window/README.md?raw";

// Parametros de Geracao
import claude_api_top_p from "../estudos/semana-01-arquitetura-llms/04-parametros-api/claude_api_top_p.py?raw";
import top_p_explicado from "../estudos/semana-01-arquitetura-llms/04-parametros-api/top_p_explicado.py?raw";
import parametros_api_readme from "../estudos/semana-01-arquitetura-llms/04-parametros-api/README.md?raw";

export const studyModules = [
  {
    id: "self-attention",
    title: "Self-Attention",
    description: "O mecanismo de atencao que permite tokens se relacionarem",
    icon: "🧠",
    color: "blue",
    week: 1,
    readme: self_attention_readme,
    scripts: [
      {
        name: "self_attention.py",
        description: "Implementação simplificada de Self-Attention em Python.",
        code: self_attention,
        difficulty: "medium",
      },
      {
        name: "self_attention_explicado.py",
        description: "Self-Attention EXPLICADO passo a passo.",
        code: self_attention_explicado,
        difficulty: "easy",
      },
      {
        name: "self_attention_visual.py",
        description: "Self-Attention com Visualização Interativa.",
        code: self_attention_visual,
        difficulty: "medium",
      },
    ],
  },
  {
    id: "embeddings",
    title: "Word Embeddings",
    description: "Como palavras viram vetores numericos",
    icon: "📊",
    color: "purple",
    week: 1,
    readme: embeddings_readme,
    scripts: [
      {
        name: "embedding_aprendizado.py",
        description: "Como os embeddings sao APRENDIDOS - Simulacao simplificada",
        code: embedding_aprendizado,
        difficulty: "hard",
      },
      {
        name: "embedding_calculo.py",
        description: "Como o vetor de \\'Eu\\' eh calculado - passo a passo",
        code: embedding_calculo,
        difficulty: "medium",
      },
      {
        name: "word_embedding_explicado.py",
        description: "Como palavras viram numeros (Word Embedding) - Explicacao passo a passo",
        code: word_embedding_explicado,
        difficulty: "easy",
      },
    ],
  },
  {
    id: "context-window",
    title: "Context Window",
    description: "A memoria de curto prazo dos LLMs",
    icon: "🪟",
    color: "green",
    week: 1,
    readme: context_window_readme,
    scripts: [
      {
        name: "context_window_explicado.py",
        description: "Como a CONTEXT WINDOW afeta a qualidade das respostas",
        code: context_window_explicado,
        difficulty: "easy",
      },
    ],
  },
  {
    id: "parametros-api",
    title: "Parametros de Geracao",
    description: "top_p e temperature para controlar criatividade",
    icon: "🎛️",
    color: "orange",
    week: 1,
    readme: parametros_api_readme,
    scripts: [
      {
        name: "claude_api_top_p.py",
        description: "Exemplo de uso da API do Claude com diferentes valores de top_p",
        code: claude_api_top_p,
        difficulty: "medium",
      },
      {
        name: "top_p_explicado.py",
        description: "TOP_P (Nucleus Sampling): Como afeta a geracao de texto",
        code: top_p_explicado,
        difficulty: "easy",
      },
    ],
  },
];

export const getModuleById = (id) => studyModules.find((m) => m.id === id);
