# Context Window (Janela de Contexto)

A **Context Window** e o numero maximo de tokens que um modelo pode "ver" de uma vez. E a "memoria de curto prazo" do modelo.

## Conceito Visual

```
                    CONTEXT WINDOW
                    |<---------->|

Conversa: [msg1][msg2][msg3][msg4][msg5]
                      |_______________|
                      Modelo ve apenas isso!

msg1 e msg2 = FORA da janela = ESQUECIDO!
```

## Tamanhos de Context Window

| Modelo | Context Window | Equivalente |
|--------|----------------|-------------|
| GPT-3.5 | 4.096 tokens | ~3.000 palavras |
| GPT-4 | 8.192 tokens | ~6.000 palavras |
| GPT-4 Turbo | 128.000 tokens | ~96.000 palavras |
| Claude 3 | 200.000 tokens | ~150.000 palavras |
| Claude 3.5 | 200.000 tokens | ~150.000 palavras |

> **Regra**: 1 palavra ~= 1.3 tokens (em media)

## Janela Deslizante

```
TEMPO 1: Tudo visivel
+-------+-------+-------+
| msg1  | msg2  | msg3  |
+-------+-------+-------+
|_____ context window __|


TEMPO 2: msg1 saiu!
        +-------+-------+-------+
        | msg2  | msg3  | msg4  |
        +-------+-------+-------+
        |_____ context window __|
 FORA!
[msg1]


TEMPO 3: msg1 e msg2 sairam!
                +-------+-------+-------+
                | msg3  | msg4  | msg5  |
                +-------+-------+-------+
                |_____ context window __|
      FORA!
[msg1][msg2]
```

## Exemplo Pratico

```
Conversa:
1. Usuario: "Ola! Meu nome e Gabriel."
2. Claude: "Ola Gabriel! Como posso ajudar?"
3. Usuario: "Estou estudando ML."
4. Claude: "Otimo! O que quer saber?"
5. Usuario: "Quero entender Transformers."
6. Claude: "Transformers usam self-attention..."
7. Usuario: "Qual meu nome mesmo?"

COM CONTEXT WINDOW PEQUENA (3 mensagens):
  Visivel: [msg5, msg6, msg7]
  Resposta: "Desculpe, nao sei seu nome."
  (msg1 com o nome saiu da janela!)

COM CONTEXT WINDOW GRANDE (todas):
  Visivel: [msg1, msg2, msg3, msg4, msg5, msg6, msg7]
  Resposta: "Seu nome e Gabriel!"
  (msg1 ainda esta na janela)
```

## Impacto na Qualidade

| Context Window | Impacto |
|----------------|---------|
| **PEQUENA** | Esquece informacoes anteriores |
| (4K tokens) | Respostas inconsistentes |
| | Nao acompanha conversas longas |
| | Nao analisa documentos grandes |
| **GRANDE** | Lembra toda a conversa |
| (128K+ tokens) | Respostas consistentes |
| | Analisa livros inteiros |
| | Melhor para tarefas complexas |
| | Mais caro computacionalmente |

## Por que Existe Limite?

```
SELF-ATTENTION = Cada token compara com TODOS os outros

Tokens    Comparacoes      Memoria
------    -----------      -------
100       100 x 100        10K
1.000     1K x 1K          1M
10.000    10K x 10K        100M
100.000   100K x 100K      10 BILHOES!

Complexidade: O(n^2)

Quanto MAIOR a janela:
  - MAIS memoria necessaria
  - MAIS lento o processamento
  - MAIS caro o modelo
```

## Casos de Uso

| Tarefa | Tokens Necessarios | 4K | 128K |
|--------|-------------------|-----|------|
| Conversa casual (10 msgs) | ~500 | OK | OK |
| Resumir livro (300 pags) | ~150.000 | NAO | OK |
| Analisar codigo (50 arquivos) | ~80.000 | NAO | OK |
| Lembrar instrucao antiga | ~50.000 | NAO | OK |

## Tecnicas para Lidar com Limites

### 1. Resumo (Summarization)
```
Mensagens antigas --> Resumir --> Manter resumo na janela
```

### 2. RAG (Retrieval-Augmented Generation)
```
Documentos --> Banco de dados
                    |
                    v
Pergunta --> Buscar relevantes --> Adicionar ao contexto
```

### 3. Memoria Externa
```
Informacoes importantes --> Salvar em arquivo/banco
                                    |
                                    v
Quando necessario <---------- Carregar
```

### 4. Chunking
```
Documento grande --> [chunk1][chunk2][chunk3]
                          |      |      |
                          v      v      v
                     Processar separadamente
```

### 5. Atencao Esparsa
```
Padrao: Todos com todos = O(n^2)
Esparsa: Apenas vizinhos = O(n * sqrt(n))
```

## Analogia: Mesa de Trabalho

```
CONTEXT WINDOW = Tamanho da mesa

Mesa PEQUENA:
+-------+
| papel |  <- So cabe 1 papel
+-------+
Para ver outro, precisa tirar o atual!
(Perde informacao)

Mesa GRANDE:
+-------+-------+-------+-------+
| papel | papel | papel | papel |
+-------+-------+-------+-------+
Consegue ver tudo de uma vez!
(Mantem contexto completo)
```

## Script Disponivel

| Arquivo | Descricao |
|---------|-----------|
| `context_window_explicado.py` | Simulacao completa de context window |

## Como Executar

```bash
python context_window_explicado.py
```

O script simula:
- Conversa com diferentes tamanhos de janela
- Visualizacao da janela deslizante
- Impacto na qualidade das respostas
- Relacao com self-attention

## Resultado Chave

```
Context Window = Memoria de curto prazo do modelo

PEQUENA: "Desculpe, o que voce disse antes?"
GRANDE:  "Claro, voce mencionou X na mensagem 3!"

Quanto maior a janela, mais coerente e contextual
sao as respostas do modelo.
```

## Referencias

- [Attention Is All You Need](https://arxiv.org/abs/1706.03762) - Paper original
- [Longformer](https://arxiv.org/abs/2004.05150) - Atencao esparsa
- [Claude Context Window](https://docs.anthropic.com/) - Documentacao Anthropic
