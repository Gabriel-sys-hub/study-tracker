import { useMemo } from "react";
import { percentage } from "../utils";

// Data de inicio do plano (pode ser configuravel)
const PLAN_START = new Date("2025-03-10");
const PLAN_DURATION_WEEKS = 16;
const TOTAL_DAYS = PLAN_DURATION_WEEKS * 7;

/**
 * Cronograma inteligente de estudos.
 * Calcula ritmo atual e sugere ajustes.
 */
export default function StudySchedule({ totalTopics, completedTopics }) {
  const stats = useMemo(() => {
    const now = new Date();
    const daysPassed = Math.max(1, Math.floor((now - PLAN_START) / (1000 * 60 * 60 * 24)));
    const daysRemaining = Math.max(0, TOTAL_DAYS - daysPassed);

    const expectedProgress = percentage(daysPassed, TOTAL_DAYS);
    const actualProgress = percentage(completedTopics, totalTopics);

    const topicsPerDayIdeal = totalTopics / TOTAL_DAYS;
    const topicsPerDayActual = completedTopics / daysPassed;
    const topicsRemaining = totalTopics - completedTopics;
    const topicsPerDayNeeded = daysRemaining > 0 ? topicsRemaining / daysRemaining : topicsRemaining;

    // Status
    let status, statusColor, statusIcon;
    const diff = actualProgress - expectedProgress;

    if (diff >= 10) {
      status = "Adiantado";
      statusColor = "text-green-500";
      statusIcon = "🚀";
    } else if (diff >= -5) {
      status = "No ritmo";
      statusColor = "text-blue-500";
      statusIcon = "✅";
    } else if (diff >= -15) {
      status = "Levemente atrasado";
      statusColor = "text-yellow-500";
      statusIcon = "⚠️";
    } else {
      status = "Atrasado";
      statusColor = "text-red-500";
      statusIcon = "🔴";
    }

    // Estimativa de conclusao
    let estimatedCompletion;
    if (topicsPerDayActual > 0) {
      const daysToComplete = topicsRemaining / topicsPerDayActual;
      estimatedCompletion = new Date(now.getTime() + daysToComplete * 24 * 60 * 60 * 1000);
    } else {
      estimatedCompletion = null;
    }

    const planEnd = new Date(PLAN_START.getTime() + TOTAL_DAYS * 24 * 60 * 60 * 1000);

    return {
      daysPassed,
      daysRemaining,
      expectedProgress,
      actualProgress,
      topicsPerDayIdeal: topicsPerDayIdeal.toFixed(1),
      topicsPerDayActual: topicsPerDayActual.toFixed(1),
      topicsPerDayNeeded: topicsPerDayNeeded.toFixed(1),
      topicsRemaining,
      status,
      statusColor,
      statusIcon,
      estimatedCompletion,
      planEnd,
      diff,
    };
  }, [totalTopics, completedTopics]);

  const formatDate = (date) => {
    if (!date) return "—";
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
        <span>📅</span> Cronograma
      </h3>

      {/* Status principal */}
      <div className={`text-center py-3 rounded-lg bg-gray-50 dark:bg-gray-900 mb-4`}>
        <span className="text-3xl">{stats.statusIcon}</span>
        <div className={`font-bold text-lg ${stats.statusColor}`}>{stats.status}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {stats.diff > 0 ? `+${stats.diff.toFixed(0)}%` : `${stats.diff.toFixed(0)}%`} vs esperado
        </div>
      </div>

      {/* Barra de progresso comparativa */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
          <span>Progresso</span>
          <span>{stats.actualProgress}% / {stats.expectedProgress}% esperado</span>
        </div>
        <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          {/* Linha do esperado */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-gray-400 dark:bg-gray-500 z-10"
            style={{ left: `${stats.expectedProgress}%` }}
          />
          {/* Progresso atual */}
          <div
            className={`h-full rounded-full transition-all ${
              stats.diff >= 0 ? "bg-green-500" : "bg-yellow-500"
            }`}
            style={{ width: `${stats.actualProgress}%` }}
          />
        </div>
      </div>

      {/* Metricas */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-500">{stats.topicsPerDayNeeded}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">topicos/dia necessarios</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-purple-500">{stats.daysRemaining}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">dias restantes</div>
        </div>
      </div>

      {/* Info adicional */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Ritmo atual:</span>
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            {stats.topicsPerDayActual} topicos/dia
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Topicos restantes:</span>
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            {stats.topicsRemaining}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Previsao de termino:</span>
          <span className={`font-medium ${
            stats.estimatedCompletion && stats.estimatedCompletion <= stats.planEnd
              ? "text-green-500"
              : "text-yellow-500"
          }`}>
            {formatDate(stats.estimatedCompletion)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Meta do plano:</span>
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            {formatDate(stats.planEnd)}
          </span>
        </div>
      </div>
    </div>
  );
}
