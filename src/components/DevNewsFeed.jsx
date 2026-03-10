import { useState, useEffect, useCallback } from "react";
import { Card, Button } from "./ui";

/**
 * Fontes de notícias disponíveis
 */
const SOURCES = [
  { id: "hackernews", name: "Hacker News", icon: "🔶", description: "Top stories de tecnologia" },
  { id: "github", name: "GitHub Trending", icon: "🐙", description: "Repositórios em alta" },
  { id: "devto", name: "Dev.to", icon: "📝", description: "Artigos da comunidade" },
];

/**
 * Mapeamento de palavras-chave para tópicos do plano de estudos
 */
const KEYWORDS = {
  // IA & LLMs
  llm: { week: 1, topic: "Arquitetura dos LLMs" },
  gpt: { week: 1, topic: "GPT/OpenAI" },
  "gpt-4": { week: 1, topic: "GPT-4" },
  "gpt-5": { week: 1, topic: "GPT-5" },
  claude: { week: 1, topic: "Claude/Anthropic" },
  gemini: { week: 1, topic: "Gemini/Google" },
  transformer: { week: 1, topic: "Transformers" },
  embedding: { week: 1, topic: "Embeddings" },
  chatgpt: { week: 1, topic: "ChatGPT" },
  openai: { week: 3, topic: "OpenAI API" },
  anthropic: { week: 3, topic: "Anthropic API" },

  // Prompt & Agentes
  prompt: { week: 2, topic: "Prompt Engineering" },
  "chain-of-thought": { week: 2, topic: "Chain-of-Thought" },
  rag: { week: 6, topic: "RAG Pipeline" },
  vector: { week: 6, topic: "Vector Database" },
  agent: { week: 7, topic: "AI Agents" },
  langchain: { week: 7, topic: "LangChain" },
  langgraph: { week: 7, topic: "LangGraph" },
  autogen: { week: 7, topic: "AutoGen" },
  crewai: { week: 7, topic: "CrewAI" },

  // Cloud & Infra
  aws: { week: 9, topic: "AWS" },
  bedrock: { week: 9, topic: "Amazon Bedrock" },
  lambda: { week: 9, topic: "AWS Lambda" },
  serverless: { week: 9, topic: "Serverless" },

  // Dev Tools
  cursor: { week: 11, topic: "Cursor IDE" },
  copilot: { week: 11, topic: "GitHub Copilot" },
  "v0.dev": { week: 11, topic: "v0 by Vercel" },
  ollama: { week: 12, topic: "Ollama" },

  // Full Stack
  typescript: { week: 13, topic: "TypeScript" },
  nextjs: { week: 14, topic: "Next.js" },
  "next.js": { week: 14, topic: "Next.js" },
  react: { week: 14, topic: "React" },
  trpc: { week: 15, topic: "tRPC" },
  drizzle: { week: 15, topic: "Drizzle ORM" },
  vercel: { week: 16, topic: "Vercel" },

  // Geral
  ai: { week: 1, topic: "Inteligência Artificial" },
  "machine-learning": { week: 1, topic: "Machine Learning" },
  ml: { week: 1, topic: "Machine Learning" },
  python: { week: 1, topic: "Python" },
  javascript: { week: 13, topic: "JavaScript" },
  rust: { week: 13, topic: "Rust" },
  go: { week: 13, topic: "Go" },
};

/**
 * Busca os top stories do Hacker News
 */
async function fetchHackerNews() {
  // Busca IDs das top stories
  const topStoriesRes = await fetch(
    "https://hacker-news.firebaseio.com/v0/topstories.json"
  );
  const storyIds = await topStoriesRes.json();

  // Busca detalhes das primeiras 30 stories
  const stories = await Promise.all(
    storyIds.slice(0, 30).map(async (id) => {
      const res = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`
      );
      return res.json();
    })
  );

  return stories
    .filter((s) => s && s.title && s.url)
    .map((story) => ({
      id: story.id,
      title: story.title,
      url: story.url,
      author: story.by,
      score: story.score,
      comments: story.descendants || 0,
      time: story.time * 1000,
      source: "hackernews",
    }));
}

/**
 * Busca trending repositories do GitHub (via API não-oficial)
 */
async function fetchGitHubTrending() {
  try {
    // Usa a API de busca do GitHub para repos populares criados recentemente
    const date = new Date();
    date.setDate(date.getDate() - 7);
    const dateStr = date.toISOString().split("T")[0];

    const res = await fetch(
      `https://api.github.com/search/repositories?q=created:>${dateStr}&sort=stars&order=desc&per_page=20`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!res.ok) throw new Error("GitHub API limit");

    const data = await res.json();

    return data.items.map((repo) => ({
      id: repo.id,
      title: `${repo.full_name}: ${repo.description || "No description"}`,
      url: repo.html_url,
      author: repo.owner.login,
      score: repo.stargazers_count,
      comments: repo.forks_count,
      time: new Date(repo.created_at).getTime(),
      source: "github",
      language: repo.language,
      topics: repo.topics || [],
    }));
  } catch {
    return [];
  }
}

/**
 * Busca artigos do Dev.to
 */
async function fetchDevTo() {
  try {
    const res = await fetch(
      "https://dev.to/api/articles?per_page=20&top=7"
    );

    if (!res.ok) throw new Error("Dev.to API error");

    const data = await res.json();

    return data.map((article) => ({
      id: article.id,
      title: article.title,
      url: article.url,
      author: article.user?.name || article.user?.username,
      score: article.public_reactions_count,
      comments: article.comments_count,
      time: new Date(article.published_at).getTime(),
      source: "devto",
      image: article.cover_image,
      tags: article.tag_list || [],
    }));
  } catch {
    return [];
  }
}

/**
 * Mapeia um item para tópicos do plano de estudos
 */
function mapToTopics(item) {
  const text = `${item.title} ${item.tags?.join(" ") || ""} ${item.topics?.join(" ") || ""} ${item.language || ""}`.toLowerCase();
  const matched = [];

  for (const [keyword, topic] of Object.entries(KEYWORDS)) {
    if (text.includes(keyword.toLowerCase())) {
      if (!matched.find((m) => m.week === topic.week && m.topic === topic.topic)) {
        matched.push(topic);
      }
    }
  }

  return matched.slice(0, 2);
}

export default function DevNewsFeed() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSource, setActiveSource] = useState("hackernews");
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchData = useCallback(async (source) => {
    setLoading(true);
    setError(null);

    try {
      let data = [];

      switch (source) {
        case "hackernews":
          data = await fetchHackerNews();
          break;
        case "github":
          data = await fetchGitHubTrending();
          break;
        case "devto":
          data = await fetchDevTo();
          break;
        default:
          data = await fetchHackerNews();
      }

      // Enrich with topic mapping
      const enrichedData = data.map((item) => ({
        ...item,
        matchedTopics: mapToTopics(item),
      }));

      setItems(enrichedData);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err.message || "Erro ao buscar dados");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(activeSource);
  }, [activeSource, fetchData]);

  const formatTime = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return "Agora";
    if (hours < 24) return `${hours}h`;
    if (hours < 48) return "Ontem";
    return new Date(timestamp).toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "short",
    });
  };

  const getSourceIcon = (source) => {
    return SOURCES.find((s) => s.id === source)?.icon || "📰";
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
            Dev News & Trends
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Hot topics mapeados para seus estudos
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => fetchData(activeSource)}
          disabled={loading}
        >
          {loading ? "..." : "🔄 Atualizar"}
        </Button>
      </div>

      {/* Source tabs */}
      <div className="flex gap-2 mb-6">
        {SOURCES.map((source) => (
          <button
            key={source.id}
            onClick={() => setActiveSource(source.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeSource === source.id
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <span>{source.icon}</span>
            <span className="hidden sm:inline">{source.name}</span>
          </button>
        ))}
      </div>

      {/* Stats bar */}
      {!loading && items.length > 0 && (
        <div className="flex items-center justify-between mb-4 text-xs text-gray-500 dark:text-gray-400">
          <span>
            {items.filter((i) => i.matchedTopics.length > 0).length} de {items.length} itens
            relevantes para seu plano
          </span>
          {lastUpdate && (
            <span>Atualizado: {lastUpdate.toLocaleTimeString("pt-BR")}</span>
          )}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin text-4xl mb-3">🔄</div>
          <p className="text-gray-500 dark:text-gray-400">
            Buscando {SOURCES.find((s) => s.id === activeSource)?.name}...
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <Card className="border-red-300 dark:border-red-800 mb-4">
          <Card.Body className="text-center py-4">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fetchData(activeSource)}
              className="mt-2"
            >
              Tentar novamente
            </Button>
          </Card.Body>
        </Card>
      )}

      {/* Items */}
      {!loading && !error && (
        <div className="space-y-3">
          {items.length === 0 ? (
            <Card>
              <Card.Body className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  Nenhum item encontrado
                </p>
              </Card.Body>
            </Card>
          ) : (
            items.map((item) => (
              <Card
                key={`${item.source}-${item.id}`}
                className={`hover:shadow-md transition-shadow ${
                  item.matchedTopics.length > 0
                    ? "border-l-4 border-l-green-500"
                    : ""
                }`}
              >
                <Card.Body className="p-4">
                  <div className="flex gap-3">
                    {/* Source icon */}
                    <span className="text-xl shrink-0">
                      {getSourceIcon(item.source)}
                    </span>

                    <div className="flex-1 min-w-0">
                      {/* Title */}
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-gray-800 dark:text-gray-100
                                 hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2"
                      >
                        {item.title}
                      </a>

                      {/* Meta */}
                      <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                        <span>{item.author}</span>
                        <span>•</span>
                        <span>{formatTime(item.time)}</span>
                        <span>•</span>
                        <span>⬆️ {item.score}</span>
                        {item.comments > 0 && <span>💬 {item.comments}</span>}
                        {item.language && (
                          <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
                            {item.language}
                          </span>
                        )}
                      </div>

                      {/* Tags */}
                      {item.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.tags.slice(0, 4).map((tag) => (
                            <span
                              key={tag}
                              className="px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-gray-700
                                       text-gray-600 dark:text-gray-400 rounded"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Matched topics */}
                      {item.matchedTopics?.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {item.matchedTopics.map((topic, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900/50
                                       text-green-700 dark:text-green-300 rounded-full
                                       border border-green-200 dark:border-green-800"
                            >
                              📚 S{topic.week}: {topic.topic}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-400">
          Dados de {SOURCES.find((s) => s.id === activeSource)?.name} •
          Itens com borda verde são relevantes para seu plano de estudos
        </p>
      </div>
    </div>
  );
}
