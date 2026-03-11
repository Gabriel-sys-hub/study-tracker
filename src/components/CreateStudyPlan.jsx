import { useState, useEffect } from "react";
import { Button, Card } from "./ui";
import { CATEGORY_COLORS, COMMON_STYLES } from "../constants/theme";
import { cn, saveToStorage, loadFromStorage } from "../utils";
import CustomPlanViewer from "./CustomPlanViewer";

const CUSTOM_PLANS_KEY = "study-tracker-custom-plans";
const AVAILABLE_COLORS = ["blue", "purple", "green", "orange"];

const DURATION_OPTIONS = [
  { value: 1, label: "1 semana" },
  { value: 2, label: "2 semanas" },
  { value: 4, label: "1 mês (4 semanas)" },
  { value: 8, label: "2 meses (8 semanas)" },
  { value: 12, label: "3 meses (12 semanas)" },
  { value: 16, label: "4 meses (16 semanas)" },
];

/**
 * Componente para criar planos de estudo personalizados.
 * Permite definir metas, semanas, tópicos e acompanhar progresso.
 */
export default function CreateStudyPlan({ onPlanCreated, suggestedTopic, onClearSuggestion }) {
  const [step, setStep] = useState(1); // 1: Info básica, 2: Semanas/Tópicos, 3: Revisão
  const [planData, setPlanData] = useState({
    id: "",
    title: "",
    description: "",
    color: "blue",
    duration: 4,
    goal: "",
    weeks: [],
  });
  const [currentWeek, setCurrentWeek] = useState({
    title: "",
    topics: [""],
  });
  const [savedPlans, setSavedPlans] = useState(() =>
    loadFromStorage(CUSTOM_PLANS_KEY, [])
  );
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [viewingPlan, setViewingPlan] = useState(null); // Plano sendo estudado

  // Pré-preencher com tópico sugerido pela IA
  useEffect(() => {
    if (suggestedTopic) {
      setPlanData({
        id: "",
        title: suggestedTopic.title,
        description: suggestedTopic.description,
        color: suggestedTopic.color || "blue",
        duration: 1,
        goal: `Dominar ${suggestedTopic.title}`,
        weeks: [{
          week: 1,
          title: suggestedTopic.title,
          topics: suggestedTopic.resources?.map(r =>
            typeof r === "string" ? r : { title: r.title, resources: [r] }
          ) || [suggestedTopic.description],
        }],
      });
      setShowForm(true);
      setStep(2); // Ir direto para adicionar mais semanas/tópicos
    }
  }, [suggestedTopic]);

  const generateId = (title) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") + "-" + Date.now();
  };

  const handleBasicInfoSubmit = (e) => {
    e.preventDefault();
    if (planData.title && planData.goal) {
      setPlanData(prev => ({
        ...prev,
        id: prev.id || generateId(prev.title),
      }));
      setStep(2);
    }
  };

  const addTopic = () => {
    setCurrentWeek(prev => ({
      ...prev,
      topics: [...prev.topics, ""],
    }));
  };

  const removeTopic = (index) => {
    setCurrentWeek(prev => ({
      ...prev,
      topics: prev.topics.filter((_, i) => i !== index),
    }));
  };

  const updateTopic = (index, value) => {
    setCurrentWeek(prev => ({
      ...prev,
      topics: prev.topics.map((t, i) => i === index ? value : t),
    }));
  };

  const addWeek = () => {
    if (currentWeek.title && currentWeek.topics.some(t => t.trim())) {
      const weekNumber = planData.weeks.length + 1;
      setPlanData(prev => ({
        ...prev,
        weeks: [
          ...prev.weeks,
          {
            week: weekNumber,
            title: currentWeek.title,
            topics: currentWeek.topics.filter(t => t.trim()),
          },
        ],
      }));
      setCurrentWeek({ title: "", topics: [""] });
    }
  };

  const removeWeek = (weekIndex) => {
    setPlanData(prev => ({
      ...prev,
      weeks: prev.weeks
        .filter((_, i) => i !== weekIndex)
        .map((w, i) => ({ ...w, week: i + 1 })),
    }));
  };

  const savePlan = () => {
    const newPlan = {
      ...planData,
      createdAt: new Date().toISOString(),
      progress: {},
      notes: {},
    };

    let updatedPlans;
    if (editingPlanId) {
      updatedPlans = savedPlans.map(p =>
        p.id === editingPlanId ? { ...newPlan, id: editingPlanId } : p
      );
    } else {
      updatedPlans = [...savedPlans, newPlan];
    }

    setSavedPlans(updatedPlans);
    saveToStorage(CUSTOM_PLANS_KEY, updatedPlans);

    // Reset form
    resetForm();
    onPlanCreated?.(newPlan);
  };

  const resetForm = () => {
    setPlanData({
      id: "",
      title: "",
      description: "",
      color: "blue",
      duration: 4,
      goal: "",
      weeks: [],
    });
    setCurrentWeek({ title: "", topics: [""] });
    setStep(1);
    setEditingPlanId(null);
    setShowForm(false);
    onClearSuggestion?.();
  };

  const editPlan = (plan) => {
    setPlanData({
      id: plan.id,
      title: plan.title,
      description: plan.description || "",
      color: plan.color,
      duration: plan.duration || plan.weeks.length,
      goal: plan.goal,
      weeks: plan.weeks,
    });
    setEditingPlanId(plan.id);
    setShowForm(true);
    setStep(1);
  };

  const deletePlan = (planId) => {
    if (confirm("Tem certeza que deseja excluir este plano?")) {
      const updatedPlans = savedPlans.filter(p => p.id !== planId);
      setSavedPlans(updatedPlans);
      saveToStorage(CUSTOM_PLANS_KEY, updatedPlans);
    }
  };

  const c = CATEGORY_COLORS[planData.color];

  // Se estiver visualizando um plano, mostrar o viewer
  if (viewingPlan) {
    return (
      <CustomPlanViewer
        plan={viewingPlan}
        onBack={() => setViewingPlan(null)}
        onUpdatePlan={(updatedPlan) => {
          // Atualizar o plano na lista
          setSavedPlans(prev => prev.map(p => p.id === updatedPlan.id ? updatedPlan : p));
          setViewingPlan(updatedPlan);
        }}
      />
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Criar Plano de Estudo
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Crie seu próprio cronograma de estudos personalizado
          </p>
        </div>
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <span>➕</span> Novo Plano
          </Button>
        )}
      </div>

      {showForm ? (
        <Card className="p-6 mb-6">
          {/* Banner de tópico sugerido pela IA */}
          {suggestedTopic && (
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🤖</span>
                <div>
                  <p className="font-medium">Criando plano a partir de sugestão da IA</p>
                  <p className="text-sm opacity-80">{suggestedTopic.title} - {suggestedTopic.category}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  onClearSuggestion?.();
                  resetForm();
                }}
                className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-sm"
              >
                Limpar
              </button>
            </div>
          )}

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    step >= s
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  )}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={cn(
                      "w-16 h-1 mx-2",
                      step > s ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-700"
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <form onSubmit={handleBasicInfoSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nome do Plano *
                </label>
                <input
                  type="text"
                  value={planData.title}
                  onChange={(e) => setPlanData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: Aprendendo Python do Zero"
                  className={cn(COMMON_STYLES.input, "w-full px-3 py-2 rounded-lg")}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descrição
                </label>
                <textarea
                  value={planData.description}
                  onChange={(e) => setPlanData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva brevemente o objetivo deste plano..."
                  className={cn(COMMON_STYLES.input, "w-full px-3 py-2 rounded-lg resize-none")}
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Meta Principal *
                </label>
                <input
                  type="text"
                  value={planData.goal}
                  onChange={(e) => setPlanData(prev => ({ ...prev, goal: e.target.value }))}
                  placeholder="Ex: Conseguir construir aplicações web completas com Python"
                  className={cn(COMMON_STYLES.input, "w-full px-3 py-2 rounded-lg")}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cor do Tema
                  </label>
                  <div className="flex gap-2">
                    {AVAILABLE_COLORS.map((color) => {
                      const colorConfig = CATEGORY_COLORS[color];
                      return (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setPlanData(prev => ({ ...prev, color }))}
                          className={cn(
                            "w-8 h-8 rounded-full border-2 transition-all",
                            colorConfig.header.split(" ")[0],
                            planData.color === color
                              ? "ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-800"
                              : "opacity-60 hover:opacity-100"
                          )}
                        />
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Duração Estimada
                  </label>
                  <select
                    value={planData.duration}
                    onChange={(e) => setPlanData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                    className={cn(COMMON_STYLES.input, "w-full px-3 py-2 rounded-lg")}
                  >
                    {DURATION_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg"
                >
                  Próximo →
                </Button>
              </div>
            </form>
          )}

          {/* Step 2: Weeks & Topics */}
          {step === 2 && (
            <div className="space-y-6">
              <div className={cn("p-4 rounded-lg", c.bg, c.border, "border")}>
                <h3 className={cn("font-bold mb-4", c.text)}>
                  Adicionar Semana {planData.weeks.length + 1}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Título da Semana
                    </label>
                    <input
                      type="text"
                      value={currentWeek.title}
                      onChange={(e) => setCurrentWeek(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Ex: Fundamentos de Python"
                      className={cn(COMMON_STYLES.input, "w-full px-3 py-2 rounded-lg")}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tópicos
                    </label>
                    <div className="space-y-2">
                      {currentWeek.topics.map((topic, i) => (
                        <div key={i} className="flex gap-2">
                          <input
                            type="text"
                            value={topic}
                            onChange={(e) => updateTopic(i, e.target.value)}
                            placeholder={`Tópico ${i + 1}`}
                            className={cn(COMMON_STYLES.input, "flex-1 px-3 py-2 rounded-lg")}
                          />
                          {currentWeek.topics.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeTopic(i)}
                              className="px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={addTopic}
                      className="mt-2 text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
                    >
                      <span>+</span> Adicionar tópico
                    </button>
                  </div>

                  <Button
                    onClick={addWeek}
                    disabled={!currentWeek.title || !currentWeek.topics.some(t => t.trim())}
                    className="w-full py-2 bg-green-500 text-white hover:bg-green-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ✓ Adicionar Semana
                  </Button>
                </div>
              </div>

              {/* Added Weeks */}
              {planData.weeks.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300">
                    Semanas adicionadas ({planData.weeks.length})
                  </h4>
                  {planData.weeks.map((week, i) => (
                    <div
                      key={i}
                      className={cn(
                        "p-3 rounded-lg border flex items-start justify-between",
                        c.bg,
                        c.border
                      )}
                    >
                      <div>
                        <div className={cn("font-medium text-sm", c.text)}>
                          Semana {week.week}: {week.title}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {week.topics.length} tópico(s)
                        </div>
                      </div>
                      <button
                        onClick={() => removeWeek(i)}
                        className="text-red-500 hover:text-red-600 p-1"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  ← Voltar
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={planData.weeks.length === 0}
                  className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Revisar →
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-6">
              <div className={cn("rounded-xl border overflow-hidden", c.border)}>
                <div className={cn(c.header, "text-white px-4 py-3")}>
                  <h3 className="font-bold">{planData.title}</h3>
                  {planData.description && (
                    <p className="text-sm opacity-80 mt-1">{planData.description}</p>
                  )}
                </div>
                <div className={cn("p-4", c.bg)}>
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Meta:
                    </span>
                    <p className="text-gray-800 dark:text-gray-200">{planData.goal}</p>
                  </div>

                  <div className="space-y-3">
                    {planData.weeks.map((week) => (
                      <div
                        key={week.week}
                        className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm"
                      >
                        <div className="font-medium text-sm text-gray-700 dark:text-gray-200">
                          Semana {week.week}: {week.title}
                        </div>
                        <ul className="mt-2 space-y-1">
                          {week.topics.map((topic, ti) => (
                            <li
                              key={ti}
                              className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2"
                            >
                              <span>⬜</span> {typeof topic === "string" ? topic : topic.title}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  ← Voltar
                </Button>
                <Button
                  onClick={savePlan}
                  className="px-6 py-2 bg-green-500 text-white hover:bg-green-600 rounded-lg flex items-center gap-2"
                >
                  <span>💾</span>
                  {editingPlanId ? "Atualizar Plano" : "Salvar Plano"}
                </Button>
              </div>
            </div>
          )}
        </Card>
      ) : null}

      {/* Saved Plans List */}
      {savedPlans.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-bold text-gray-800 dark:text-white">
            Meus Planos ({savedPlans.length})
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {savedPlans.map((plan) => {
              const planColor = CATEGORY_COLORS[plan.color];
              const totalTopics = plan.weeks.reduce((sum, w) => sum + w.topics.length, 0);
              const completedTopics = Object.values(plan.progress || {}).filter(v => v === "done").length;
              const pct = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

              return (
                <Card
                  key={plan.id}
                  className={cn("overflow-hidden", planColor.border, "border")}
                >
                  <div className={cn(planColor.header, "text-white px-4 py-3")}>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold">{plan.title}</h4>
                      <div className="flex gap-1">
                        <button
                          onClick={() => editPlan(plan)}
                          className="p-1 hover:bg-white/20 rounded"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => deletePlan(plan.id)}
                          className="p-1 hover:bg-white/20 rounded"
                          title="Excluir"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    <p className="text-sm opacity-80">{plan.goal}</p>
                  </div>
                  <div className={cn("p-4", planColor.bg)}>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400">
                        {plan.weeks.length} semana(s) · {totalTopics} tópico(s)
                      </span>
                      <span className={cn("font-bold", planColor.text)}>{pct}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
                      <div
                        className={cn(planColor.header.split(" ")[0], "h-full transition-all")}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <Button
                      onClick={() => setViewingPlan(plan)}
                      className={cn(
                        "w-full py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2",
                        planColor.header,
                        "text-white hover:opacity-90"
                      )}
                    >
                      <span>📖</span> Estudar
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!showForm && savedPlans.length === 0 && (
        <Card className="p-8 text-center">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
            Nenhum plano personalizado ainda
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Crie seu primeiro plano de estudo clicando no botão acima
          </p>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Criar Meu Primeiro Plano
          </Button>
        </Card>
      )}
    </div>
  );
}
