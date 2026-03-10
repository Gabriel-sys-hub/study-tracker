import { useState } from "react";
import { getTopicResources } from "../data/studyResources";

const difficultyColors = {
  easy: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-700",
  hard: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-700",
};

const difficultyLabels = {
  easy: "Fácil",
  medium: "Médio",
  hard: "Difícil",
};

export default function TopicDetails({ week, topicIndex, topicTitle, color }) {
  const [isOpen, setIsOpen] = useState(false);
  const [completedExercises, setCompletedExercises] = useState({});
  const resources = getTopicResources(week, topicIndex);

  if (!resources) return null;

  const toggleExercise = (idx) => {
    setCompletedExercises((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const hasVideos = resources.videos?.length > 0;
  const hasBooks = resources.books?.length > 0;
  const hasArticles = resources.articles?.length > 0;
  const hasExercises = resources.exercises?.length > 0;

  return (
    <div className="mt-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-all ${
          isOpen
            ? `bg-${color}-100 text-${color}-700 border border-${color}-200`
            : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        }`}
      >
        <span className="flex items-center gap-2">
          <span>{isOpen ? "📖" : "📚"}</span>
          <span>Ver materiais de estudo</span>
        </span>
        <span
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="mt-3 space-y-4 pl-2 border-l-2 border-gray-200 dark:border-gray-600">
          {/* Videos */}
          {hasVideos && (
            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                <span className="text-red-500">▶️</span> Vídeos
              </h4>
              <div className="space-y-2">
                {resources.videos.map((video, idx) => (
                  <a
                    key={idx}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-950 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 transition-colors group"
                  >
                    <span className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200 group-hover:text-red-700 dark:group-hover:text-red-300">
                      {video.lang === "pt" && (
                        <span className="flex-shrink-0 text-[10px] font-bold bg-green-500 text-white px-1.5 py-0.5 rounded">BR</span>
                      )}
                      <span>{video.title.replace("[PT-BR] ", "")}</span>
                    </span>
                    <span className="flex-shrink-0 text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-0.5 rounded ml-2">
                      {video.duration}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Books */}
          {hasBooks && (
            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                <span>📕</span> Livros
              </h4>
              <div className="space-y-2">
                {resources.books.map((book, idx) => (
                  <a
                    key={idx}
                    href={book.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col p-2 bg-amber-50 dark:bg-amber-950 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900 transition-colors group"
                  >
                    <span className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-amber-700 dark:group-hover:text-amber-300">
                      {book.lang === "pt" && (
                        <span className="flex-shrink-0 text-[10px] font-bold bg-green-500 text-white px-1.5 py-0.5 rounded">BR</span>
                      )}
                      <span>{book.title}</span>
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      por {book.author}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Articles */}
          {hasArticles && (
            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                <span>📄</span> Artigos e Documentação
              </h4>
              <div className="space-y-2">
                {resources.articles.map((article, idx) => (
                  <a
                    key={idx}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-2 bg-blue-50 dark:bg-blue-950 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors group"
                  >
                    <span className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                      {article.lang === "pt" && (
                        <span className="flex-shrink-0 text-[10px] font-bold bg-green-500 text-white px-1.5 py-0.5 rounded">BR</span>
                      )}
                      <span>{article.title.replace("[PT-BR] ", "")}</span>
                    </span>
                    <span className="ml-auto flex-shrink-0 text-blue-400 group-hover:text-blue-600 dark:text-blue-300 dark:group-hover:text-blue-200">
                      ↗
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Exercises */}
          {hasExercises && (
            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                <span>💪</span> Exercícios Práticos
              </h4>
              <div className="space-y-2">
                {resources.exercises.map((exercise, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                      completedExercises[idx]
                        ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                        : "bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                    }`}
                  >
                    <button
                      onClick={() => toggleExercise(idx)}
                      className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center transition-colors ${
                        completedExercises[idx]
                          ? "bg-green-500 border-green-500 text-white"
                          : "border-gray-300 hover:border-gray-400 dark:border-gray-500 dark:hover:border-gray-400"
                      }`}
                    >
                      {completedExercises[idx] && (
                        <span className="text-xs">✓</span>
                      )}
                    </button>
                    <div className="flex-1">
                      <p
                        className={`text-sm ${
                          completedExercises[idx]
                            ? "text-gray-500 line-through dark:text-gray-400"
                            : "text-gray-700 dark:text-gray-200"
                        }`}
                      >
                        {exercise.description}
                      </p>
                      <span
                        className={`inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full border ${
                          difficultyColors[exercise.difficulty]
                        }`}
                      >
                        {difficultyLabels[exercise.difficulty]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-gray-600">
            {hasVideos && (
              <span className="text-xs bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300 px-2 py-1 rounded-full">
                {resources.videos.length} vídeo
                {resources.videos.length > 1 ? "s" : ""}
              </span>
            )}
            {hasBooks && (
              <span className="text-xs bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300 px-2 py-1 rounded-full">
                {resources.books.length} livro{resources.books.length > 1 ? "s" : ""}
              </span>
            )}
            {hasArticles && (
              <span className="text-xs bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded-full">
                {resources.articles.length} artigo
                {resources.articles.length > 1 ? "s" : ""}
              </span>
            )}
            {hasExercises && (
              <span className="text-xs bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300 px-2 py-1 rounded-full">
                {resources.exercises.length} exercício
                {resources.exercises.length > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
