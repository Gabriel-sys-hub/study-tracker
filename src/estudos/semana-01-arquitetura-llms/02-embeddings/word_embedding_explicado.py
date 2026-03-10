"""
Como palavras viram numeros (Word Embedding) - Explicacao passo a passo
"""

import numpy as np
np.random.seed(42)

print("=" * 60)
print("COMO PALAVRAS VIRAM NUMEROS (WORD EMBEDDING)")
print("=" * 60)

# ============================================================
# PASSO 1: VOCABULARIO
# ============================================================
print("\n" + "-" * 60)
print("PASSO 1: CRIAR VOCABULARIO")
print("-" * 60)

vocabulario = ["Eu", "amo", "cafe", "voce", "cha", "agua"]
print(f"\nVocabulario: {vocabulario}")
print(f"Tamanho: {len(vocabulario)} palavras")

print("\nCada palavra ganha um indice (numero):")
for i, palavra in enumerate(vocabulario):
    print(f"  '{palavra}' -> indice {i}")

# ============================================================
# PASSO 2: ONE-HOT ENCODING
# ============================================================
print("\n" + "-" * 60)
print("PASSO 2: ONE-HOT ENCODING (representacao inicial)")
print("-" * 60)

print("""
One-hot = vetor com 1 na posicao da palavra, 0 no resto.
Problema: vetores muito grandes e esparsos!
""")

def one_hot(palavra, vocab):
    vetor = [0] * len(vocab)
    vetor[vocab.index(palavra)] = 1
    return vetor

for palavra in ["Eu", "amo", "cafe"]:
    oh = one_hot(palavra, vocabulario)
    print(f"  '{palavra}' -> {oh}")

print("\nProblema: se vocabulario tem 50.000 palavras,")
print("cada vetor teria 50.000 numeros (quase todos zeros)!")

# ============================================================
# PASSO 3: MATRIZ DE EMBEDDING
# ============================================================
print("\n" + "-" * 60)
print("PASSO 3: MATRIZ DE EMBEDDING (solucao)")
print("-" * 60)

print("""
Solucao: criar uma TABELA que mapeia cada palavra
para um vetor PEQUENO e DENSO (ex: 4 numeros).

Essa tabela eh APRENDIDA durante o treinamento!
""")

embedding_dim = 4  # Cada palavra vira 4 numeros

# Matriz de embedding (na pratica, eh aprendida pelo modelo)
# Aqui vamos criar uma para exemplo
embedding_matrix = np.array([
    [1.0, 0.5, 0.2, 0.1],   # "Eu" - indice 0
    [0.3, 0.8, 0.9, 0.2],   # "amo" - indice 1
    [0.2, 0.1, 0.7, 0.9],   # "cafe" - indice 2
    [0.9, 0.4, 0.3, 0.1],   # "voce" - indice 3
    [0.1, 0.2, 0.6, 0.8],   # "cha" - indice 4
    [0.2, 0.3, 0.5, 0.7],   # "agua" - indice 5
])

print("MATRIZ DE EMBEDDING:")
print(f"Dimensao: {embedding_matrix.shape} ({len(vocabulario)} palavras x {embedding_dim} dimensoes)")
print()
print(f"{'Palavra':<10} {'Indice':<8} {'Vetor Embedding'}")
print("-" * 50)
for i, palavra in enumerate(vocabulario):
    print(f"{palavra:<10} {i:<8} {embedding_matrix[i]}")

# ============================================================
# PASSO 4: LOOKUP (BUSCAR O VETOR)
# ============================================================
print("\n" + "-" * 60)
print("PASSO 4: LOOKUP (buscar vetor de uma palavra)")
print("-" * 60)

print("""
Para converter "Eu" em numeros:
1. Achar o indice de "Eu" no vocabulario
2. Pegar a linha correspondente na matriz
""")

palavra = "Eu"
indice = vocabulario.index(palavra)
vetor = embedding_matrix[indice]

print(f"Palavra: '{palavra}'")
print(f"Indice no vocabulario: {indice}")
print(f"Vetor embedding: {vetor}")

print("\n" + "=" * 60)
print("EXEMPLO COMPLETO: FRASE 'Eu amo cafe'")
print("=" * 60)

frase = ["Eu", "amo", "cafe"]
print(f"\nFrase: {frase}")
print("\nConversao palavra por palavra:")

matriz_frase = []
for palavra in frase:
    idx = vocabulario.index(palavra)
    vetor = embedding_matrix[idx]
    matriz_frase.append(vetor)
    print(f"  '{palavra}' -> indice {idx} -> {vetor}")

matriz_frase = np.array(matriz_frase)
print(f"\nMATRIZ FINAL X (entrada do self-attention):")
print(f"Shape: {matriz_frase.shape} ({len(frase)} tokens x {embedding_dim} dimensoes)")
print()
print(matriz_frase)

# ============================================================
# COMO OS EMBEDDINGS SAO APRENDIDOS?
# ============================================================
print("\n" + "-" * 60)
print("COMO OS EMBEDDINGS SAO APRENDIDOS?")
print("-" * 60)

print("""
Os numeros da matriz NAO sao inventados!
Eles sao APRENDIDOS durante o treinamento:

1. INICIALIZACAO: Comecam com valores aleatorios

2. TREINAMENTO: O modelo ve milhoes de frases e ajusta
   os vetores para que palavras similares fiquem proximas:

   "cafe" e "cha"   -> vetores SIMILARES (bebidas)
   "cafe" e "voce"  -> vetores DIFERENTES

3. RESULTADO: Palavras com significados parecidos
   acabam com vetores parecidos!

Exemplo de similaridade aprendida:
""")

def similaridade(v1, v2):
    """Cosseno entre dois vetores (0=diferente, 1=igual)"""
    return np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))

# Comparar palavras
pares = [("cafe", "cha"), ("cafe", "agua"), ("Eu", "voce"), ("Eu", "cafe")]
for p1, p2 in pares:
    v1 = embedding_matrix[vocabulario.index(p1)]
    v2 = embedding_matrix[vocabulario.index(p2)]
    sim = similaridade(v1, v2)
    print(f"  '{p1}' vs '{p2}': {sim:.1%} similar")

print("""
No nosso exemplo simples, os valores foram inventados.
Em modelos reais (GPT, BERT), os embeddings sao treinados
com bilhoes de palavras e capturam relacoes semanticas!
""")

print("=" * 60)
print("RESUMO")
print("=" * 60)
print("""
1. VOCABULARIO: Lista de palavras conhecidas com indices

2. MATRIZ DE EMBEDDING: Tabela (aprendida) que mapeia
   cada indice para um vetor de numeros

3. LOOKUP: Para converter palavra em numeros,
   basta pegar a linha correspondente da matriz

4. RESULTADO: "Eu" -> indice 0 -> [1.0, 0.5, 0.2, 0.1]
""")
