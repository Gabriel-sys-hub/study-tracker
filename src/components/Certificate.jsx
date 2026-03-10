import { useState, useRef } from "react";
import { Card, Button } from "./ui";
import { loadFromStorage } from "../utils";

/**
 * Gerador de Certificados de Conclusão
 * Gera certificados por mês ou geral
 */
export default function Certificate({ totalTopics = 80, completedTopics = 0 }) {
  const [selectedCert, setSelectedCert] = useState(null);
  const [userName, setUserName] = useState("");
  const certificateRef = useRef(null);

  const progressData = loadFromStorage("study-tracker-v1", { progress: {} }).progress;
  const goalsData = loadFromStorage("study-tracker-goals", { studyDays: [] });

  // Calculate progress by month
  const months = [
    {
      id: 1,
      name: "Mês 1",
      title: "IA & LLMs",
      subtitle: "Arquitetura, Prompt Engineering, APIs e Function Calling",
      weeks: [1, 2, 3, 4],
      color: "#3B82F6",
      gradient: "from-blue-500 to-blue-700",
    },
    {
      id: 2,
      name: "Mês 2",
      title: "Agentes & RAG",
      subtitle: "Embeddings, Busca Vetorial, Agentes e Observabilidade",
      weeks: [5, 6, 7, 8],
      color: "#8B5CF6",
      gradient: "from-purple-500 to-purple-700",
    },
    {
      id: 3,
      name: "Mês 3",
      title: "Cloud & Ferramentas",
      subtitle: "AWS, Arquitetura de Sistemas, Dev Tools e FinOps",
      weeks: [9, 10, 11, 12],
      color: "#10B981",
      gradient: "from-green-500 to-green-700",
    },
    {
      id: 4,
      name: "Mês 4",
      title: "Full Stack Moderno",
      subtitle: "TypeScript, Next.js 15, tRPC, Drizzle e Deploy",
      weeks: [13, 14, 15, 16],
      color: "#F97316",
      gradient: "from-orange-500 to-orange-700",
    },
  ].map((month) => {
    let completed = 0;
    let total = 0;

    month.weeks.forEach((week) => {
      for (let i = 0; i < 5; i++) {
        total++;
        if (progressData[`${week}-${i}`] === "done") {
          completed++;
        }
      }
    });

    return {
      ...month,
      completed,
      total,
      percent: Math.round((completed / total) * 100),
      isComplete: completed === total,
    };
  });

  const overallPercent = Math.round((completedTopics / totalTopics) * 100);
  const isFullyComplete = completedTopics === totalTopics;
  const completionDate = new Date().toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Print certificate
  const printCertificate = () => {
    const printContent = certificateRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Certificado de Conclusão</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Georgia', serif; }
            .certificate {
              width: 100%;
              max-width: 800px;
              margin: 0 auto;
              padding: 40px;
              border: 8px double #333;
              background: linear-gradient(135deg, #fefefe 0%, #f5f5f5 100%);
            }
            .header { text-align: center; margin-bottom: 30px; }
            .title { font-size: 36px; color: #1a1a1a; margin-bottom: 10px; }
            .subtitle { font-size: 18px; color: #666; }
            .content { text-align: center; margin: 40px 0; }
            .name { font-size: 32px; font-weight: bold; color: #1a1a1a; margin: 20px 0; border-bottom: 2px solid #333; padding-bottom: 10px; }
            .course { font-size: 20px; color: #333; margin: 20px 0; }
            .date { font-size: 14px; color: #666; margin-top: 30px; }
            .badge { font-size: 48px; margin: 20px 0; }
            .footer { display: flex; justify-content: space-between; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; }
            .signature { text-align: center; }
            .signature-line { width: 150px; border-top: 1px solid #333; margin: 0 auto 5px; }
            .signature-label { font-size: 12px; color: #666; }
            @media print {
              body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
            Certificados
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Gere certificados de conclusão dos módulos
          </p>
        </div>
      </div>

      {/* Name input */}
      <Card className="mb-6">
        <Card.Body className="p-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Seu nome (para o certificado)
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Digite seu nome completo"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
          />
        </Card.Body>
      </Card>

      {/* Available certificates */}
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
        Certificados Disponíveis
      </h3>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {months.map((month) => (
          <Card
            key={month.id}
            className={`cursor-pointer transition-all ${
              month.isComplete
                ? "hover:shadow-lg"
                : "opacity-60"
            } ${
              selectedCert === month.id
                ? "ring-2 ring-blue-500"
                : ""
            }`}
            onClick={() => month.isComplete && setSelectedCert(month.id)}
          >
            <Card.Body className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-800 dark:text-gray-100">
                    {month.name}: {month.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {month.completed}/{month.total} tópicos
                  </p>
                </div>
                {month.isComplete ? (
                  <span className="text-2xl">🏆</span>
                ) : (
                  <span className="text-sm text-gray-400">
                    {month.percent}%
                  </span>
                )}
              </div>
              {!month.isComplete && (
                <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${month.gradient}`}
                    style={{ width: `${month.percent}%` }}
                  />
                </div>
              )}
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Full course certificate */}
      <Card
        className={`cursor-pointer transition-all mb-6 ${
          isFullyComplete ? "hover:shadow-lg" : "opacity-60"
        } ${selectedCert === "full" ? "ring-2 ring-blue-500" : ""}`}
        onClick={() => isFullyComplete && setSelectedCert("full")}
      >
        <Card.Body className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-800 dark:text-gray-100">
                Certificado Completo
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Dev Avançado com IA - 16 Semanas
              </p>
            </div>
            {isFullyComplete ? (
              <span className="text-3xl">🎓</span>
            ) : (
              <span className="text-sm text-gray-400">{overallPercent}%</span>
            )}
          </div>
          {!isFullyComplete && (
            <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500"
                style={{ width: `${overallPercent}%` }}
              />
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Certificate Preview */}
      {selectedCert && userName && (
        <>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
            Prévia do Certificado
          </h3>

          <Card className="mb-4 overflow-hidden">
            <div
              ref={certificateRef}
              className="certificate bg-gradient-to-br from-white to-gray-100 p-8"
            >
              <div className="header text-center mb-8">
                <p className="text-4xl font-serif font-bold text-gray-800 mb-2">
                  Certificado de Conclusão
                </p>
                <p className="text-lg text-gray-600">
                  Este certificado é concedido a
                </p>
              </div>

              <div className="content text-center">
                <p className="name text-3xl font-bold text-gray-900 border-b-2 border-gray-800 pb-2 mx-auto inline-block px-8">
                  {userName}
                </p>

                <p className="text-lg text-gray-700 mt-6">
                  por concluir com sucesso o módulo
                </p>

                <p className="course text-2xl font-bold mt-4" style={{
                  color: selectedCert === "full"
                    ? "#1a1a1a"
                    : months.find((m) => m.id === selectedCert)?.color
                }}>
                  {selectedCert === "full"
                    ? "Dev Avançado com IA - Curso Completo"
                    : `${months.find((m) => m.id === selectedCert)?.name}: ${
                        months.find((m) => m.id === selectedCert)?.title
                      }`}
                </p>

                <p className="text-sm text-gray-600 mt-2">
                  {selectedCert === "full"
                    ? "16 Semanas · 80 Tópicos · 4 Meses de Estudo Intensivo"
                    : months.find((m) => m.id === selectedCert)?.subtitle}
                </p>

                <p className="badge text-5xl mt-6">
                  {selectedCert === "full" ? "🎓" : "🏆"}
                </p>

                <p className="date text-sm text-gray-500 mt-6">
                  Emitido em {completionDate}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {goalsData.studyDays.length} dias de estudo dedicados
                </p>
              </div>

              <div className="footer flex justify-between mt-8 pt-4 border-t border-gray-300">
                <div className="signature text-center">
                  <div className="signature-line w-36 border-t border-gray-800 mx-auto mb-1" />
                  <p className="signature-label text-xs text-gray-600">
                    Study Tracker
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-mono text-gray-400">
                    #{Date.now().toString(36).toUpperCase()}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Button onClick={printCertificate} className="w-full">
            Imprimir / Salvar PDF
          </Button>
        </>
      )}

      {selectedCert && !userName && (
        <Card className="border-yellow-300 dark:border-yellow-700">
          <Card.Body className="text-center py-4">
            <p className="text-yellow-600 dark:text-yellow-400">
              Digite seu nome acima para visualizar o certificado
            </p>
          </Card.Body>
        </Card>
      )}

      {!selectedCert && (
        <Card>
          <Card.Body className="text-center py-8">
            <p className="text-4xl mb-3">📜</p>
            <p className="text-gray-600 dark:text-gray-400">
              Complete um módulo para desbloquear seu certificado
            </p>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}
