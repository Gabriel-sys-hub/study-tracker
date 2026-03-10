import PomodoroTimer from "./PomodoroTimer";
import StudySchedule from "./StudySchedule";
import BackupRestore from "./BackupRestore";
import CloudSync from "./CloudSync";

/**
 * Dashboard com ferramentas de produtividade.
 */
export default function Dashboard({ totalTopics, completedTopics }) {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          🎯 Dashboard
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Ferramentas para acompanhar e otimizar seus estudos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Timer Pomodoro */}
        <PomodoroTimer />

        {/* Cronograma */}
        <StudySchedule
          totalTopics={totalTopics}
          completedTopics={completedTopics}
        />

        {/* Backup */}
        <BackupRestore />

        {/* Cloud Sync */}
        <CloudSync />
      </div>

      {/* Dicas */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
        <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
          <span>💡</span> Dicas de Produtividade
        </h3>
        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
          <li>• Use o Pomodoro para manter o foco: 25min estudo, 5min pausa</li>
          <li>• Tente completar pelo menos 1 topico por dia</li>
          <li>• Faca backup regularmente para nao perder progresso</li>
          <li>• Revise os scripts Python executando-os localmente</li>
        </ul>
      </div>
    </div>
  );
}
