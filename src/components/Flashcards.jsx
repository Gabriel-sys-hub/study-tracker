import { useState, useEffect } from "react";
import { Card, Button } from "./ui";
import { loadFromStorage, saveToStorage } from "../utils";

const STORAGE_KEY = "study-tracker-flashcards";

/**
 * Sistema de Flashcards para estudo
 * Permite criar, revisar e gerenciar flashcards por categoria
 */
export default function Flashcards() {
  const [cards, setCards] = useState(() => loadFromStorage(STORAGE_KEY, []));
  const [mode, setMode] = useState("list"); // "list" | "create" | "study"
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studyDeck, setStudyDeck] = useState([]);

  // Form state
  const [newCard, setNewCard] = useState({ front: "", back: "", category: "" });

  useEffect(() => {
    saveToStorage(STORAGE_KEY, cards);
  }, [cards]);

  const addCard = () => {
    if (!newCard.front.trim() || !newCard.back.trim()) return;

    setCards([
      ...cards,
      {
        id: Date.now(),
        front: newCard.front.trim(),
        back: newCard.back.trim(),
        category: newCard.category.trim() || "Geral",
        correct: 0,
        wrong: 0,
        lastReview: null,
      },
    ]);
    setNewCard({ front: "", back: "", category: "" });
    setMode("list");
  };

  const deleteCard = (id) => {
    setCards(cards.filter((c) => c.id !== id));
  };

  const startStudy = (category = null) => {
    let deck = category
      ? cards.filter((c) => c.category === category)
      : [...cards];

    // Shuffle deck
    deck = deck.sort(() => Math.random() - 0.5);

    if (deck.length === 0) return;

    setStudyDeck(deck);
    setCurrentIndex(0);
    setShowAnswer(false);
    setMode("study");
  };

  const markCard = (correct) => {
    const card = studyDeck[currentIndex];
    setCards(
      cards.map((c) =>
        c.id === card.id
          ? {
              ...c,
              correct: correct ? c.correct + 1 : c.correct,
              wrong: correct ? c.wrong : c.wrong + 1,
              lastReview: new Date().toISOString(),
            }
          : c
      )
    );

    if (currentIndex < studyDeck.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    } else {
      setMode("list");
    }
  };

  const categories = [...new Set(cards.map((c) => c.category))];

  // Study Mode
  if (mode === "study" && studyDeck.length > 0) {
    const card = studyDeck[currentIndex];
    const progress = ((currentIndex + 1) / studyDeck.length) * 100;

    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" onClick={() => setMode("list")}>
            Voltar
          </Button>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {currentIndex + 1} / {studyDeck.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-6">
          <div
            className="h-2 bg-blue-500 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Card */}
        <div
          onClick={() => setShowAnswer(true)}
          className="min-h-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 cursor-pointer
                     flex items-center justify-center text-center border-2 border-gray-200 dark:border-gray-700
                     hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
        >
          <div>
            <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">
              {showAnswer ? "Resposta" : "Pergunta"}
            </p>
            <p className="text-xl font-medium text-gray-800 dark:text-gray-100">
              {showAnswer ? card.back : card.front}
            </p>
            {!showAnswer && (
              <p className="text-xs text-gray-400 mt-4">Clique para ver a resposta</p>
            )}
          </div>
        </div>

        {/* Actions */}
        {showAnswer && (
          <div className="flex gap-3 mt-6 justify-center">
            <Button
              variant="danger"
              onClick={() => markCard(false)}
              className="flex-1 max-w-32"
            >
              Errei
            </Button>
            <Button
              variant="success"
              onClick={() => markCard(true)}
              className="flex-1 max-w-32"
            >
              Acertei
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Create Mode
  if (mode === "create") {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
            Novo Flashcard
          </h2>
          <Button variant="ghost" size="sm" onClick={() => setMode("list")}>
            Cancelar
          </Button>
        </div>

        <Card>
          <Card.Body className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Frente (Pergunta)
              </label>
              <textarea
                value={newCard.front}
                onChange={(e) => setNewCard({ ...newCard, front: e.target.value })}
                placeholder="Ex: O que é Self-Attention?"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Verso (Resposta)
              </label>
              <textarea
                value={newCard.back}
                onChange={(e) => setNewCard({ ...newCard, back: e.target.value })}
                placeholder="Ex: Mecanismo que permite tokens se relacionarem..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Categoria (opcional)
              </label>
              <input
                type="text"
                value={newCard.category}
                onChange={(e) => setNewCard({ ...newCard, category: e.target.value })}
                placeholder="Ex: Semana 1, LLMs, Embeddings..."
                list="categories"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <datalist id="categories">
                {categories.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>

            <Button onClick={addCard} className="w-full">
              Criar Flashcard
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  }

  // List Mode (default)
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
            Flashcards
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {cards.length} {cards.length === 1 ? "card" : "cards"}
          </p>
        </div>
        <div className="flex gap-2">
          {cards.length > 0 && (
            <Button variant="primary" onClick={() => startStudy()}>
              Estudar Todos
            </Button>
          )}
          <Button onClick={() => setMode("create")}>
            + Novo Card
          </Button>
        </div>
      </div>

      {cards.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-12">
            <p className="text-4xl mb-3">🎴</p>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Nenhum flashcard ainda. Crie o primeiro!
            </p>
            <Button onClick={() => setMode("create")}>Criar Flashcard</Button>
          </Card.Body>
        </Card>
      ) : (
        <>
          {/* Categories */}
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((cat) => {
                const count = cards.filter((c) => c.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => startStudy(cat)}
                    className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800
                             text-gray-700 dark:text-gray-300 rounded-lg
                             hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>
          )}

          {/* Cards list */}
          <div className="grid gap-3 sm:grid-cols-2">
            {cards.map((card) => (
              <Card key={card.id}>
                <Card.Body className="p-4">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">
                        {card.category}
                      </p>
                      <p className="font-medium text-gray-800 dark:text-gray-100 truncate">
                        {card.front}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                        {card.back}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteCard(card.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      title="Excluir"
                    >
                      ✕
                    </button>
                  </div>
                  {(card.correct > 0 || card.wrong > 0) && (
                    <div className="flex gap-3 mt-3 text-xs">
                      <span className="text-green-600 dark:text-green-400">
                        ✓ {card.correct}
                      </span>
                      <span className="text-red-600 dark:text-red-400">
                        ✗ {card.wrong}
                      </span>
                    </div>
                  )}
                </Card.Body>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
