import { useState } from "react";
import { Button, Card } from "./ui";
import { CATEGORY_COLORS, STATUS_CONFIG, COMMON_STYLES, RESOURCE_TYPE_CONFIG } from "../constants/theme";
import { cn, saveToStorage, loadFromStorage, percentage } from "../utils";

const CUSTOM_PLANS_KEY = "study-tracker-custom-plans";

const statusOpts = Object.entries(STATUS_CONFIG).map(([val, config]) => ({
  val,
  label: config.label,
  emoji: config.emoji,
  cls: config.className,
}));

/**
 * Componente para visualizar e estudar planos customizados.
 * Similar ao tracker principal, mas para planos criados pelo usuário.
 */
export default function CustomPlanViewer({ plan, onBack, onUpdatePlan }) {
  const [notes, setNotes] = useState(plan.notes || {});
  const [progress, setProgress] = useState(plan.progress || {});
  const [expandedWeek, setExpandedWeek] = useState(null);

  const c = CATEGORY_COLORS[plan.color] || CATEGORY_COLORS.blue;

  const saveProgress = (newProgress, newNotes) => {
    const plans = loadFromStorage(CUSTOM_PLANS_KEY, []);
    const updatedPlans = plans.map((p) =>
      p.id === plan.id ? { ...p, progress: newProgress, notes: newNotes } : p
    );
    saveToStorage(CUSTOM_PLANS_KEY, updatedPlans);
    onUpdatePlan?.({ ...plan, progress: newProgress, notes: newNotes });
  };

  const setTopicStatus = (weekNum, topicIndex, status) => {
    const key = `${weekNum}-${topicIndex}`;
    const newProgress = { ...progress, [key]: status };
    setProgress(newProgress);
    saveProgress(newProgress, notes);
  };

  const setWeekNote = (weekNum, note) => {
    const newNotes = { ...notes, [weekNum]: note };
    setNotes(newNotes);
    saveProgress(progress, newNotes);
  };

  const getStatus = (weekNum, topicIndex) => progress[`${weekNum}-${topicIndex}`] || "todo";

  const totalTopics = plan.weeks.reduce((sum, w) => sum + w.topics.length, 0);
  const completedTopics = Object.values(progress).filter((v) => v === "done").length;
  const overallPct = percentage(completedTopics, totalTopics);

  const weekProgress = (week) => {
    const done = week.topics.filter((_, i) => getStatus(week.week, i) === "done").length;
    return percentage(done, week.topics.length);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 mb-4 transition-colors"
        >
          <span>←</span> Voltar aos planos
        </button>

        <div className={cn("rounded-xl overflow-hidden", c.border, "border")}>
          <div className={cn(c.header, "text-white px-6 py-4")}>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold">{plan.title}</h1>
                {plan.description && (
                  <p className="text-sm opacity-80 mt-1">{plan.description}</p>
                )}
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{overallPct}%</div>
                <div className="text-sm opacity-80">
                  {completedTopics}/{totalTopics} tópicos
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4 h-2 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all"
                style={{ width: `${overallPct}%` }}
              />
            </div>

            {/* Goal */}
            {plan.goal && (
              <div className="mt-4 p-3 bg-white/10 rounded-lg">
                <span className="text-sm font-medium opacity-80">Meta: </span>
                <span className="text-sm">{plan.goal}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Weeks */}
      <div className="space-y-4">
        {plan.weeks.map((week) => {
          const wpct = weekProgress(week);
          const isExpanded = expandedWeek === week.week;
          const doneCount = week.topics.filter((_, i) => getStatus(week.week, i) === "done").length;

          return (
            <div
              key={week.week}
              className={cn("rounded-xl border overflow-hidden", c.border, c.bg)}
            >
              {/* Week Header */}
              <button
                onClick={() => setExpandedWeek(isExpanded ? null : week.week)}
                className={cn(
                  c.header,
                  "text-white px-4 py-3 w-full flex items-center justify-between hover:opacity-90 transition-opacity"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{isExpanded ? "▼" : "▶"}</span>
                  <div className="text-left">
                    <span className="text-xs opacity-75 font-medium block">
                      SEMANA {week.week}
                    </span>
                    <h3 className="font-bold text-sm">{week.title}</h3>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs opacity-75">
                    {doneCount}/{week.topics.length} tópicos
                  </div>
                  <div className="text-lg font-bold">{wpct}%</div>
                </div>
              </button>

              {/* Progress bar */}
              <div className="h-1.5 bg-white/30">
                <div
                  className="h-1.5 bg-white transition-all"
                  style={{ width: `${wpct}%`, opacity: 0.9 }}
                />
              </div>

              {/* Topics (expandable) */}
              {isExpanded && (
                <div className="p-4 space-y-3">
                  {week.topics.map((topic, ti) => {
                    const st = getStatus(week.week, ti);
                    const cur = statusOpts.find((s) => s.val === st);
                    const topicData = typeof topic === "string" ? { title: topic } : topic;

                    return (
                      <div
                        key={ti}
                        className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-xl mt-0.5">{cur.emoji}</span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-slate-800 dark:text-slate-200">
                                {topicData.title || topic}
                              </span>
                              <select
                                value={st}
                                onChange={(e) =>
                                  setTopicStatus(week.week, ti, e.target.value)
                                }
                                className={cn(
                                  "text-xs px-2 py-1 rounded-full border-0 font-medium cursor-pointer",
                                  cur.cls
                                )}
                              >
                                {statusOpts.map((s) => (
                                  <option key={s.val} value={s.val}>
                                    {s.emoji} {s.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Resources */}
                            {topicData.resources && (
                              <div className="mt-3 space-y-2">
                                {topicData.resources.map((resource, ri) => (
                                  <ResourceItem key={ri} resource={resource} color={plan.color} />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Week Notes */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                      Anotações da Semana {week.week}
                    </label>
                    <textarea
                      value={notes[week.week] || ""}
                      onChange={(e) => setWeekNote(week.week, e.target.value)}
                      placeholder="Adicione suas anotações aqui..."
                      className={cn(
                        COMMON_STYLES.input,
                        "w-full px-3 py-2 rounded-lg resize-none"
                      )}
                      rows={3}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        {statusOpts.map((s) => (
          <span
            key={s.val}
            className={cn("text-xs px-3 py-1.5 rounded-full font-medium", s.cls)}
          >
            {s.emoji} {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Componente para exibir um recurso de estudo.
 */
function ResourceItem({ resource, color }) {
  const c = CATEGORY_COLORS[color] || CATEGORY_COLORS.blue;

  // Se for string simples, renderiza como texto
  if (typeof resource === "string") {
    return (
      <div className={cn("text-sm px-3 py-2 rounded-lg", c.bg, c.border, "border")}>
        <span className="text-slate-600 dark:text-slate-400">{resource}</span>
      </div>
    );
  }

  const config = RESOURCE_TYPE_CONFIG[resource.type] || { icon: "🔗", label: "Link", className: "" };
  const langFlag = resource.lang === "pt" ? "🇧🇷" : resource.lang === "en" ? "🇺🇸" : "";

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl border transition-all hover:shadow-md",
        "bg-white/80 dark:bg-slate-800/80",
        "border-slate-200/60 dark:border-slate-700/60",
        "hover:bg-white dark:hover:bg-slate-700"
      )}
    >
      <span className="text-xl">{config.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-slate-800 dark:text-slate-200 truncate">
            {resource.title}
          </span>
          {langFlag && <span className="text-sm">{langFlag}</span>}
        </div>
        {resource.author && (
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {resource.author}
          </span>
        )}
        {resource.duration && (
          <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
            ({resource.duration})
          </span>
        )}
      </div>
      <span className={cn("text-xs px-2 py-1 rounded-lg font-medium", config.className)}>{config.label}</span>
    </a>
  );
}
