"""
Como a CONTEXT WINDOW afeta a qualidade das respostas
=====================================================

A context window (janela de contexto) eh o numero maximo de tokens
que um modelo pode "ver" de uma vez. Isso tem impacto DIRETO na
qualidade das respostas.
"""

import numpy as np
np.random.seed(42)

print("=" * 70)
print("CONTEXT WINDOW: COMO AFETA A QUALIDADE DAS RESPOSTAS")
print("=" * 70)

# ============================================================
# O QUE EH CONTEXT WINDOW?
# ============================================================
print("\n" + "=" * 70)
print("O QUE EH CONTEXT WINDOW?")
print("=" * 70)

print("""
Context Window = Numero MAXIMO de tokens que o modelo pode processar

Modelo          Context Window
------          --------------
GPT-3.5         4.096 tokens (~3.000 palavras)
GPT-4           8.192 tokens (~6.000 palavras)
GPT-4 Turbo     128.000 tokens (~96.000 palavras)
Claude 3        200.000 tokens (~150.000 palavras)

Token = pedaco de palavra (em media, 1 palavra = 1.3 tokens)

IMPORTANTE: O modelo so consegue "lembrar" do que esta DENTRO da janela!
""")

# ============================================================
# SIMULACAO: CONTEXTO PEQUENO vs GRANDE
# ============================================================
print("\n" + "=" * 70)
print("SIMULACAO: CONTEXTO PEQUENO vs GRANDE")
print("=" * 70)

# Simulando uma conversa
conversa_completa = [
    {"role": "usuario", "msg": "Ola! Meu nome eh Gabriel."},
    {"role": "assistente", "msg": "Ola Gabriel! Como posso ajudar?"},
    {"role": "usuario", "msg": "Estou estudando Machine Learning."},
    {"role": "assistente", "msg": "Otimo! ML eh fascinante. O que quer saber?"},
    {"role": "usuario", "msg": "Quero entender Transformers."},
    {"role": "assistente", "msg": "Transformers usam self-attention. Ja viu?"},
    {"role": "usuario", "msg": "Sim! Voce me explicou ontem."},
    {"role": "assistente", "msg": "Perfeito! Quer aprofundar em qual parte?"},
    {"role": "usuario", "msg": "Embeddings, por favor."},
    {"role": "assistente", "msg": "Embeddings convertem palavras em vetores numericos."},
    {"role": "usuario", "msg": "Qual meu nome mesmo?"},  # TESTE!
]

def simular_modelo(conversa, context_window_tokens):
    """Simula um modelo com context window limitada."""
    # Simplificacao: 1 mensagem = ~10 tokens
    tokens_por_msg = 10
    max_mensagens = context_window_tokens // tokens_por_msg

    # Pegar apenas as ultimas mensagens que cabem na janela
    if len(conversa) > max_mensagens:
        contexto_visivel = conversa[-max_mensagens:]
        mensagens_perdidas = len(conversa) - max_mensagens
    else:
        contexto_visivel = conversa
        mensagens_perdidas = 0

    return contexto_visivel, mensagens_perdidas

print("\n--- CENARIO 1: Context Window PEQUENA (50 tokens) ---")
print("-" * 50)

contexto_pequeno, perdidas = simular_modelo(conversa_completa, 50)
print(f"Mensagens na janela: {len(contexto_pequeno)}")
print(f"Mensagens PERDIDAS: {perdidas}")
print("\nO que o modelo VE:")
for msg in contexto_pequeno:
    print(f"  [{msg['role']}]: {msg['msg']}")

print("\nPROBLEMA: O modelo NAO lembra que o usuario se chama Gabriel!")
print("          A informacao foi 'cortada' da janela de contexto.")
print("          Resposta provavel: 'Desculpe, nao sei seu nome.'")

print("\n--- CENARIO 2: Context Window GRANDE (200 tokens) ---")
print("-" * 50)

contexto_grande, perdidas = simular_modelo(conversa_completa, 200)
print(f"Mensagens na janela: {len(contexto_grande)}")
print(f"Mensagens PERDIDAS: {perdidas}")
print("\nO que o modelo VE:")
for msg in contexto_grande:
    print(f"  [{msg['role']}]: {msg['msg']}")

print("\nSUCESSO: O modelo TEM acesso a todas as mensagens!")
print("         Resposta correta: 'Seu nome eh Gabriel!'")

# ============================================================
# VISUALIZACAO DA JANELA DESLIZANTE
# ============================================================
print("\n" + "=" * 70)
print("VISUALIZACAO: JANELA DESLIZANTE")
print("=" * 70)

print("""
Conforme a conversa cresce, mensagens antigas "saem" da janela:

Tempo 1: [msg1][msg2][msg3]        <- Tudo visivel
              |____________|
              context window

Tempo 2: [msg1][msg2][msg3][msg4]  <- msg1 saiu!
               |_______________|
               context window

Tempo 3: [msg1][msg2][msg3][msg4][msg5]  <- msg1 e msg2 sairam!
                    |_______________|
                    context window
""")

# Demonstracao animada
print("Demonstracao com context_window = 3 mensagens:")
print("-" * 50)

mensagens = ["Ola", "Nome: Gabriel", "Estudo ML", "Transformers", "Embeddings", "Meu nome?"]
context_size = 3

for i in range(1, len(mensagens) + 1):
    historico = mensagens[:i]

    if len(historico) > context_size:
        visivel = historico[-context_size:]
        fora = historico[:-context_size]
    else:
        visivel = historico
        fora = []

    print(f"\nTurno {i}:")
    if fora:
        print(f"  FORA da janela (esquecido): {fora}")
    print(f"  DENTRO da janela (visivel): {visivel}")

    # Checar se "Nome: Gabriel" ainda esta visivel
    if "Meu nome?" in visivel:
        if "Nome: Gabriel" in visivel:
            print("  -> Modelo SABE o nome!")
        else:
            print("  -> Modelo NAO sabe mais o nome! (foi esquecido)")

# ============================================================
# IMPACTO NA QUALIDADE
# ============================================================
print("\n" + "=" * 70)
print("IMPACTO NA QUALIDADE DAS RESPOSTAS")
print("=" * 70)

print("""
+------------------+------------------------------------------+
| Context Window   | Impacto                                  |
+------------------+------------------------------------------+
| PEQUENA          | - Esquece informacoes anteriores         |
| (ex: 4K tokens)  | - Respostas inconsistentes               |
|                  | - Nao consegue acompanhar conversas      |
|                  |   longas                                 |
|                  | - Nao consegue analisar documentos       |
|                  |   grandes                                |
+------------------+------------------------------------------+
| GRANDE           | - Lembra de toda a conversa              |
| (ex: 128K+)      | - Respostas consistentes                 |
|                  | - Consegue analisar livros inteiros      |
|                  | - Melhor para tarefas complexas          |
|                  | - Mais caro computacionalmente           |
+------------------+------------------------------------------+
""")

# ============================================================
# EXEMPLOS PRATICOS
# ============================================================
print("\n" + "=" * 70)
print("EXEMPLOS PRATICOS")
print("=" * 70)

exemplos = [
    {
        "tarefa": "Resumir um livro de 300 paginas",
        "tokens_necessarios": 150000,
        "funciona_4k": "NAO - livro nao cabe na janela",
        "funciona_128k": "SIM - livro inteiro cabe"
    },
    {
        "tarefa": "Conversa casual de 10 mensagens",
        "tokens_necessarios": 500,
        "funciona_4k": "SIM - cabe facilmente",
        "funciona_128k": "SIM - cabe facilmente"
    },
    {
        "tarefa": "Analisar codigo de 50 arquivos",
        "tokens_necessarios": 80000,
        "funciona_4k": "NAO - codigo nao cabe",
        "funciona_128k": "SIM - codigo cabe"
    },
    {
        "tarefa": "Lembrar instrucao dada 100 mensagens atras",
        "tokens_necessarios": 50000,
        "funciona_4k": "NAO - instrucao ja saiu da janela",
        "funciona_128k": "SIM - instrucao ainda visivel"
    },
]

for ex in exemplos:
    print(f"\nTarefa: {ex['tarefa']}")
    print(f"  Tokens necessarios: ~{ex['tokens_necessarios']:,}")
    print(f"  Com 4K tokens:   {ex['funciona_4k']}")
    print(f"  Com 128K tokens: {ex['funciona_128k']}")

# ============================================================
# RELACAO COM SELF-ATTENTION
# ============================================================
print("\n" + "=" * 70)
print("RELACAO COM SELF-ATTENTION")
print("=" * 70)

print("""
Por que existe limite de context window?

O Self-Attention compara CADA token com TODOS os outros:

  Tokens    Comparacoes     Memoria
  ------    -----------     -------
  100       100x100=10K     Pouca
  1.000     1Mx1M=1M        Media
  10.000    10Kx10K=100M    Muita
  100.000   100Kx100K=10B   ENORME!

Complexidade: O(n^2) onde n = numero de tokens

Quanto MAIOR a context window:
  - MAIS memoria necessaria
  - MAIS lento o processamento
  - MAIS caro o modelo

Por isso modelos com context window grande sao mais caros!
""")

# ============================================================
# TECNICAS PARA LIDAR COM LIMITES
# ============================================================
print("\n" + "=" * 70)
print("TECNICAS PARA LIDAR COM LIMITES")
print("=" * 70)

print("""
1. RESUMO (Summarization)
   - Resumir mensagens antigas antes de sairem da janela
   - Manter um "resumo" do contexto

2. RAG (Retrieval-Augmented Generation)
   - Armazenar informacoes em banco de dados
   - Buscar apenas informacoes relevantes quando necessario

3. MEMORIA EXTERNA
   - Salvar informacoes importantes em arquivo/banco
   - Carregar quando necessario

4. CHUNKING
   - Dividir documentos grandes em pedacos
   - Processar pedaco por pedaco

5. ATENCAO ESPARSA (Sparse Attention)
   - Nao comparar todos os tokens com todos
   - Reduz complexidade de O(n^2) para O(n*sqrt(n))
""")

# ============================================================
# DEMONSTRACAO COM CODIGO
# ============================================================
print("\n" + "=" * 70)
print("DEMONSTRACAO: SIMULANDO PERDA DE CONTEXTO")
print("=" * 70)

def simular_resposta(pergunta, contexto_visivel):
    """Simula resposta baseada no contexto visivel."""
    contexto_texto = " ".join([m["msg"] for m in contexto_visivel])

    # Simular busca de informacao no contexto
    if "nome" in pergunta.lower():
        if "Gabriel" in contexto_texto:
            return "Seu nome eh Gabriel!"
        else:
            return "Desculpe, nao sei seu nome. Pode me dizer?"

    if "estudando" in pergunta.lower():
        if "Machine Learning" in contexto_texto or "ML" in contexto_texto:
            return "Voce esta estudando Machine Learning!"
        else:
            return "Nao sei o que voce esta estudando."

    return "Resposta generica..."

print("\nPergunta: 'Qual meu nome?'")
print()

# Com contexto pequeno
ctx_pequeno, _ = simular_modelo(conversa_completa, 30)
resposta_pequeno = simular_resposta("Qual meu nome?", ctx_pequeno)
print(f"Context Window PEQUENA (30 tokens):")
print(f"  Contexto visivel: {[m['msg'][:20]+'...' for m in ctx_pequeno]}")
print(f"  Resposta: '{resposta_pequeno}'")

print()

# Com contexto grande
ctx_grande, _ = simular_modelo(conversa_completa, 200)
resposta_grande = simular_resposta("Qual meu nome?", ctx_grande)
print(f"Context Window GRANDE (200 tokens):")
print(f"  Contexto visivel: {[m['msg'][:20]+'...' for m in ctx_grande[:3]]}...")
print(f"  Resposta: '{resposta_grande}'")

# ============================================================
# RESUMO FINAL
# ============================================================
print("\n" + "=" * 70)
print("RESUMO FINAL")
print("=" * 70)

print("""
CONTEXT WINDOW = Memoria de curto prazo do modelo

1. LIMITE FISICO: Modelo so ve tokens dentro da janela

2. INFORMACAO PERDIDA: Mensagens antigas sao "esquecidas"

3. IMPACTO NA QUALIDADE:
   - Janela pequena = respostas inconsistentes
   - Janela grande = respostas mais coerentes

4. CUSTO COMPUTACIONAL:
   - Janela maior = mais memoria e processamento
   - Por isso modelos com janela grande sao mais caros

5. SOLUCOES:
   - Resumos, RAG, memoria externa, chunking

ANALOGIA:
---------
Context Window = Mesa de trabalho

- Mesa pequena: so cabem poucos papeis, precisa tirar uns para
  colocar outros (perde informacao)

- Mesa grande: cabem muitos papeis, consegue ver tudo de uma vez
  (mantem contexto completo)
""")
