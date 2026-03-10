import { useState, useEffect } from "react";
import { Card, Button } from "./ui";
import { loadFromStorage, saveToStorage } from "../utils";

const STORAGE_KEY = "study-tracker-quiz";

/**
 * Banco de perguntas por semana/tópico
 * Formato: { weekId: [{ question, options, correct, explanation }] }
 */
const defaultQuestions = {
  1: [
    {
      id: "w1q1",
      question: "O que é Self-Attention em Transformers?",
      options: [
        "Um mecanismo que permite tokens se relacionarem entre si",
        "Uma técnica de compressão de dados",
        "Um tipo de função de ativação",
        "Um método de tokenização",
      ],
      correct: 0,
      explanation: "Self-Attention permite que cada token \"preste atenção\" a todos os outros tokens da sequência, capturando dependências de longo alcance.",
    },
    {
      id: "w1q2",
      question: "O que representa a Context Window de um LLM?",
      options: [
        "O tamanho máximo do modelo em GB",
        "A quantidade máxima de tokens que o modelo pode processar de uma vez",
        "O número de layers do transformer",
        "A velocidade de inferência",
      ],
      correct: 1,
      explanation: "Context Window é o limite de tokens que o modelo consegue \"ver\" simultaneamente, afetando sua capacidade de manter contexto.",
    },
    {
      id: "w1q3",
      question: "O que o parâmetro temperature controla na geração?",
      options: [
        "Velocidade de processamento",
        "Uso de memória",
        "Aleatoriedade/criatividade das respostas",
        "Tamanho do output",
      ],
      correct: 2,
      explanation: "Temperature alta = mais criativo/aleatório. Temperature baixa = mais determinístico/focado.",
    },
    {
      id: "w1q4",
      question: "O que são embeddings?",
      options: [
        "Tipos de modelos de linguagem",
        "Representações vetoriais de palavras/tokens",
        "Técnicas de fine-tuning",
        "Métodos de compressão",
      ],
      correct: 1,
      explanation: "Embeddings convertem palavras em vetores numéricos que capturam significado semântico.",
    },
  ],
  2: [
    {
      id: "w2q1",
      question: "O que é Zero-shot prompting?",
      options: [
        "Usar o modelo sem exemplos",
        "Dar muitos exemplos ao modelo",
        "Treinar o modelo do zero",
        "Usar temperatura zero",
      ],
      correct: 0,
      explanation: "Zero-shot é pedir ao modelo para realizar uma tarefa sem fornecer exemplos no prompt.",
    },
    {
      id: "w2q2",
      question: "O que é Chain-of-Thought (CoT)?",
      options: [
        "Uma técnica de encadeamento de modelos",
        "Pedir ao modelo para explicar seu raciocínio passo a passo",
        "Um tipo de fine-tuning",
        "Uma métrica de avaliação",
      ],
      correct: 1,
      explanation: "CoT faz o modelo \"pensar em voz alta\", melhorando respostas em problemas complexos.",
    },
    {
      id: "w2q3",
      question: "O que é Few-shot prompting?",
      options: [
        "Usar poucos tokens no prompt",
        "Dar alguns exemplos antes da tarefa",
        "Treinar com poucos dados",
        "Usar modelo pequeno",
      ],
      correct: 1,
      explanation: "Few-shot fornece alguns exemplos no prompt para guiar o modelo na tarefa desejada.",
    },
  ],
  3: [
    {
      id: "w3q1",
      question: "O que é SSE (Server-Sent Events)?",
      options: [
        "Um tipo de banco de dados",
        "Protocolo para streaming de dados do servidor",
        "Um framework de frontend",
        "Uma técnica de caching",
      ],
      correct: 1,
      explanation: "SSE permite streaming unidirecional do servidor, ideal para respostas de LLM em tempo real.",
    },
    {
      id: "w3q2",
      question: "O que é Prompt Caching?",
      options: [
        "Salvar respostas anteriores",
        "Reutilizar prefixos de prompt para economizar tokens",
        "Comprimir prompts longos",
        "Memorizar conversas",
      ],
      correct: 1,
      explanation: "Prompt Caching (como o da Anthropic) reutiliza partes do prompt, reduzindo custo e latência.",
    },
  ],
  4: [
    {
      id: "w4q1",
      question: "O que é Tool Use / Function Calling?",
      options: [
        "Chamar APIs externas diretamente",
        "O LLM decidir qual ferramenta usar e gerar os parâmetros",
        "Executar código Python no LLM",
        "Uma técnica de fine-tuning",
      ],
      correct: 1,
      explanation: "Tool Use permite que o LLM \"decida\" usar ferramentas, gerando chamadas estruturadas que seu código executa.",
    },
    {
      id: "w4q2",
      question: "Qual formato é usado para definir ferramentas em APIs de LLM?",
      options: [
        "YAML",
        "JSON Schema",
        "XML",
        "GraphQL",
      ],
      correct: 1,
      explanation: "JSON Schema define a estrutura das ferramentas: nome, descrição e parâmetros esperados.",
    },
  ],
  5: [
    {
      id: "w5q1",
      question: "O que é similaridade cosseno?",
      options: [
        "Uma função de ativação",
        "Medida de similaridade entre vetores baseada no ângulo",
        "Um tipo de embedding",
        "Uma técnica de chunking",
      ],
      correct: 1,
      explanation: "Similaridade cosseno mede o ângulo entre vetores: 1 = idênticos, 0 = ortogonais, -1 = opostos.",
    },
    {
      id: "w5q2",
      question: "O que é chunking em RAG?",
      options: [
        "Comprimir documentos",
        "Dividir textos em partes menores para indexação",
        "Combinar embeddings",
        "Filtrar resultados",
      ],
      correct: 1,
      explanation: "Chunking divide documentos em chunks menores que cabem no contexto e podem ser buscados.",
    },
  ],
  6: [
    {
      id: "w6q1",
      question: "O que é RAG (Retrieval-Augmented Generation)?",
      options: [
        "Um tipo de modelo de linguagem",
        "Combinar busca de documentos com geração de texto",
        "Uma técnica de fine-tuning",
        "Um banco de dados vetorial",
      ],
      correct: 1,
      explanation: "RAG busca informações relevantes e as adiciona ao contexto do LLM para respostas mais precisas.",
    },
    {
      id: "w6q2",
      question: "O que é Hybrid Search?",
      options: [
        "Buscar em múltiplos bancos",
        "Combinar busca por keywords (BM25) com busca semântica (embeddings)",
        "Usar múltiplos modelos",
        "Buscar em tempo real",
      ],
      correct: 1,
      explanation: "Hybrid Search combina o melhor de busca lexical (exata) com semântica (significado).",
    },
  ],
  7: [
    {
      id: "w7q1",
      question: "O que é o padrão ReAct em agentes?",
      options: [
        "Um framework de frontend",
        "Combinar Reasoning (raciocínio) com Acting (ação)",
        "Um tipo de modelo",
        "Uma biblioteca Python",
      ],
      correct: 1,
      explanation: "ReAct alterna entre pensar sobre o problema e tomar ações, permitindo agentes mais robustos.",
    },
    {
      id: "w7q2",
      question: "O que é Human-in-the-loop?",
      options: [
        "Treinar com dados humanos",
        "Incluir aprovação/feedback humano no fluxo do agente",
        "Um tipo de interface",
        "Avaliação manual",
      ],
      correct: 1,
      explanation: "Human-in-the-loop permite supervisão humana em decisões críticas do agente.",
    },
  ],
};

export default function Quiz() {
  const [stats, setStats] = useState(() => loadFromStorage(STORAGE_KEY, { answered: {}, correct: 0, total: 0 }));
  const [mode, setMode] = useState("menu"); // "menu" | "quiz" | "results"
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [sessionCorrect, setSessionCorrect] = useState(0);

  useEffect(() => {
    saveToStorage(STORAGE_KEY, stats);
  }, [stats]);

  const startQuiz = (week) => {
    const questions = defaultQuestions[week] || [];
    if (questions.length === 0) return;

    // Shuffle questions
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setCurrentQuestions(shuffled);
    setSelectedWeek(week);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setSessionCorrect(0);
    setMode("quiz");
  };

  const startAllQuiz = () => {
    const allQuestions = Object.values(defaultQuestions).flat();
    const shuffled = allQuestions.sort(() => Math.random() - 0.5).slice(0, 10);
    setCurrentQuestions(shuffled);
    setSelectedWeek(null);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setSessionCorrect(0);
    setMode("quiz");
  };

  const handleAnswer = (index) => {
    if (selectedAnswer !== null) return;

    const question = currentQuestions[currentIndex];
    const isCorrect = index === question.correct;

    setSelectedAnswer(index);
    setShowExplanation(true);

    if (isCorrect) {
      setSessionCorrect((prev) => prev + 1);
    }

    setStats((prev) => ({
      ...prev,
      answered: { ...prev.answered, [question.id]: isCorrect },
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      total: prev.total + 1,
    }));
  };

  const nextQuestion = () => {
    if (currentIndex < currentQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setMode("results");
    }
  };

  const availableWeeks = Object.keys(defaultQuestions).map(Number).sort((a, b) => a - b);
  const totalQuestions = Object.values(defaultQuestions).flat().length;

  // Results screen
  if (mode === "results") {
    const percentage = Math.round((sessionCorrect / currentQuestions.length) * 100);

    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Card>
          <Card.Body className="text-center py-12">
            <p className="text-6xl mb-4">
              {percentage >= 80 ? "🎉" : percentage >= 50 ? "👍" : "📚"}
            </p>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              Quiz Finalizado!
            </h2>
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {sessionCorrect} / {currentQuestions.length}
            </p>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {percentage}% de acertos
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="ghost" onClick={() => setMode("menu")}>
                Voltar ao Menu
              </Button>
              <Button onClick={() => startQuiz(selectedWeek || availableWeeks[0])}>
                Tentar Novamente
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  }

  // Quiz screen
  if (mode === "quiz" && currentQuestions.length > 0) {
    const question = currentQuestions[currentIndex];
    const progress = ((currentIndex + 1) / currentQuestions.length) * 100;

    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" onClick={() => setMode("menu")}>
            Sair
          </Button>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {currentIndex + 1} / {currentQuestions.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-6">
          <div
            className="h-2 bg-blue-500 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <Card>
          <Card.Body>
            <p className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-6">
              {question.question}
            </p>

            <div className="space-y-3">
              {question.options.map((option, idx) => {
                let className =
                  "w-full text-left px-4 py-3 rounded-lg border-2 transition-all ";

                if (selectedAnswer === null) {
                  className +=
                    "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 bg-white dark:bg-gray-800";
                } else if (idx === question.correct) {
                  className +=
                    "border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400";
                } else if (idx === selectedAnswer) {
                  className +=
                    "border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400";
                } else {
                  className +=
                    "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 opacity-50";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={selectedAnswer !== null}
                    className={className}
                  >
                    <span className="font-medium mr-2">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    {option}
                  </button>
                );
              })}
            </div>

            {showExplanation && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                  Explicação:
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  {question.explanation}
                </p>
              </div>
            )}

            {selectedAnswer !== null && (
              <Button onClick={nextQuestion} className="w-full mt-6">
                {currentIndex < currentQuestions.length - 1
                  ? "Próxima Pergunta"
                  : "Ver Resultado"}
              </Button>
            )}
          </Card.Body>
        </Card>
      </div>
    );
  }

  // Menu screen (default)
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
            Quiz
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {totalQuestions} perguntas disponíveis
          </p>
        </div>
        {stats.total > 0 && (
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Taxa de acerto geral
            </p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {Math.round((stats.correct / stats.total) * 100)}%
            </p>
          </div>
        )}
      </div>

      {/* All questions button */}
      <Card className="mb-6">
        <Card.Body className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800 dark:text-gray-100">
              Quiz Aleatório
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              10 perguntas de todas as semanas
            </p>
          </div>
          <Button onClick={startAllQuiz}>Iniciar</Button>
        </Card.Body>
      </Card>

      {/* By week */}
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
        Por Semana
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {availableWeeks.map((week) => {
          const questions = defaultQuestions[week] || [];
          const answered = questions.filter((q) => stats.answered[q.id] !== undefined).length;

          return (
            <Card key={week}>
              <Card.Body className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-100">
                    Semana {week}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {questions.length} perguntas
                    {answered > 0 && ` · ${answered} respondidas`}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => startQuiz(week)}
                  disabled={questions.length === 0}
                >
                  Iniciar
                </Button>
              </Card.Body>
            </Card>
          );
        })}
      </div>

      {/* Stats reset */}
      {stats.total > 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setStats({ answered: {}, correct: 0, total: 0 })}
            className="text-sm text-gray-400 hover:text-red-500 transition-colors"
          >
            Resetar estatísticas
          </button>
        </div>
      )}
    </div>
  );
}
