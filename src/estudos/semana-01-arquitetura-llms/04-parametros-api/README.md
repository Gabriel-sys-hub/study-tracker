# Parametros de Geracao (top_p e Temperature)

Os parametros **top_p** e **temperature** controlam a **diversidade e criatividade** das respostas do modelo.

## Conceito Visual

```
Prompt: "O gato pulou no ___"

Probabilidades do modelo:
  sofa     35% ####################################
  telhado  25% #########################
  muro     15% ###############
  carro    10% ##########
  jardim    5% #####
  rio       4% ####
  espaco    3% ###
  arco-iris 2% ##
  sonho     0.8% #
  vazio     0.2%

top_p = 0.1  -->  [sofa]  (so a mais provavel)
top_p = 0.9  -->  [sofa, telhado, muro, carro, jardim, rio, espaco]
```

## Top_p (Nucleus Sampling)

### Como Funciona

```
1. Ordenar palavras por probabilidade
2. Somar probabilidades ate atingir top_p
3. DESCARTAR o resto
4. Escolher entre as que sobraram

Exemplo com top_p = 0.7:

  sofa     35%  --> Acum: 35%  [INCLUSO]
  telhado  25%  --> Acum: 60%  [INCLUSO]
  muro     15%  --> Acum: 75%  [EXCLUIDO - passou 70%]
  ...

Resultado: Escolher entre [sofa, telhado]
```

### Valores Tipicos

```
top_p = 0.1  (Conservador)
  +---+
  |###| sofa
  +---+
  Apenas 1 opcao = REPETITIVO

top_p = 0.9  (Criativo)
  +---+---+---+---+---+---+---+
  |###|## |## |#  |#  |#  |   |
  +---+---+---+---+---+---+---+
  sofa telhado muro carro jardim rio espaco
  Muitas opcoes = DIVERSO
```

## Temperature

### Como Funciona

```
Temperature BAIXA (0.0-0.3):
  Probabilidades ficam mais "pontiagudas"

  |####
  |#
  |
  +-----> palavras
  (Sempre escolhe a mais provavel)

Temperature ALTA (0.8-1.0):
  Probabilidades ficam mais "achatadas"

  |## ## # # # # #
  |
  +-----> palavras
  (Todas as palavras tem chance)
```

### Valores Tipicos

| Valor | Comportamento |
|-------|---------------|
| 0.0 | Deterministico (sempre igual) |
| 0.3 | Quase deterministico |
| 0.7 | Equilibrado (padrao) |
| 1.0 | Criativo |
| 1.5+ | Caotico (pode gerar lixo) |

## Top_p vs Temperature

```
+-------------+----------------------------------+----------------------------------+
|             | TEMPERATURE                      | TOP_P                            |
+-------------+----------------------------------+----------------------------------+
| O que faz   | Modifica as PROBABILIDADES       | Limita o CONJUNTO de palavras    |
|             | diretamente                      |                                  |
+-------------+----------------------------------+----------------------------------+
| Efeito      | Achata ou aguça a distribuicao   | Corta palavras improvaveis       |
+-------------+----------------------------------+----------------------------------+
| Valor baixo | Sempre escolhe a mais provavel   | Considera poucas palavras        |
+-------------+----------------------------------+----------------------------------+
| Valor alto  | Todas palavras tem chance        | Considera muitas palavras        |
+-------------+----------------------------------+----------------------------------+
```

## Tabela de Referencia

| Caso de Uso | temperature | top_p | Resultado |
|-------------|-------------|-------|-----------|
| Codigo/SQL | 0.0 - 0.2 | 0.1 | Preciso, correto |
| Analise de dados | 0.2 - 0.4 | 0.2 | Consistente |
| Resumos | 0.3 - 0.5 | 0.3 | Fiel ao original |
| Chat geral | 0.6 - 0.8 | 0.7 | Natural, variado |
| Brainstorming | 0.8 - 1.0 | 0.9 | Criativo, diverso |
| Historias/Poesia | 0.9 - 1.0 | 0.95 | Surpreendente |

## Exemplo Pratico

```
Prompt: "Escreva o inicio de uma historia sobre um gato"

top_p = 0.1, temperature = 0.2 (CONSERVADOR):
  "Era uma vez um gato que morava em uma casa."
  "Era uma vez um gato que morava em uma casa."
  "Era uma vez um gato que morava em uma casa."
  (Sempre igual!)

top_p = 0.9, temperature = 0.9 (CRIATIVO):
  "Era uma vez um gato que surfava nas nuvens de algodao."
  "Era uma vez um gato astronauta que descobriu um planeta de lasanha."
  "Era uma vez um gato filosofo que questionava a existencia dos ratos."
  (Cada vez diferente!)
```

## Uso na API do Claude

```python
import anthropic

client = anthropic.Anthropic()

# PARA CODIGO (preciso)
resposta = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    temperature=0.0,   # Sem aleatoriedade
    top_p=0.1,         # So palavras mais provaveis
    messages=[{"role": "user", "content": "Escreva uma funcao..."}]
)

# PARA CRIATIVIDADE
resposta = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    temperature=1.0,   # Maxima aleatoriedade
    top_p=0.95,        # Considera muitas opcoes
    messages=[{"role": "user", "content": "Escreva uma historia..."}]
)
```

## Analogia: Restaurante

```
top_p = 0.1 (Conservador):
  "Quero o prato mais pedido"
  --> Sempre recebe o mesmo prato popular

top_p = 0.9 (Criativo):
  "Me surpreenda com algo diferente!"
  --> Pode receber pratos inusitados
```

## Scripts Disponiveis

| Arquivo | Descricao |
|---------|-----------|
| `top_p_explicado.py` | Explicacao detalhada do nucleus sampling |
| `claude_api_top_p.py` | Exemplo pratico usando a API do Claude |

## Como Executar

```bash
# Entender o conceito
python top_p_explicado.py

# Testar com a API (requer ANTHROPIC_API_KEY)
export ANTHROPIC_API_KEY="sua-chave"
python claude_api_top_p.py
```

## Dicas Praticas

1. **Comece com valores padrao**: temperature=0.7, top_p=0.9
2. **Para codigo**: Abaixe ambos (temp=0.2, top_p=0.1)
3. **Para criatividade**: Suba ambos (temp=0.9, top_p=0.95)
4. **Ajuste um de cada vez**: Nao mude os dois simultaneamente
5. **Teste e itere**: O melhor valor depende do seu caso de uso

## Resultado Chave

```
temperature = Quao "ousado" o modelo e na escolha
top_p = Quantas opcoes o modelo considera

BAIXO + BAIXO = Seguro e previsivel (codigo)
ALTO + ALTO = Criativo e surpreendente (historias)
```

## Referencias

- [The Curious Case of Neural Text Degeneration](https://arxiv.org/abs/1904.09751) - Paper do Nucleus Sampling
- [Claude API Documentation](https://docs.anthropic.com/claude/reference/messages_post)
- [OpenAI API Best Practices](https://platform.openai.com/docs/guides/text-generation/how-should-i-set-the-temperature-parameter)
