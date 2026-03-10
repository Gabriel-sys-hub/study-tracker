"""
Self-Attention EXPLICADO passo a passo.
Cada etapa é detalhada para fácil entendimento.
"""

import numpy as np
np.set_printoptions(precision=2, suppress=True)


def softmax(x):
    exp_x = np.exp(x - np.max(x, axis=-1, keepdims=True))
    return exp_x / np.sum(exp_x, axis=-1, keepdims=True)


print("=" * 70)
print("SELF-ATTENTION: EXPLICAÇÃO PASSO A PASSO")
print("=" * 70)

# ============================================================================
# PASSO 0: NOSSA FRASE DE EXEMPLO
# ============================================================================
print("\n" + "=" * 70)
print("PASSO 0: NOSSA FRASE")
print("=" * 70)

tokens = ['Eu', 'amo', 'café']
print(f"\nFrase: '{' '.join(tokens)}'")
print(f"Tokens: {tokens}")
print(f"Número de tokens: {len(tokens)}")

print("""
Cada palavra da frase é um "token".
O self-attention vai descobrir como cada token se relaciona com os outros.

Por exemplo:
- "amo" deve prestar atenção em "Eu" (quem ama?)
- "amo" deve prestar atenção em "café" (ama o quê?)
""")

# ============================================================================
# PASSO 1: EMBEDDINGS (Representação numérica das palavras)
# ============================================================================
print("\n" + "=" * 70)
print("PASSO 1: EMBEDDINGS (converter palavras em números)")
print("=" * 70)

np.random.seed(42)

# Cada token vira um vetor de números (embedding)
# Na prática, isso vem de uma tabela aprendida. Aqui simulamos.
d_model = 4  # Dimensão pequena para facilitar visualização

X = np.array([
    [1.0, 0.5, 0.2, 0.1],   # "Eu" - representa conceito de pessoa/sujeito
    [0.3, 0.8, 0.9, 0.2],   # "amo" - representa ação/verbo
    [0.2, 0.1, 0.7, 0.9],   # "café" - representa objeto/substantivo
])

print(f"\nMatriz de Embeddings X (shape: {X.shape}):")
print(f"  - {len(tokens)} tokens (linhas)")
print(f"  - {d_model} dimensões por token (colunas)")
print()

for i, token in enumerate(tokens):
    print(f"  '{token}': {X[i]}")

print("""
Cada linha é um token, cada coluna é uma "característica" numérica.
Tokens similares teriam vetores similares.
""")

# ============================================================================
# PASSO 2: CRIAR QUERY, KEY, VALUE
# ============================================================================
print("\n" + "=" * 70)
print("PASSO 2: CRIAR QUERY (Q), KEY (K) e VALUE (V)")
print("=" * 70)

print("""
Analogia do Self-Attention:
Imagine uma BIBLIOTECA onde você busca informação.

- QUERY (Q) = "Sua pergunta" - O que este token está procurando?
- KEY (K)   = "Título do livro" - O que este token oferece/representa?
- VALUE (V) = "Conteúdo do livro" - Qual informação este token carrega?

O processo:
1. Cada token faz uma PERGUNTA (Query)
2. Cada token tem uma ETIQUETA (Key)
3. Comparamos Query com todas as Keys para achar matches
4. Pegamos o VALUE dos tokens que combinam
""")

# Matrizes de pesos (na prática, são aprendidas pelo modelo)
d_k = 3  # Dimensão de Q e K
d_v = 3  # Dimensão de V

W_q = np.array([
    [0.5, 0.2, 0.1],
    [0.3, 0.6, 0.2],
    [0.1, 0.3, 0.7],
    [0.2, 0.1, 0.4],
])

W_k = np.array([
    [0.4, 0.3, 0.2],
    [0.2, 0.5, 0.3],
    [0.3, 0.2, 0.6],
    [0.1, 0.4, 0.1],
])

W_v = np.array([
    [0.6, 0.1, 0.3],
    [0.2, 0.7, 0.1],
    [0.1, 0.2, 0.8],
    [0.3, 0.3, 0.2],
])

# Calcular Q, K, V
Q = X @ W_q  # Query: O que cada token PROCURA
K = X @ W_k  # Key: O que cada token OFERECE
V = X @ W_v  # Value: A informação de cada token

print("QUERY (Q) - 'O que cada token está procurando?'")
print(f"  Cálculo: Q = X @ W_q")
print(f"  Shape: {Q.shape}")
for i, token in enumerate(tokens):
    print(f"  '{token}' procura: {Q[i]}")

print("\nKEY (K) - 'O que cada token oferece/representa?'")
print(f"  Cálculo: K = X @ W_k")
print(f"  Shape: {K.shape}")
for i, token in enumerate(tokens):
    print(f"  '{token}' oferece: {K[i]}")

print("\nVALUE (V) - 'Qual informação cada token carrega?'")
print(f"  Cálculo: V = X @ W_v")
print(f"  Shape: {V.shape}")
for i, token in enumerate(tokens):
    print(f"  '{token}' carrega: {V[i]}")

# ============================================================================
# PASSO 3: CALCULAR SCORES (Similaridade Query-Key)
# ============================================================================
print("\n" + "=" * 70)
print("PASSO 3: CALCULAR SCORES (Quão bem Query combina com Key?)")
print("=" * 70)

print("""
Agora comparamos a QUERY de cada token com a KEY de TODOS os tokens.
Isso nos diz: "Quão relevante é o token J para o token I?"

Score alto = Query e Key combinam bem = tokens são relevantes um para o outro
Score baixo = Query e Key não combinam = tokens são menos relevantes
""")

# Scores = Q @ K^T (produto escalar entre queries e keys)
scores = Q @ K.T

print(f"Cálculo: Scores = Q @ K.T")
print(f"Shape dos Scores: {scores.shape} (cada token vs cada token)")
print()

print("Matriz de Scores (linhas=Query, colunas=Key):")
print(f"{'':>8}", end="")
for t in tokens:
    print(f"{t:>8}", end="")
print()

for i, token in enumerate(tokens):
    print(f"{token:>8}", end="")
    for j in range(len(tokens)):
        print(f"{scores[i,j]:>8.2f}", end="")
    print()

print("\nInterpretação:")
for i, token_i in enumerate(tokens):
    max_j = np.argmax(scores[i])
    print(f"  '{token_i}' tem score mais alto com '{tokens[max_j]}' ({scores[i, max_j]:.2f})")

# ============================================================================
# PASSO 4: ESCALAR OS SCORES
# ============================================================================
print("\n" + "=" * 70)
print("PASSO 4: ESCALAR OS SCORES (dividir por sqrt(d_k))")
print("=" * 70)

print(f"""
Dividimos os scores por sqrtd_k = sqrt{d_k} = {np.sqrt(d_k):.2f}

Por quê? Sem isso, quando d_k é grande, os scores ficam muito grandes,
e o softmax (próximo passo) ficaria muito "extremo" (quase 0 ou 1).
Escalar mantém os valores em uma faixa estável.
""")

scaled_scores = scores / np.sqrt(d_k)

print("Scores escalados:")
print(f"{'':>8}", end="")
for t in tokens:
    print(f"{t:>8}", end="")
print()

for i, token in enumerate(tokens):
    print(f"{token:>8}", end="")
    for j in range(len(tokens)):
        print(f"{scaled_scores[i,j]:>8.2f}", end="")
    print()

# ============================================================================
# PASSO 5: SOFTMAX (Converter scores em probabilidades)
# ============================================================================
print("\n" + "=" * 70)
print("PASSO 5: SOFTMAX (Converter scores em pesos de atenção)")
print("=" * 70)

print("""
O softmax converte scores em "probabilidades" que somam 1.
Isso nos dá os PESOS DE ATENÇÃO: quanto cada token deve "olhar" para os outros.

Fórmula: softmax(x_i) = e^(x_i) / sum e^(x_j)
""")

attention_weights = softmax(scaled_scores)

print("PESOS DE ATENÇÃO (cada linha soma 1.0):")
print(f"{'':>8}", end="")
for t in tokens:
    print(f"{t:>8}", end="")
print("    SOMA")

for i, token in enumerate(tokens):
    print(f"{token:>8}", end="")
    for j in range(len(tokens)):
        print(f"{attention_weights[i,j]:>8.1%}", end="")
    print(f"  = {attention_weights[i].sum():.0%}")

print("\n" + "-" * 50)
print("INTERPRETAÇÃO DOS PESOS DE ATENÇÃO:")
print("-" * 50)

for i, token_i in enumerate(tokens):
    print(f"\n'{token_i}' distribui sua atenção assim:")
    sorted_idx = np.argsort(attention_weights[i])[::-1]
    for j in sorted_idx:
        bar = "#" * int(attention_weights[i,j] * 20)
        print(f"  -> '{tokens[j]}': {attention_weights[i,j]:>6.1%} {bar}")

# ============================================================================
# PASSO 6: CALCULAR OUTPUT (Média ponderada dos Values)
# ============================================================================
print("\n" + "=" * 70)
print("PASSO 6: CALCULAR OUTPUT (Média ponderada dos Values)")
print("=" * 70)

print("""
Agora usamos os pesos de atenção para combinar os VALUES.
Cada token recebe informação dos outros tokens, ponderada pela atenção.

Output = Attention_Weights @ V

É como dizer: "Para entender 'amo', pegue 30% da info de 'Eu',
40% da info de 'amo', e 30% da info de 'café'."
""")

output = attention_weights @ V

print("Cálculo do Output para cada token:")
print("-" * 50)

for i, token_i in enumerate(tokens):
    print(f"\nOutput de '{token_i}':")
    print(f"  = ", end="")
    terms = []
    for j, token_j in enumerate(tokens):
        terms.append(f"{attention_weights[i,j]:.2f} × V['{token_j}']")
    print(" + ".join(terms))

    print(f"  = ", end="")
    terms = []
    for j in range(len(tokens)):
        terms.append(f"{attention_weights[i,j]:.2f} × {V[j]}")
    print(" + ".join(terms))

    print(f"  = {output[i]}")

print("\n" + "=" * 70)
print("RESULTADO FINAL")
print("=" * 70)

print(f"\nOutput do Self-Attention (shape: {output.shape}):")
for i, token in enumerate(tokens):
    print(f"  '{token}': {output[i]}")

print("""
O QUE MUDOU?
Antes: Cada token tinha sua própria representação isolada.
Depois: Cada token agora contém informação dos tokens relevantes!

Por exemplo, o output de 'amo' agora "sabe" sobre 'Eu' e 'café',
porque prestou atenção neles. Isso permite que o modelo entenda
relações como "quem ama" e "o que é amado".
""")

print("=" * 70)
print("RESUMO DO SELF-ATTENTION")
print("=" * 70)
print("""
1. EMBEDDING: Palavras viram vetores numéricos

2. Q, K, V: Cada token gera:
   - Query: "O que eu procuro?"
   - Key: "O que eu ofereço?"
   - Value: "Minha informação"

3. SCORES: Compara Query de cada token com Key de todos
   (produto escalar = similaridade)

4. ESCALAR: Divide por sqrtd_k para estabilidade numérica

5. SOFTMAX: Converte scores em pesos (somam 1)

6. OUTPUT: Média ponderada dos Values pelos pesos

RESULTADO: Cada token agora "conhece" os tokens relevantes!
""")
