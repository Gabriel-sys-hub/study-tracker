import { useState } from "react";
import TopicDetails from "./components/TopicDetails";
import NotesEditor from "./components/NotesEditor";
import StudyScripts from "./components/StudyScripts";
import Dashboard from "./components/Dashboard";
import Flashcards from "./components/Flashcards";
import Quiz from "./components/Quiz";
import PythonRunner from "./components/PythonRunner";
import DevNewsFeed from "./components/DevNewsFeed";
import GoalsStreaks from "./components/GoalsStreaks";
import ResourceLibrary from "./components/ResourceLibrary";
import Analytics from "./components/Analytics";
import Certificate from "./components/Certificate";
import { ThemeToggle } from "./components/ui";
import { CATEGORY_COLORS, STATUS_CONFIG } from "./constants/theme";
import { percentage, saveToStorage, loadFromStorage } from "./utils";

// Views configuration
const VIEWS = {
  main: [
    { id: "tracker", label: "Tracker", icon: "📊" },
    { id: "scripts", label: "Scripts", icon: "🐍" },
    { id: "dashboard", label: "Dashboard", icon: "🎯" },
  ],
  study: [
    { id: "flashcards", label: "Flashcards", icon: "🎴" },
    { id: "quiz", label: "Quiz", icon: "❓" },
    { id: "python", label: "Executar", icon: "▶️" },
  ],
  extras: [
    { id: "news", label: "Notícias", icon: "📰" },
    { id: "goals", label: "Metas", icon: "🔥" },
    { id: "resources", label: "Recursos", icon: "📚" },
    { id: "analytics", label: "Analytics", icon: "📈" },
    { id: "certificate", label: "Certificado", icon: "🏆" },
  ],
};

const STORAGE_KEY = "study-tracker-v1";

const plan = [
  {
    month: "Mês 1 — IA & LLMs", color: "blue", weeks: [
      { week: 1, title: "Arquitetura dos LLMs e APIs", topics: ["Transformers, embeddings, tokens", "Context window, temperatura, top-p/k", "Diferenças entre modelos (GPT-4o, Claude, Gemini)", "Tokenização na prática", "Explorar playgrounds (Anthropic + OpenAI)"] },
      { week: 2, title: "Prompt Engineering Avançado", topics: ["Zero-shot, Few-shot, Many-shot", "Chain-of-Thought e variações (CoT, Self-Consistency)", "Structured Outputs (JSON, XML)", "Prompt chaining", "Técnicas anti-alucinação"] },
      { week: 3, title: "APIs de LLMs na Prática", topics: ["Streaming de respostas (SSE)", "Multimodal (imagens, PDFs)", "Gerenciamento de histórico de conversa", "Rate limits e retry com backoff exponencial", "Prompt Caching da Anthropic"] },
      { week: 4, title: "Function Calling & Tool Use", topics: ["O que é Tool Use e por que é essencial", "Definir ferramentas com JSON Schema", "Fluxo: LLM decide → código executa → resultado volta", "Parallel tool use", "Projeto: API com tools sem frameworks"] },
    ]
  },
  {
    month: "Mês 2 — Agentes & RAG", color: "purple", weeks: [
      { week: 5, title: "Embeddings e Busca Vetorial", topics: ["O que são embeddings", "Modelos: Voyage AI, text-embedding-3-small, BGE", "Similaridade cosseno vs distância euclidiana", "Chunking strategies (fixed, recursive, semantic)", "Chunk overlap e metadata filtering"] },
      { week: 6, title: "Bancos Vetoriais e RAG Pipeline", topics: ["Comparativo: Pinecone, Qdrant, Chroma, pgvector", "RAG pipeline completo do zero", "Sparse vs Dense retrieval (BM25 vs embeddings)", "Hybrid search", "Reranking com Cross-encoders / Cohere"] },
      { week: 7, title: "Agentes: Arquiteturas e Patterns", topics: ["ReAct pattern (Reasoning + Acting)", "Tipos de memória (in-context, external, episodic)", "Multi-agent systems (orquestrador + subagentes)", "LangGraph, CrewAI, AutoGen", "Human-in-the-loop"] },
      { week: 8, title: "Avaliação, Observabilidade e Produção", topics: ["Métricas de RAG: precisão, recall, faithfulness", "RAGAS: avaliação automática", "Testes de regressão para LLMs", "Langfuse / LangSmith: tracing e observabilidade", "Guardrails e detecção de prompt injection"] },
    ]
  },
  {
    month: "Mês 3 — Cloud & Ferramentas", color: "green", weeks: [
      { week: 9, title: "AWS para IA e LLMs", topics: ["Amazon Bedrock (Claude, Titan, Llama na AWS)", "Lambda + API Gateway para APIs de LLM", "ECS/Fargate para containers", "S3 + DynamoDB + RDS", "CDK em TypeScript para infra como código"] },
      { week: 10, title: "Arquitetura de Sistemas com IA", topics: ["Event-driven com SQS, SNS, EventBridge", "Step Functions para orquestrar agentes", "Cache semântico com ElastiCache (Redis)", "Monitoramento de custos de tokens", "Deployment: blue/green, canary para LLMs"] },
      { week: 11, title: "Ferramentas de Dev com IA", topics: ["Cursor IDE: .cursorrules, Composer, contextos", "GitHub Copilot: customização por repositório", "Claude Code: automação via terminal e CI/CD", "v0 (Vercel) e Bolt.new para prototipagem", "Aider: pair programming open source"] },
      { week: 12, title: "FinOps, Segurança e Compliance", topics: ["Custo real por feature de IA", "Model routing com LiteLLM", "PII detection com Presidio (Microsoft)", "LGPD e dados de usuários com LLMs", "Ollama: LLMs on-premise"] },
    ]
  },
  {
    month: "Mês 4 — Full Stack Moderno", color: "orange", weeks: [
      { week: 13, title: "TypeScript Avançado", topics: ["Tipos condicionais e infer", "Mapped types e template literal types", "satisfies operator", "Branded types para segurança de domínio", "Type Challenges (nível médio)"] },
      { week: 14, title: "Next.js 15 e App Router", topics: ["Server Components vs Client Components", "Server Actions e mutations", "Partial Prerendering (PPR)", "Caching: full route, data cache, request memoization", "Streaming UI com Suspense para IA"] },
      { week: 15, title: "tRPC, Drizzle e Vercel AI SDK", topics: ["tRPC: procedures, middleware, autenticação", "Drizzle ORM: schema, migrations, performance", "Neon (Postgres serverless)", "Vercel AI SDK: useChat, streamText, generateObject", "Structured outputs com Zod + AI SDK"] },
      { week: 16, title: "Projeto Final e Deploy", topics: ["Autenticação com Clerk ou Auth.js v5", "Stripe + webhooks type-safe", "Upload com Uploadthing ou S3", "Email com Resend + React Email", "Deploy: Vercel + Sentry + Axiom"] },
    ]
  },
];

// Converter STATUS_CONFIG para formato de array para select
const statusOpts = Object.entries(STATUS_CONFIG).map(([val, config]) => ({
  val,
  label: config.label,
  emoji: config.emoji,
  cls: config.className,
}));

export default function App() {
  const [progress, setProgress] = useState(() => loadFromStorage(STORAGE_KEY, { progress: {}, notes: {} }).progress);
  const [notes, setNotes] = useState(() => loadFromStorage(STORAGE_KEY, { progress: {}, notes: {} }).notes);
  const [activeMonth, setActiveMonth] = useState(0);
  const [activeView, setActiveView] = useState("tracker"); // "tracker" | "scripts" | "dashboard" | "flashcards" | "quiz" | "python"

  const save = (p, n) => {
    saveToStorage(STORAGE_KEY, { progress: p, notes: n });
  };

  const setTopicStatus = (wk, ti, val) => {
    const k = `${wk}-${ti}`;
    const p = { ...progress, [k]: val };
    setProgress(p);
    save(p, notes);
  };

  const setNote = (wk, val) => {
    const n = { ...notes, [wk]: val };
    setNotes(n);
    save(progress, n);
  };

  const getStatus = (wk, ti) => progress[`${wk}-${ti}`] || "todo";

  const weekDone = (wk, topics) => topics.filter((_, i) => getStatus(wk, i) === "done").length;
  const weekTotal = (_, topics) => topics.length;

  const totalTopics = plan.flatMap(m => m.weeks).flatMap(w => w.topics).length;
  const doneTopic = Object.values(progress).filter(v => v === "done").length;
  const pct = percentage(doneTopic, totalTopics);

  const monthPct = (m) => {
    const topics = m.weeks.flatMap(w => w.topics);
    const done = m.weeks.flatMap(w => w.topics.map((_, i) => getStatus(w.week, i))).filter(v => v === "done").length;
    return percentage(done, topics.length);
  };

  const c = CATEGORY_COLORS[plan[activeMonth].color];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans transition-colors">
      {/* Header */}
      <div className="bg-gray-900 text-white px-6 py-5">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-bold">📚 Tracker de Estudos — Dev Avançado com IA</h1>
          <div className="flex items-center gap-2">
            {/* Main Navigation */}
            <div className="flex bg-gray-800 rounded-lg p-1 gap-0.5">
              {[...VIEWS.main, ...VIEWS.study].map((view) => (
                <button
                  key={view.id}
                  onClick={() => setActiveView(view.id)}
                  className={`px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeView === view.id
                      ? "bg-gray-700 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {view.icon}
                </button>
              ))}
            </div>
            {/* Extras Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium rounded-md bg-gray-800 text-gray-400 hover:text-white transition-colors">
                <span>Mais</span>
                <span className="text-[10px]">▼</span>
              </button>
              <div className="absolute right-0 top-full mt-1 bg-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 min-w-36">
                {VIEWS.extras.map((view) => (
                  <button
                    key={view.id}
                    onClick={() => setActiveView(view.id)}
                    className={`w-full px-3 py-2 text-xs text-left flex items-center gap-2 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                      activeView === view.id
                        ? "bg-gray-700 text-white"
                        : "text-gray-400 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <span>{view.icon}</span>
                    <span>{view.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
        <p className="text-gray-400 text-sm mb-4">4 meses · 16 semanas · {totalTopics} tópicos</p>
        {/* Overall progress */}
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-gray-700 rounded-full h-3">
            <div className="bg-green-400 h-3 rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-green-400 font-bold text-sm w-12 text-right">{pct}%</span>
        </div>
        <p className="text-gray-400 text-xs mt-1">{doneTopic} de {totalTopics} tópicos concluídos</p>
      </div>

      {activeView === "scripts" ? (
        <StudyScripts />
      ) : activeView === "dashboard" ? (
        <Dashboard totalTopics={totalTopics} completedTopics={doneTopic} />
      ) : activeView === "flashcards" ? (
        <Flashcards />
      ) : activeView === "quiz" ? (
        <Quiz />
      ) : activeView === "python" ? (
        <PythonRunner />
      ) : activeView === "news" ? (
        <DevNewsFeed />
      ) : activeView === "goals" ? (
        <GoalsStreaks totalTopics={totalTopics} completedTopics={doneTopic} />
      ) : activeView === "resources" ? (
        <ResourceLibrary />
      ) : activeView === "analytics" ? (
        <Analytics totalTopics={totalTopics} completedTopics={doneTopic} />
      ) : activeView === "certificate" ? (
        <Certificate totalTopics={totalTopics} completedTopics={doneTopic} />
      ) : (
        <>
          {/* Month tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-x-auto">
            {plan.map((m, mi) => {
              const mc = CATEGORY_COLORS[m.color];
              const mp = monthPct(m);
              return (
                <button key={mi} onClick={() => setActiveMonth(mi)}
                  className={`flex-1 min-w-max px-4 py-3 text-sm font-medium border-b-2 transition-all ${activeMonth === mi ? `border-current ${mc.text} bg-gray-50 dark:bg-gray-700` : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}>
                  <div>{m.month.split("—")[0].trim()}</div>
                  <div className="text-xs font-normal text-gray-400 dark:text-gray-500 mt-0.5">{mp}% concluído</div>
                </button>
              );
            })}
          </div>

          {/* Month content */}
      <div className="p-4 max-w-4xl mx-auto">
        <h2 className={`text-lg font-bold mb-4 ${c.text}`}>{plan[activeMonth].month}</h2>

        <div className="space-y-6">
          {plan[activeMonth].weeks.map((w) => {
            const done = weekDone(w.week, w.topics);
            const total = weekTotal(w.week, w.topics);
            const wpct = percentage(done, total);
            return (
              <div key={w.week} className={`rounded-xl border ${c.border} ${c.bg} overflow-hidden`}>
                {/* Week header */}
                <div className={`${c.header} text-white px-4 py-3 flex items-center justify-between`}>
                  <div>
                    <span className="text-xs opacity-75 font-medium">SEMANA {w.week}</span>
                    <h3 className="font-bold text-sm mt-0.5">{w.title}</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-xs opacity-75">{done}/{total} tópicos</div>
                    <div className="text-lg font-bold">{wpct}%</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 bg-white bg-opacity-30">
                  <div className="h-1.5 bg-white transition-all" style={{ width: `${wpct}%`, opacity: 0.9 }} />
                </div>

                {/* Topics */}
                <div className="p-4 space-y-2">
                  {w.topics.map((t, ti) => {
                    const st = getStatus(w.week, ti);
                    const cur = statusOpts.find(s => s.val === st);
                    return (
                      <div key={ti} className="bg-white dark:bg-gray-800 rounded-lg px-3 py-2.5 shadow-sm">
                        <div className="flex items-center gap-3">
                          <span className="text-base">{cur.emoji}</span>
                          <span className="flex-1 text-sm text-gray-700 dark:text-gray-200">{t}</span>
                          <select value={st} onChange={e => setTopicStatus(w.week, ti, e.target.value)}
                            className={`text-xs px-2 py-1 rounded-full border-0 font-medium cursor-pointer ${cur.cls}`}>
                            {statusOpts.map(s => <option key={s.val} value={s.val}>{s.emoji} {s.label}</option>)}
                          </select>
                        </div>
                        <TopicDetails week={w.week} topicIndex={ti} topicTitle={t} color={plan[activeMonth].color} />
                      </div>
                    );
                  })}

                  {/* Notes */}
                  <NotesEditor
                    value={notes[w.week] || ""}
                    onChange={(val) => setNote(w.week, val)}
                    weekNumber={w.week}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          {statusOpts.map(s => (
            <span key={s.val} className={`text-xs px-3 py-1.5 rounded-full font-medium ${s.cls}`}>
              {s.emoji} {s.label}
            </span>
          ))}
        </div>
      </div>
        </>
      )}
    </div>
  );
}