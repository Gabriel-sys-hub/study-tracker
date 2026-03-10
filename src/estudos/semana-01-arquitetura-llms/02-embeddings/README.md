# Word Embeddings

**Embeddings** sao representacoes numericas de palavras. Transformam texto em vetores que o modelo consegue processar.

## Conceito Visual

```
PALAVRA          VETOR (Embedding)
--------         -----------------
"Eu"      --->   [1.0, 0.5, 0.2, 0.1]
"amo"     --->   [0.3, 0.8, 0.9, 0.2]
"cafe"    --->   [0.2, 0.1, 0.7, 0.9]
"cha"     --->   [0.1, 0.2, 0.6, 0.8]  <- Similar a cafe!
```

## Por que Embeddings?

```
PROBLEMA: Computadores nao entendem palavras

  "gato" --> ???

SOLUCAO: Converter palavras em numeros (vetores)

  "gato" --> [0.2, 0.8, 0.1, 0.5]

BONUS: Palavras similares = vetores similares!

  "gato" --> [0.2, 0.8, 0.1, 0.5]
  "felino" --> [0.3, 0.7, 0.2, 0.4]  <- Proximo!
```

## Fluxo: Palavra para Vetor

```
   VOCABULARIO           MATRIZ DE EMBEDDING          VETOR
   -----------           -------------------          -----

   "Eu"   (idx 0)
   "amo"  (idx 1)   -->  [[ 1.0, 0.5, 0.2, 0.1 ],  --> lookup
   "cafe" (idx 2)         [ 0.3, 0.8, 0.9, 0.2 ],
   "voce" (idx 3)         [ 0.2, 0.1, 0.7, 0.9 ],      |
   "cha"  (idx 4)         [ 0.9, 0.4, 0.3, 0.1 ],      v
   "agua" (idx 5)         [ 0.1, 0.2, 0.6, 0.8 ],
                          [ 0.2, 0.3, 0.5, 0.7 ]]   embedding_matrix[idx]

   "cafe" (idx 2) ---------> linha 2 -------------> [0.2, 0.1, 0.7, 0.9]
```

## One-Hot vs Embedding

### One-Hot (Problematico)
```
Vocabulario: 50.000 palavras

"gato" --> [0, 0, 0, ..., 1, ..., 0, 0]
            |<---- 50.000 posicoes ---->|

Problemas:
- Vetores ENORMES (50.000 dimensoes!)
- Quase todos zeros (esparso)
- Nao captura similaridade
```

### Embedding (Solucao)
```
Vocabulario: 50.000 palavras
Embedding: 256 dimensoes

"gato" --> [0.2, 0.8, 0.1, ..., 0.5]
            |<-- 256 numeros -->|

Vantagens:
- Vetores PEQUENOS (256 dimensoes)
- Densos (todos numeros uteis)
- Palavras similares = vetores proximos
```

## Como o Lookup Funciona

```
ENTRADA: "Eu"

1. Encontrar indice no vocabulario:
   "Eu" --> indice 0

2. Buscar linha na matriz:
   embedding_matrix[0] = [1.0, 0.5, 0.2, 0.1]

RESULTADO: [1.0, 0.5, 0.2, 0.1]
```

### Matematicamente (One-Hot @ Matriz)
```
one_hot = [1, 0, 0, 0, 0, 0]

                  dim0  dim1  dim2  dim3
                  ----  ----  ----  ----
embedding_matrix = [[1.0, 0.5, 0.2, 0.1],  <- "Eu"   (x1)
                   [0.3, 0.8, 0.9, 0.2],   <- "amo"  (x0)
                   [0.2, 0.1, 0.7, 0.9],   <- "cafe" (x0)
                   ...]

one_hot @ embedding_matrix = [1.0, 0.5, 0.2, 0.1]
```

## Similaridade entre Palavras

```
Similaridade por Cosseno: cos(A, B) = (A . B) / (|A| * |B|)

"cafe" vs "cha"  : 97% similar  (ambas bebidas)
"cafe" vs "agua" : 92% similar  (ambas bebidas)
"Eu" vs "voce"   : 87% similar  (ambos pronomes)
"Eu" vs "cafe"   : 52% similar  (diferentes)
```

## Como Embeddings sao Aprendidos

```
1. INICIALIZACAO
   Valores aleatorios na matriz

2. TREINAMENTO (milhoes de frases)
   "O gato dormiu" --> ajusta vetores
   "O felino descansou" --> ajusta vetores
   ...

3. RESULTADO
   "gato" e "felino" ficam PROXIMOS
   porque aparecem em contextos similares!
```

## Scripts Disponiveis

| Arquivo | Descricao |
|---------|-----------|
| `word_embedding_explicado.py` | Conceitos basicos de embedding |
| `embedding_calculo.py` | Como o vetor e calculado (matematica) |
| `embedding_aprendizado.py` | Como embeddings sao aprendidos |

## Como Executar

```bash
# Conceitos basicos (comecar aqui)
python word_embedding_explicado.py

# Matematica do calculo
python embedding_calculo.py

# Processo de aprendizado
python embedding_aprendizado.py
```

## Dimensoes Tipicas

| Modelo | Dimensao do Embedding |
|--------|----------------------|
| Word2Vec | 100-300 |
| GloVe | 50-300 |
| BERT | 768 |
| GPT-3 | 12.288 |
| GPT-4 | ~12.000+ |

## Resultado Chave

```
ANTES: Palavras sao simbolos sem significado numerico
       "gato" != "felino" (strings diferentes)

DEPOIS: Palavras sao vetores com significado
        "gato" ~= "felino" (vetores proximos!)
```

## Referencias

- [Word2Vec Paper](https://arxiv.org/abs/1301.3781) - Mikolov et al.
- [GloVe Paper](https://nlp.stanford.edu/pubs/glove.pdf) - Stanford
- [The Illustrated Word2Vec](https://jalammar.github.io/illustrated-word2vec/) - Jay Alammar
