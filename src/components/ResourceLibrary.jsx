import { useState, useEffect } from "react";
import { Card, Button } from "./ui";
import { loadFromStorage, saveToStorage } from "../utils";

const STORAGE_KEY = "study-tracker-resources";

/**
 * Categorias de recursos
 */
const RESOURCE_TYPES = {
  article: { icon: "📄", label: "Artigo" },
  video: { icon: "🎥", label: "Vídeo" },
  course: { icon: "🎓", label: "Curso" },
  docs: { icon: "📚", label: "Documentação" },
  tool: { icon: "🔧", label: "Ferramenta" },
  github: { icon: "💻", label: "GitHub" },
  other: { icon: "🔗", label: "Outro" },
};

/**
 * Semanas do plano de estudos
 */
const WEEKS = [
  { week: 1, title: "Arquitetura dos LLMs e APIs" },
  { week: 2, title: "Prompt Engineering Avançado" },
  { week: 3, title: "APIs de LLMs na Prática" },
  { week: 4, title: "Function Calling & Tool Use" },
  { week: 5, title: "Embeddings e Busca Vetorial" },
  { week: 6, title: "Bancos Vetoriais e RAG Pipeline" },
  { week: 7, title: "Agentes: Arquiteturas e Patterns" },
  { week: 8, title: "Avaliação, Observabilidade e Produção" },
  { week: 9, title: "AWS para IA e LLMs" },
  { week: 10, title: "Arquitetura de Sistemas com IA" },
  { week: 11, title: "Ferramentas de Dev com IA" },
  { week: 12, title: "FinOps, Segurança e Compliance" },
  { week: 13, title: "TypeScript Avançado" },
  { week: 14, title: "Next.js 15 e App Router" },
  { week: 15, title: "tRPC, Drizzle e Vercel AI SDK" },
  { week: 16, title: "Projeto Final e Deploy" },
];

export default function ResourceLibrary() {
  const [resources, setResources] = useState(() => loadFromStorage(STORAGE_KEY, []));
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterWeek, setFilterWeek] = useState(null);
  const [filterType, setFilterType] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Form state
  const [newResource, setNewResource] = useState({
    title: "",
    url: "",
    type: "article",
    week: 1,
    notes: "",
    tags: "",
  });

  useEffect(() => {
    saveToStorage(STORAGE_KEY, resources);
  }, [resources]);

  const addResource = () => {
    if (!newResource.title.trim() || !newResource.url.trim()) return;

    const resource = {
      id: Date.now(),
      ...newResource,
      tags: newResource.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      createdAt: new Date().toISOString(),
      favorite: false,
    };

    setResources([resource, ...resources]);
    setNewResource({
      title: "",
      url: "",
      type: "article",
      week: 1,
      notes: "",
      tags: "",
    });
    setShowAddForm(false);
  };

  const deleteResource = (id) => {
    setResources(resources.filter((r) => r.id !== id));
  };

  const toggleFavorite = (id) => {
    setResources(
      resources.map((r) => (r.id === id ? { ...r, favorite: !r.favorite } : r))
    );
  };

  // Filter resources
  const filteredResources = resources.filter((r) => {
    if (filterWeek && r.week !== filterWeek) return false;
    if (filterType && r.type !== filterType) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        r.title.toLowerCase().includes(query) ||
        r.notes.toLowerCase().includes(query) ||
        r.tags.some((t) => t.toLowerCase().includes(query))
      );
    }
    return true;
  });

  // Group by week for display
  const groupedByWeek = filteredResources.reduce((acc, resource) => {
    const week = resource.week;
    if (!acc[week]) acc[week] = [];
    acc[week].push(resource);
    return acc;
  }, {});

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
            Biblioteca de Recursos
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {resources.length} recursos salvos
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>+ Adicionar</Button>
      </div>

      {/* Search & Filters */}
      <div className="space-y-3 mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar recursos..."
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                   bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        <div className="flex flex-wrap gap-2">
          {/* Type filters */}
          <div className="flex gap-1">
            {Object.entries(RESOURCE_TYPES).map(([type, config]) => (
              <button
                key={type}
                onClick={() => setFilterType(filterType === type ? null : type)}
                className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                  filterType === type
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {config.icon}
              </button>
            ))}
          </div>

          {/* Week filter */}
          <select
            value={filterWeek || ""}
            onChange={(e) => setFilterWeek(e.target.value ? Number(e.target.value) : null)}
            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          >
            <option value="">Todas as semanas</option>
            {WEEKS.map((w) => (
              <option key={w.week} value={w.week}>
                Semana {w.week}
              </option>
            ))}
          </select>

          {(filterType || filterWeek || searchQuery) && (
            <button
              onClick={() => {
                setFilterType(null);
                setFilterWeek(null);
                setSearchQuery("");
              }}
              className="px-3 py-1 text-xs text-gray-500 hover:text-red-500"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* Resources List */}
      {filteredResources.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-12">
            <p className="text-4xl mb-3">📚</p>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {resources.length === 0
                ? "Nenhum recurso salvo ainda"
                : "Nenhum recurso encontrado com esses filtros"}
            </p>
            {resources.length === 0 && (
              <Button onClick={() => setShowAddForm(true)}>
                Adicionar primeiro recurso
              </Button>
            )}
          </Card.Body>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByWeek)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([week, weekResources]) => (
              <div key={week}>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                  Semana {week} - {WEEKS.find((w) => w.week === Number(week))?.title}
                </h3>
                <div className="space-y-2">
                  {weekResources.map((resource) => (
                    <Card key={resource.id} className="hover:shadow-md transition-shadow">
                      <Card.Body className="p-4">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">
                            {RESOURCE_TYPES[resource.type]?.icon || "🔗"}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-gray-800 dark:text-gray-100
                                         hover:text-blue-600 dark:hover:text-blue-400 truncate"
                              >
                                {resource.title}
                              </a>
                              {resource.favorite && <span className="text-yellow-500">★</span>}
                            </div>

                            {resource.notes && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                {resource.notes}
                              </p>
                            )}

                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <span className="text-xs text-gray-400">
                                {formatDate(resource.createdAt)}
                              </span>
                              {resource.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700
                                           text-gray-600 dark:text-gray-400 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-1">
                            <button
                              onClick={() => toggleFavorite(resource.id)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                resource.favorite
                                  ? "text-yellow-500"
                                  : "text-gray-400 hover:text-yellow-500"
                              }`}
                            >
                              {resource.favorite ? "★" : "☆"}
                            </button>
                            <button
                              onClick={() => deleteResource(resource.id)}
                              className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Add Resource Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <Card.Header className="flex items-center justify-between">
              <span className="font-medium">Adicionar Recurso</span>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </Card.Header>
            <Card.Body className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Título *
                </label>
                <input
                  type="text"
                  value={newResource.title}
                  onChange={(e) =>
                    setNewResource({ ...newResource, title: e.target.value })
                  }
                  placeholder="Ex: Documentação do Anthropic API"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  URL *
                </label>
                <input
                  type="url"
                  value={newResource.url}
                  onChange={(e) =>
                    setNewResource({ ...newResource, url: e.target.value })
                  }
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tipo
                  </label>
                  <select
                    value={newResource.type}
                    onChange={(e) =>
                      setNewResource({ ...newResource, type: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                             bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                  >
                    {Object.entries(RESOURCE_TYPES).map(([type, config]) => (
                      <option key={type} value={type}>
                        {config.icon} {config.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Semana
                  </label>
                  <select
                    value={newResource.week}
                    onChange={(e) =>
                      setNewResource({ ...newResource, week: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                             bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                  >
                    {WEEKS.map((w) => (
                      <option key={w.week} value={w.week}>
                        Semana {w.week}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notas (opcional)
                </label>
                <textarea
                  value={newResource.notes}
                  onChange={(e) =>
                    setNewResource({ ...newResource, notes: e.target.value })
                  }
                  placeholder="Anotações sobre o recurso..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tags (separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={newResource.tags}
                  onChange={(e) =>
                    setNewResource({ ...newResource, tags: e.target.value })
                  }
                  placeholder="Ex: claude, api, tutorial"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="ghost"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button onClick={addResource} className="flex-1">
                  Adicionar
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      )}
    </div>
  );
}
