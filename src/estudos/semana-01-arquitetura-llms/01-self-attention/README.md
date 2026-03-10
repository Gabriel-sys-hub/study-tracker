# Self-Attention (Mecanismo de Atencao)

O **Self-Attention** e o coracao dos modelos Transformer. Ele permite que cada token em uma sequencia "preste atencao" a todos os outros tokens, capturando relacoes contextuais.

## Conceito Visual

```
Frase: "Eu amo cafe"

    Eu -----> amo -----> cafe
     |         |          |
     v         v          v
  [Query]   [Query]    [Query]    "O que eu procuro?"
  [Key]     [Key]      [Key]      "O que eu ofereco?"
  [Value]   [Value]    [Value]    "Minha informacao"

Processo:
1. Cada token faz uma PERGUNTA (Query)
2. Cada token tem uma ETIQUETA (Key)
3. Comparamos Query com todas as Keys
4. Pegamos o Value dos tokens relevantes
```

## Analogia: Biblioteca

| Conceito | Analogia |
|----------|----------|
| **Query** | Sua pergunta: "O que este token procura?" |
| **Key** | Titulo do livro: "O que este token oferece?" |
| **Value** | Conteudo do livro: "A informacao que carrega" |

## Fluxo do Self-Attention

```
                    ENTRADA
                       |
                       v
    +------------------+------------------+
    |                  |                  |
    v                  v                  v
  [W_q]              [W_k]              [W_v]
    |                  |                  |
    v                  v                  v
    Q                  K                  V
    |                  |                  |
    +--------+---------+                  |
             |                            |
             v                            |
        Q @ K.T                           |
             |                            |
             v                            |
      / sqrt(d_k)                         |
             |                            |
             v                            |
        SOFTMAX                           |
             |                            |
             v                            |
    Attention Weights                     |
             |                            |
             +-------------+--------------+
                           |
                           v
                    Weights @ V
                           |
                           v
                       OUTPUT
```

## Formula Matematica

```
Attention(Q, K, V) = softmax(Q @ K.T / sqrt(d_k)) @ V
```

Onde:
- `Q` = Query = X @ W_q
- `K` = Key = X @ W_k
- `V` = Value = X @ W_v
- `d_k` = dimensao de K (para estabilidade numerica)

## Exemplo Numerico

### Entrada (Embeddings)
```
X = [
    [1.0, 0.5, 0.2, 0.1],   # "Eu"
    [0.3, 0.8, 0.9, 0.2],   # "amo"
    [0.2, 0.1, 0.7, 0.9],   # "cafe"
]
```

### Pesos de Atencao (Resultado do Softmax)
```
              Eu      amo     cafe
         +-------+-------+-------+
    Eu   |  40%  |  30%  |  30%  |  = 100%
    amo  |  35%  |  35%  |  30%  |  = 100%
    cafe |  25%  |  35%  |  40%  |  = 100%
         +-------+-------+-------+
```

### Interpretacao
- "Eu" presta 40% de atencao em si mesmo
- "amo" distribui atencao entre "Eu" (quem ama?) e "cafe" (ama o que?)
- "cafe" presta mais atencao em si e no verbo "amo"

## Por que dividir por sqrt(d_k)?

```
Sem escalar:
  Scores muito grandes -> Softmax extremo (0 ou 1)

Com escalar (/ sqrt(d_k)):
  Scores moderados -> Softmax suave (distribuicao melhor)
```

## Scripts Disponiveis

| Arquivo | Descricao |
|---------|-----------|
| `self_attention.py` | Implementacao limpa e reutilizavel |
| `self_attention_explicado.py` | Versao didatica passo a passo |
| `self_attention_visual.py` | Gera visualizacao grafica |
| `self_attention_visualization.png` | Imagem da visualizacao |

## Como Executar

```bash
# Versao explicada (recomendado comecar por aqui)
python self_attention_explicado.py

# Implementacao limpa
python self_attention.py

# Gerar visualizacao (requer matplotlib)
python self_attention_visual.py
```

## Resultado Chave

**Antes**: Cada token e isolado, nao "conhece" os outros.

**Depois**: Cada token contem informacao contextual dos tokens relevantes!

```
"amo" agora "sabe" sobre:
  - "Eu" (quem ama)
  - "cafe" (o que e amado)
```

## Referencias

- [Attention Is All You Need](https://arxiv.org/abs/1706.03762) - Paper original
- [The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/) - Jay Alammar
- [3Blue1Brown - Attention in Transformers](https://www.youtube.com/watch?v=eMlx5fFNoYc)
