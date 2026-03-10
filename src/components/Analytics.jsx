import { useState, useMemo } from "react";
import { Card } from "./ui";
import { loadFromStorage } from "../utils";

/**
 * Dashboard de Analytics
 * Mostra estatísticas detalhadas do progresso nos estudos
 */
export default function Analytics({ totalTopics = 80, completedTopics = 0 }) {
  const [timeRange, setTimeRange] = useState("all"); // "week" | "month" | "all"

  // Load data from various storage keys
  const progressData = loadFromStorage("study-tracker-v1", { progress: {} }).progress;
  const goalsData = loadFromStorage("study-tracker-goals", { studyDays: [], currentStreak: 0 });
  const flashcardsData = loadFromStorage("study-tracker-flashcards", []);
  const quizData = loadFromStorage("study-tracker-quiz", { correct: 0, total: 0 });
  const resourcesData = loadFromStorage("study-tracker-resources", []);

  // Calculate progress by week
  const progressByWeek = useMemo(() => {
    const weeks = {};
    for (let i = 1; i <= 16; i++) {
      weeks[i] = { total: 5, done: 0 }; // 5 topics per week
    }

    Object.entries(progressData).forEach(([key, status]) => {
      if (status === "done") {
        const week = parseInt(key.split("-")[0]);
        if (weeks[week]) {
          weeks[week].done++;
        }
      }
    });

    return weeks;
  }, [progressData]);

  // Calculate progress by month
  const progressByMonth = useMemo(() => {
    return [
      { month: "Mês 1", label: "IA & LLMs", weeks: [1, 2, 3, 4], color: "blue" },
      { month: "Mês 2", label: "Agentes & RAG", weeks: [5, 6, 7, 8], color: "purple" },
      { month: "Mês 3", label: "Cloud & Ferramentas", weeks: [9, 10, 11, 12], color: "green" },
      { month: "Mês 4", label: "Full Stack", weeks: [13, 14, 15, 16], color: "orange" },
    ].map((m) => {
      const done = m.weeks.reduce((sum, w) => sum + progressByWeek[w].done, 0);
      const total = m.weeks.reduce((sum, w) => sum + progressByWeek[w].total, 0);
      return { ...m, done, total, percent: Math.round((done / total) * 100) };
    });
  }, [progressByWeek]);

  // Study activity heatmap (last 12 weeks)
  const activityHeatmap = useMemo(() => {
    const weeks = [];
    const today = new Date();

    for (let w = 11; w >= 0; w--) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (w * 7) - today.getDay());

      const days = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + d);
        const dateStr = date.toISOString().split("T")[0];
        const studied = goalsData.studyDays.includes(dateStr);
        days.push({ date: dateStr, studied });
      }
      weeks.push(days);
    }

    return weeks;
  }, [goalsData.studyDays]);

  // Predicted completion date
  const predictedCompletion = useMemo(() => {
    const remaining = totalTopics - completedTopics;
    if (remaining <= 0) return "Concluído!";

    const studyDays = goalsData.studyDays.length;
    if (studyDays < 3) return "Dados insuficientes";

    const avgTopicsPerDay = completedTopics / Math.max(studyDays, 1);
    if (avgTopicsPerDay <= 0) return "Continue estudando";

    const daysRemaining = Math.ceil(remaining / avgTopicsPerDay);
    const completionDate = new Date(Date.now() + daysRemaining * 86400000);

    return completionDate.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [completedTopics, totalTopics, goalsData.studyDays]);

  // Stats summary
  const stats = {
    topicsCompleted: completedTopics,
    totalTopics,
    daysStudied: goalsData.studyDays.length,
    currentStreak: goalsData.currentStreak,
    longestStreak: goalsData.longestStreak,
    flashcardsCreated: flashcardsData.length,
    quizAccuracy: quizData.total > 0 ? Math.round((quizData.correct / quizData.total) * 100) : 0,
    resourcesSaved: resourcesData.length,
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
            Analytics
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Estatísticas detalhadas do seu progresso
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <Card>
          <Card.Body className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {Math.round((completedTopics / totalTopics) * 100)}%
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Progresso Total
            </p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="p-4 text-center">
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              {stats.currentStreak}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Streak Atual
            </p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="p-4 text-center">
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {stats.daysStudied}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Dias Estudados
            </p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="p-4 text-center">
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {stats.quizAccuracy}%
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Precisão Quiz
            </p>
          </Card.Body>
        </Card>
      </div>

      {/* Progress by Month */}
      <Card className="mb-6">
        <Card.Header>
          <span className="font-medium">Progresso por Mês</span>
        </Card.Header>
        <Card.Body>
          <div className="space-y-4">
            {progressByMonth.map((month) => (
              <div key={month.month}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {month.month}: {month.label}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {month.done}/{month.total} ({month.percent}%)
                  </span>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-4 rounded-full transition-all ${
                      month.color === "blue"
                        ? "bg-blue-500"
                        : month.color === "purple"
                        ? "bg-purple-500"
                        : month.color === "green"
                        ? "bg-green-500"
                        : "bg-orange-500"
                    }`}
                    style={{ width: `${month.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* Progress by Week - Bar Chart */}
      <Card className="mb-6">
        <Card.Header>
          <span className="font-medium">Progresso por Semana</span>
        </Card.Header>
        <Card.Body>
          <div className="flex items-end gap-1 h-32">
            {Object.entries(progressByWeek).map(([week, data]) => {
              const percent = (data.done / data.total) * 100;
              return (
                <div key={week} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-t relative"
                       style={{ height: "100px" }}>
                    <div
                      className={`absolute bottom-0 w-full rounded-t transition-all ${
                        percent === 100
                          ? "bg-green-500"
                          : percent > 0
                          ? "bg-blue-500"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                      style={{ height: `${percent}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {week}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-gray-400 text-center mt-2">
            Número da semana
          </p>
        </Card.Body>
      </Card>

      {/* Activity Heatmap */}
      <Card className="mb-6">
        <Card.Header>
          <span className="font-medium">Atividade (últimas 12 semanas)</span>
        </Card.Header>
        <Card.Body>
          <div className="flex gap-1">
            {activityHeatmap.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1">
                {week.map((day, di) => (
                  <div
                    key={di}
                    title={`${day.date}: ${day.studied ? "Estudou" : "Não estudou"}`}
                    className={`w-3 h-3 rounded-sm transition-colors ${
                      day.studied
                        ? "bg-green-500"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-end gap-2 mt-3 text-xs text-gray-500">
            <span>Menos</span>
            <div className="w-3 h-3 rounded-sm bg-gray-200 dark:bg-gray-700" />
            <div className="w-3 h-3 rounded-sm bg-green-300" />
            <div className="w-3 h-3 rounded-sm bg-green-500" />
            <span>Mais</span>
          </div>
        </Card.Body>
      </Card>

      {/* Prediction & Stats */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <Card.Header>
            <span className="font-medium">Previsão de Conclusão</span>
          </Card.Header>
          <Card.Body className="text-center py-6">
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {predictedCompletion}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Baseado no seu ritmo atual de estudo
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {totalTopics - completedTopics} tópicos restantes
            </p>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <span className="font-medium">Resumo de Uso</span>
          </Card.Header>
          <Card.Body>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Flashcards criados</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {stats.flashcardsCreated}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Perguntas respondidas</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {quizData.total}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Recursos salvos</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {stats.resourcesSaved}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Maior streak</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {stats.longestStreak} dias
                </span>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Insights */}
      <Card className="mt-6">
        <Card.Header>
          <span className="font-medium">Insights</span>
        </Card.Header>
        <Card.Body>
          <div className="space-y-3">
            {completedTopics === 0 && (
              <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <span className="text-xl">🚀</span>
                <div>
                  <p className="font-medium text-blue-800 dark:text-blue-300">
                    Comece sua jornada!
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Marque seu primeiro tópico como concluído para começar a acompanhar seu progresso.
                  </p>
                </div>
              </div>
            )}

            {stats.currentStreak >= 7 && (
              <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
                <span className="text-xl">🔥</span>
                <div>
                  <p className="font-medium text-orange-800 dark:text-orange-300">
                    Streak incrível!
                  </p>
                  <p className="text-sm text-orange-600 dark:text-orange-400">
                    {stats.currentStreak} dias seguidos estudando. Continue assim!
                  </p>
                </div>
              </div>
            )}

            {stats.quizAccuracy >= 80 && quizData.total >= 10 && (
              <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                <span className="text-xl">🎯</span>
                <div>
                  <p className="font-medium text-green-800 dark:text-green-300">
                    Excelente desempenho no Quiz!
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    {stats.quizAccuracy}% de precisão mostra que você está dominando o conteúdo.
                  </p>
                </div>
              </div>
            )}

            {completedTopics >= totalTopics * 0.5 && completedTopics < totalTopics && (
              <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                <span className="text-xl">🎉</span>
                <div>
                  <p className="font-medium text-purple-800 dark:text-purple-300">
                    Passou da metade!
                  </p>
                  <p className="text-sm text-purple-600 dark:text-purple-400">
                    Você já completou mais de 50% do plano. A reta final está próxima!
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
