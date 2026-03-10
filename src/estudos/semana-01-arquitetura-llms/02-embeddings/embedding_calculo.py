"""
Como o vetor de "Eu" eh calculado - passo a passo
"""

import numpy as np
np.set_printoptions(precision=2, suppress=True)

print("=" * 65)
print("COMO O VETOR DE 'Eu' EH CALCULADO")
print("=" * 65)

# ============================================================
# PASSO 1: VOCABULARIO E ONE-HOT
# ============================================================
print("\n" + "-" * 65)
print("PASSO 1: ONE-HOT DE 'Eu'")
print("-" * 65)

vocabulario = ["Eu", "amo", "cafe", "voce", "cha", "agua"]
vocab_size = len(vocabulario)

print(f"\nVocabulario ({vocab_size} palavras):")
for i, p in enumerate(vocabulario):
    print(f"  indice {i}: '{p}'")

# One-hot de "Eu" (indice 0)
one_hot_eu = np.array([1, 0, 0, 0, 0, 0])

print(f"\nOne-hot de 'Eu' (indice 0):")
print(f"  {one_hot_eu}")
print(f"  Shape: ({vocab_size},)")

# ============================================================
# PASSO 2: MATRIZ DE EMBEDDING
# ============================================================
print("\n" + "-" * 65)
print("PASSO 2: MATRIZ DE EMBEDDING")
print("-" * 65)

embedding_dim = 4

# Matriz de embedding: cada LINHA eh o vetor de uma palavra
# Shape: (vocab_size, embedding_dim) = (6, 4)
embedding_matrix = np.array([
    [1.0, 0.5, 0.2, 0.1],   # linha 0: "Eu"
    [0.3, 0.8, 0.9, 0.2],   # linha 1: "amo"
    [0.2, 0.1, 0.7, 0.9],   # linha 2: "cafe"
    [0.9, 0.4, 0.3, 0.1],   # linha 3: "voce"
    [0.1, 0.2, 0.6, 0.8],   # linha 4: "cha"
    [0.2, 0.3, 0.5, 0.7],   # linha 5: "agua"
])

print(f"\nMatriz de Embedding E:")
print(f"Shape: ({vocab_size}, {embedding_dim}) = (palavras, dimensoes)")
print()
print("        dim0  dim1  dim2  dim3")
print("        ----  ----  ----  ----")
for i, palavra in enumerate(vocabulario):
    print(f"{palavra:>6}  {embedding_matrix[i]}")

# ============================================================
# PASSO 3: O CALCULO
# ============================================================
print("\n" + "-" * 65)
print("PASSO 3: O CALCULO (one_hot @ embedding_matrix)")
print("-" * 65)

print("""
Para obter o vetor de "Eu", multiplicamos:

    one_hot_eu  @  embedding_matrix  =  vetor_eu
      (1, 6)    @     (6, 4)         =   (1, 4)
""")

print("Visualizando a multiplicacao:")
print()
print("one_hot_eu = [1, 0, 0, 0, 0, 0]")
print()
print("                    dim0  dim1  dim2  dim3")
print("                    ----  ----  ----  ----")
print("embedding_matrix = [1.0,  0.5,  0.2,  0.1]  <- 'Eu'   (x1)")
print("                   [0.3,  0.8,  0.9,  0.2]  <- 'amo'  (x0)")
print("                   [0.2,  0.1,  0.7,  0.9]  <- 'cafe' (x0)")
print("                   [0.9,  0.4,  0.3,  0.1]  <- 'voce' (x0)")
print("                   [0.1,  0.2,  0.6,  0.8]  <- 'cha'  (x0)")
print("                   [0.2,  0.3,  0.5,  0.7]  <- 'agua' (x0)")

print("\n" + "-" * 65)
print("CALCULO ELEMENTO POR ELEMENTO:")
print("-" * 65)

print("""
vetor_eu[0] = 1*1.0 + 0*0.3 + 0*0.2 + 0*0.9 + 0*0.1 + 0*0.2 = 1.0
vetor_eu[1] = 1*0.5 + 0*0.8 + 0*0.1 + 0*0.4 + 0*0.2 + 0*0.3 = 0.5
vetor_eu[2] = 1*0.2 + 0*0.9 + 0*0.7 + 0*0.3 + 0*0.6 + 0*0.5 = 0.2
vetor_eu[3] = 1*0.1 + 0*0.2 + 0*0.9 + 0*0.1 + 0*0.8 + 0*0.7 = 0.1
""")

# Calculo real
vetor_eu = one_hot_eu @ embedding_matrix

print(f"RESULTADO: vetor_eu = {vetor_eu}")

print("\n" + "=" * 65)
print("OBSERVACAO IMPORTANTE")
print("=" * 65)

print("""
Note que o one-hot [1,0,0,0,0,0] simplesmente SELECIONA
a primeira linha da matriz de embedding!

Isso eh equivalente a:
    vetor_eu = embedding_matrix[0]

Por isso, na pratica, fazemos apenas um LOOKUP (busca por indice),
que eh muito mais rapido que multiplicacao de matrizes:
""")

vetor_eu_lookup = embedding_matrix[0]
print(f"embedding_matrix[0] = {vetor_eu_lookup}")

print("\n" + "=" * 65)
print("EXEMPLO COM OUTRA PALAVRA: 'cafe'")
print("=" * 65)

one_hot_cafe = np.array([0, 0, 1, 0, 0, 0])  # indice 2
print(f"\none_hot_cafe = {one_hot_cafe}")
print(f"\nCalculo: one_hot_cafe @ embedding_matrix")

vetor_cafe = one_hot_cafe @ embedding_matrix
print(f"Resultado: {vetor_cafe}")

print(f"\nOu simplesmente: embedding_matrix[2] = {embedding_matrix[2]}")

print("\n" + "=" * 65)
print("RESUMO VISUAL")
print("=" * 65)

print("""
VOCABULARIO        ONE-HOT              EMBEDDING MATRIX         VETOR
-----------        -------              ----------------         -----

"Eu"   (idx 0)  -> [1,0,0,0,0,0]  @  [[1.0, 0.5, 0.2, 0.1],  -> [1.0, 0.5, 0.2, 0.1]
                                      [0.3, 0.8, 0.9, 0.2],
                                      [0.2, 0.1, 0.7, 0.9],
                                      [0.9, 0.4, 0.3, 0.1],
                                      [0.1, 0.2, 0.6, 0.8],
                                      [0.2, 0.3, 0.5, 0.7]]

"cafe" (idx 2)  -> [0,0,1,0,0,0]  @  [mesma matriz]          -> [0.2, 0.1, 0.7, 0.9]

O one-hot com 1 na posicao i SELECIONA a linha i da matriz!
""")
