import { useState, useEffect } from "react";
import { Card, Button } from "./ui";
import { loadFromStorage, saveToStorage } from "../utils";

const STORAGE_KEY = "study-tracker-goals";

/**
 * Sistema de Metas e Streaks
 * Gamificação para manter consistência nos estudos
 */
export default function GoalsStreaks({ totalTopics = 80, completedTopics = 0 }) {
  const [data, setData] = useState(() =>
    loadFromStorage(STORAGE_KEY, {
      dailyGoal: 1, // tópicos por dia
      weeklyGoal: 5, // tópicos por semana
      studyDays: [], // array de datas YYYY-MM-DD
      currentStreak: 0,
      longestStreak: 0,
      lastStudyDate: null,
      weeklyProgress: {},
      achievements: [],
    })
  );

  const [showGoalEditor, setShowGoalEditor] = useState(false);
  const [newDailyGoal, setNewDailyGoal] = useState(data.dailyGoal);
  const [newWeeklyGoal, setNewWeeklyGoal] = useState(data.weeklyGoal);

  useEffect(() => {
    saveToStorage(STORAGE_KEY, data);
  }, [data]);

  // Check and update streak on mount
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    // Check if streak is broken
    if (data.lastStudyDate && data.lastStudyDate !== today && data.lastStudyDate !== yesterday) {
      setData((prev) => ({
        ...prev,
        currentStreak: 0,
      }));
    }
  }, []);

  // Mark today as studied
  const markTodayAsStudied = () => {
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    if (data.studyDays.includes(today)) return;

    const newStreak =
      data.lastStudyDate === yesterday ? data.currentStreak + 1 : 1;

    const newAchievements = [...data.achievements];

    // Check for achievements
    if (newStreak === 7 && !newAchievements.includes("streak_7")) {
      newAchievements.push("streak_7");
    }
    if (newStreak === 30 && !newAchievements.includes("streak_30")) {
      newAchievements.push("streak_30");
    }
    if (completedTopics >= 10 && !newAchievements.includes("topics_10")) {
      newAchievements.push("topics_10");
    }
    if (completedTopics >= 40 && !newAchievements.includes("topics_40")) {
      newAchievements.push("topics_40");
    }

    setData((prev) => ({
      ...prev,
      studyDays: [...prev.studyDays, today],
      currentStreak: newStreak,
      longestStreak: Math.max(prev.longestStreak, newStreak),
      lastStudyDate: today,
      achievements: newAchievements,
    }));
  };

  const saveGoals = () => {
    setData((prev) => ({
      ...prev,
      dailyGoal: newDailyGoal,
      weeklyGoal: newWeeklyGoal,
    }));
    setShowGoalEditor(false);
  };

  // Calculate weekly progress
  const getWeekProgress = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);

    let daysStudied = 0;
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      if (data.studyDays.includes(dateStr)) {
        daysStudied++;
      }
    }
    return daysStudied;
  };

  // Get last 7 days for calendar
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * 86400000);
      const dateStr = date.toISOString().split("T")[0];
      days.push({
        date: dateStr,
        day: date.toLocaleDateString("pt-BR", { weekday: "short" }).slice(0, 3),
        studied: data.studyDays.includes(dateStr),
        isToday: i === 0,
      });
    }
    return days;
  };

  const today = new Date().toISOString().split("T")[0];
  const studiedToday = data.studyDays.includes(today);
  const weekProgress = getWeekProgress();
  const last7Days = getLast7Days();

  const ACHIEVEMENTS = {
    streak_7: { icon: "🔥", title: "1 Semana de Streak", desc: "Estudou 7 dias seguidos" },
    streak_30: { icon: "💎", title: "1 Mês de Streak", desc: "Estudou 30 dias seguidos" },
    topics_10: { icon: "📚", title: "Iniciante", desc: "Completou 10 tópicos" },
    topics_40: { icon: "🎓", title: "Intermediário", desc: "Completou 40 tópicos" },
    topics_80: { icon: "🏆", title: "Mestre", desc: "Completou todos os tópicos" },
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
            Metas & Streaks
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Mantenha a consistência nos estudos
          </p>
        </div>
      </div>

      {/* Streak Card */}
      <Card className="mb-6 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <Card.Body className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Streak Atual</p>
              <p className="text-5xl font-bold">{data.currentStreak}</p>
              <p className="text-sm opacity-80">
                {data.currentStreak === 1 ? "dia" : "dias"} consecutivos
              </p>
            </div>
            <div className="text-6xl">🔥</div>
          </div>

          {data.longestStreak > data.currentStreak && (
            <p className="text-sm opacity-80 mt-4">
              Recorde: {data.longestStreak} dias
            </p>
          )}
        </Card.Body>
      </Card>

      {/* Week Calendar */}
      <Card className="mb-6">
        <Card.Header>
          <span className="font-medium">Últimos 7 dias</span>
        </Card.Header>
        <Card.Body>
          <div className="flex justify-between">
            {last7Days.map((day) => (
              <div key={day.date} className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {day.day}
                </p>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg
                    ${
                      day.studied
                        ? "bg-green-500 text-white"
                        : day.isToday
                        ? "bg-gray-200 dark:bg-gray-700 ring-2 ring-blue-500"
                        : "bg-gray-100 dark:bg-gray-800"
                    }`}
                >
                  {day.studied ? "✓" : day.isToday ? "?" : ""}
                </div>
              </div>
            ))}
          </div>

          {!studiedToday && (
            <Button onClick={markTodayAsStudied} className="w-full mt-4">
              Marcar Hoje como Estudado
            </Button>
          )}

          {studiedToday && (
            <p className="text-center text-green-600 dark:text-green-400 mt-4 font-medium">
              ✓ Você estudou hoje!
            </p>
          )}
        </Card.Body>
      </Card>

      {/* Goals */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <Card>
          <Card.Body className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Meta Diária
              </span>
              <button
                onClick={() => setShowGoalEditor(true)}
                className="text-blue-500 hover:text-blue-600 text-xs"
              >
                Editar
              </button>
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {data.dailyGoal} {data.dailyGoal === 1 ? "tópico" : "tópicos"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">por dia</p>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Meta Semanal
              </span>
              <span className="text-xs text-gray-400">
                {weekProgress}/{data.weeklyGoal}
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
              <div
                className="h-2 bg-blue-500 rounded-full transition-all"
                style={{
                  width: `${Math.min(100, (weekProgress / data.weeklyGoal) * 100)}%`,
                }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {data.weeklyGoal - weekProgress > 0
                ? `Faltam ${data.weeklyGoal - weekProgress} dias`
                : "Meta atingida! 🎉"}
            </p>
          </Card.Body>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card className="mb-6">
        <Card.Header>
          <span className="font-medium">Progresso Geral</span>
        </Card.Header>
        <Card.Body>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {completedTopics} de {totalTopics} tópicos
            </span>
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {Math.round((completedTopics / totalTopics) * 100)}%
            </span>
          </div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div
              className="h-3 bg-green-500 rounded-full transition-all"
              style={{ width: `${(completedTopics / totalTopics) * 100}%` }}
            />
          </div>
          <div className="grid grid-cols-4 gap-2 mt-4 text-center text-xs">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <p className="font-bold text-blue-600 dark:text-blue-400">
                {data.studyDays.length}
              </p>
              <p className="text-gray-500 dark:text-gray-400">Dias estudados</p>
            </div>
            <div className="p-2 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
              <p className="font-bold text-orange-600 dark:text-orange-400">
                {data.longestStreak}
              </p>
              <p className="text-gray-500 dark:text-gray-400">Maior streak</p>
            </div>
            <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
              <p className="font-bold text-green-600 dark:text-green-400">
                {completedTopics}
              </p>
              <p className="text-gray-500 dark:text-gray-400">Concluídos</p>
            </div>
            <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
              <p className="font-bold text-purple-600 dark:text-purple-400">
                {data.achievements.length}
              </p>
              <p className="text-gray-500 dark:text-gray-400">Conquistas</p>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Achievements */}
      <Card>
        <Card.Header>
          <span className="font-medium">Conquistas</span>
        </Card.Header>
        <Card.Body>
          <div className="grid sm:grid-cols-2 gap-3">
            {Object.entries(ACHIEVEMENTS).map(([key, achievement]) => {
              const unlocked = data.achievements.includes(key);
              return (
                <div
                  key={key}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    unlocked
                      ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20"
                      : "border-gray-200 dark:border-gray-700 opacity-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{unlocked ? achievement.icon : "🔒"}</span>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">
                        {achievement.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {achievement.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card.Body>
      </Card>

      {/* Goal Editor Modal */}
      {showGoalEditor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm">
            <Card.Header>
              <span className="font-medium">Editar Metas</span>
            </Card.Header>
            <Card.Body className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Meta Diária (tópicos)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={newDailyGoal}
                  onChange={(e) => setNewDailyGoal(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Meta Semanal (dias de estudo)
                </label>
                <input
                  type="number"
                  min="1"
                  max="7"
                  value={newWeeklyGoal}
                  onChange={(e) => setNewWeeklyGoal(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setShowGoalEditor(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={saveGoals} className="flex-1">
                  Salvar
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      )}
    </div>
  );
}
