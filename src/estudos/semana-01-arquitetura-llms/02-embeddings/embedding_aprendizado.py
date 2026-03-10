"""
Como os embeddings sao APRENDIDOS - Simulacao simplificada
"""

import numpy as np
np.random.seed(42)
np.set_printoptions(precision=3, suppress=True)

print("=" * 65)
print("COMO OS EMBEDDINGS SAO APRENDIDOS")
print("=" * 65)

# ============================================================
# PASSO 1: INICIALIZACAO ALEATORIA
# ============================================================
print("\n" + "-" * 65)
print("PASSO 1: INICIALIZACAO ALEATORIA")
print("-" * 65)

vocabulario = ["Eu", "amo", "cafe", "cha"]
vocab_size = len(vocabulario)
embedding_dim = 4

# NO INICIO: valores ALEATORIOS!
embedding_matrix = np.random.randn(vocab_size, embedding_dim) * 0.1

print("""
Quando o modelo eh criado, os embeddings comecam com
valores ALEATORIOS (geralmente pequenos, perto de zero):
""")

print("MATRIZ INICIAL (aleatoria):")
print("-" * 40)
for i, palavra in enumerate(vocabulario):
    print(f"  '{palavra}': {embedding_matrix[i]}")

# Calcular similaridade inicial
def cosine_similarity(v1, v2):
    return np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))

print("\nSimilaridade inicial (aleatoria):")
print(f"  'cafe' vs 'cha': {cosine_similarity(embedding_matrix[2], embedding_matrix[3]):.1%}")
print("  (valores aleatorios - nao significa nada!)")

# ============================================================
# PASSO 2: O TREINAMENTO
# ============================================================
print("\n" + "-" * 65)
print("PASSO 2: O TREINAMENTO (simplificado)")
print("-" * 65)

print("""
O modelo ve MILHOES de frases como:
  - "Eu amo cafe"
  - "Eu amo cha"
  - "Voce quer cafe?"
  - "Voce quer cha?"

E percebe: "cafe" e "cha" aparecem nos MESMOS CONTEXTOS!
Entao o modelo AJUSTA os vetores para ficarem similares.

Como? Atraves do BACKPROPAGATION (gradiente descendente):
""")

print("Simulando o aprendizado...")
print("-" * 40)

# Simulacao MUITO simplificada do aprendizado
# Na realidade, isso acontece com backpropagation

learning_rate = 0.1
n_epochs = 5

# "Exemplos de treinamento" simplificados:
# Queremos que palavras em contextos similares fiquem proximas
# cafe e cha aparecem em contextos parecidos -> aproximar
# Eu e cafe sao diferentes -> afastar

for epoch in range(n_epochs):
    # Aproximar "cafe" e "cha" (contextos similares)
    diff = embedding_matrix[2] - embedding_matrix[3]  # cafe - cha
    embedding_matrix[2] -= learning_rate * diff * 0.5  # cafe vai em direcao a cha
    embedding_matrix[3] += learning_rate * diff * 0.5  # cha vai em direcao a cafe

    # Afastar "Eu" de "cafe" (contextos diferentes)
    diff2 = embedding_matrix[0] - embedding_matrix[2]  # Eu - cafe
    embedding_matrix[0] += learning_rate * diff2 * 0.1  # Eu se afasta de cafe

    sim_cafe_cha = cosine_similarity(embedding_matrix[2], embedding_matrix[3])
    sim_eu_cafe = cosine_similarity(embedding_matrix[0], embedding_matrix[2])

    print(f"  Epoca {epoch+1}: cafe-cha={sim_cafe_cha:>6.1%}  |  Eu-cafe={sim_eu_cafe:>6.1%}")

# ============================================================
# PASSO 3: RESULTADO FINAL
# ============================================================
print("\n" + "-" * 65)
print("PASSO 3: RESULTADO APOS TREINAMENTO")
print("-" * 65)

print("\nMATRIZ FINAL (apos aprendizado):")
print("-" * 40)
for i, palavra in enumerate(vocabulario):
    print(f"  '{palavra}': {embedding_matrix[i]}")

print("\nSimilaridades finais:")
print(f"  'cafe' vs 'cha': {cosine_similarity(embedding_matrix[2], embedding_matrix[3]):.1%} (ALTA - bebidas!)")
print(f"  'Eu' vs 'cafe':  {cosine_similarity(embedding_matrix[0], embedding_matrix[2]):.1%} (baixa - diferentes)")

# ============================================================
# RESUMO
# ============================================================
print("\n" + "=" * 65)
print("RESUMO: DE ONDE VEM OS NUMEROS?")
print("=" * 65)

print("""
1. INICIO: Numeros ALEATORIOS (nao significam nada)

2. TREINAMENTO: O modelo ve bilhoes de textos e:
   - Palavras que aparecem em contextos SIMILARES
     -> vetores sao APROXIMADOS
   - Palavras que aparecem em contextos DIFERENTES
     -> vetores sao AFASTADOS

3. FINAL: Os numeros CAPTURAM SIGNIFICADO!
   - [1.0, 0.5, 0.2, 0.1] para "Eu"
   - [0.2, 0.1, 0.7, 0.9] para "cafe"

   Esses numeros especificos NAO foram escolhidos por humanos.
   Eles EMERGIRAM do treinamento!

ANALOGIA:
---------
Imagine aprender a reconhecer rostos:
- No inicio: voce nao sabe nada
- Apos ver milhoes de rostos: seu cerebro "aprende" padroes

Os embeddings sao como a "memoria" do modelo sobre palavras!
""")

print("=" * 65)
print("MODELOS REAIS")
print("=" * 65)

print("""
Em modelos como GPT, BERT, etc:

- Vocabulario: ~50.000 palavras
- Dimensao: 768 a 4096 numeros por palavra
- Treinamento: bilhoes de textos da internet
- Tempo: semanas em centenas de GPUs
- Custo: milhoes de dolares!

Os embeddings que usamos nos exemplos foram INVENTADOS
para facilitar o entendimento. Em modelos reais, eles
sao aprendidos e capturam relacoes semanticas complexas:

  rei - homem + mulher = rainha  (famoso exemplo do Word2Vec!)
""")
