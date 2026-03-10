import { useState, useEffect, useRef } from "react";

const PRESETS = {
  pomodoro: { work: 25, break: 5, label: "Pomodoro (25/5)" },
  short: { work: 15, break: 3, label: "Curto (15/3)" },
  long: { work: 50, break: 10, label: "Longo (50/10)" },
};

/**
 * Timer Pomodoro para sessoes de estudo focado.
 */
export default function PomodoroTimer() {
  const [preset, setPreset] = useState("pomodoro");
  const [minutes, setMinutes] = useState(PRESETS.pomodoro.work);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer acabou
            playSound();
            if (isBreak) {
              // Fim do break, volta pro trabalho
              setIsBreak(false);
              setMinutes(PRESETS[preset].work);
            } else {
              // Fim do trabalho, inicia break
              setSessions((s) => s + 1);
              setIsBreak(true);
              setMinutes(PRESETS[preset].break);
            }
            setSeconds(0);
            setIsRunning(false);
          } else {
            setMinutes((m) => m - 1);
            setSeconds(59);
          }
        } else {
          setSeconds((s) => s - 1);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, minutes, seconds, isBreak, preset]);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    setMinutes(PRESETS[preset].work);
    setSeconds(0);
  };

  const changePreset = (newPreset) => {
    setPreset(newPreset);
    setIsRunning(false);
    setIsBreak(false);
    setMinutes(PRESETS[newPreset].work);
    setSeconds(0);
  };

  const formatTime = (m, s) => {
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const progress = isBreak
    ? ((PRESETS[preset].break * 60 - (minutes * 60 + seconds)) / (PRESETS[preset].break * 60)) * 100
    : ((PRESETS[preset].work * 60 - (minutes * 60 + seconds)) / (PRESETS[preset].work * 60)) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      {/* Audio para notificacao */}
      <audio ref={audioRef} preload="auto">
        <source
          src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleWQvQIS13markup"
          type="audio/wav"
        />
      </audio>

      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <span>⏱️</span> Pomodoro
        </h3>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-500 dark:text-gray-400">Sessoes:</span>
          <span className="font-bold text-green-500">{sessions}</span>
        </div>
      </div>

      {/* Preset selector */}
      <div className="flex gap-1 mb-4">
        {Object.entries(PRESETS).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => changePreset(key)}
            className={`flex-1 px-2 py-1.5 text-xs rounded-lg transition-colors ${
              preset === key
                ? "bg-blue-500 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Timer display */}
      <div className="relative mb-4">
        <div
          className={`text-center py-6 rounded-xl ${
            isBreak
              ? "bg-green-100 dark:bg-green-900/30"
              : "bg-blue-100 dark:bg-blue-900/30"
          }`}
        >
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            {isBreak ? "☕ Pausa" : "🎯 Foco"}
          </div>
          <div
            className={`text-5xl font-mono font-bold ${
              isBreak
                ? "text-green-600 dark:text-green-400"
                : "text-blue-600 dark:text-blue-400"
            }`}
          >
            {formatTime(minutes, seconds)}
          </div>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-b-xl overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ${
              isBreak ? "bg-green-500" : "bg-blue-500"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={toggleTimer}
          className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${
            isRunning
              ? "bg-yellow-500 hover:bg-yellow-600 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          {isRunning ? "⏸️ Pausar" : "▶️ Iniciar"}
        </button>
        <button
          onClick={resetTimer}
          className="px-4 py-2.5 rounded-lg font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          🔄
        </button>
      </div>
    </div>
  );
}
