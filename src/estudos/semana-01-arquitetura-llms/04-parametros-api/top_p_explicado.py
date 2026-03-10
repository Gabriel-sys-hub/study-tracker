"""
TOP_P (Nucleus Sampling): Como afeta a geracao de texto
========================================================

top_p controla a DIVERSIDADE/CRIATIVIDADE das respostas
"""

import numpy as np
np.random.seed(42)
np.set_printoptions(precision=3, suppress=True)

print("=" * 70)
print("TOP_P (NUCLEUS SAMPLING): COMPARACAO PARA GERACAO CRIATIVA")
print("=" * 70)

# ============================================================
# O QUE EH TOP_P?
# ============================================================
print("\n" + "=" * 70)
print("PASSO 1: O QUE EH TOP_P?")
print("=" * 70)

print("""
Quando o modelo gera texto, ele calcula PROBABILIDADES para cada
palavra possivel. top_p controla QUANTAS palavras ele considera.

top_p = 0.9 -> Considera palavras ate acumular 90% de probabilidade
top_p = 0.1 -> Considera palavras ate acumular 10% de probabilidade

RESUMO:
- top_p ALTO (0.9) = Mais opcoes = Mais CRIATIVO/DIVERSO
- top_p BAIXO (0.1) = Menos opcoes = Mais PREVISIVEL/SEGURO
""")

# ============================================================
# SIMULACAO: COMO O MODELO ESCOLHE PALAVRAS
# ============================================================
print("\n" + "=" * 70)
print("PASSO 2: COMO O MODELO ESCOLHE A PROXIMA PALAVRA")
print("=" * 70)

print("""
Contexto: "O gato pulou no ___"

O modelo calcula probabilidades para TODAS as palavras do vocabulario:
""")

# Simulando probabilidades de saida do modelo
vocabulario = ["sofa", "telhado", "muro", "carro", "jardim",
               "rio", "espaco", "arco-iris", "sonho", "vazio"]

# Probabilidades (simuladas) - modelo acha "sofa" mais provavel
probabilidades = np.array([0.35, 0.25, 0.15, 0.10, 0.05,
                           0.04, 0.03, 0.02, 0.008, 0.002])

# Ordenar por probabilidade (maior para menor)
indices_ordenados = np.argsort(probabilidades)[::-1]
vocab_ordenado = [vocabulario[i] for i in indices_ordenados]
probs_ordenadas = probabilidades[indices_ordenados]

print("Palavras ordenadas por probabilidade:")
print("-" * 50)
prob_acumulada = 0
for i, (palavra, prob) in enumerate(zip(vocab_ordenado, probs_ordenadas)):
    prob_acumulada += prob
    barra = "#" * int(prob * 100)
    print(f"  {i+1}. '{palavra:12}' {prob:>6.1%} | Acumulado: {prob_acumulada:>6.1%} {barra}")

# ============================================================
# TOP_P = 0.1 (CONSERVADOR)
# ============================================================
print("\n" + "=" * 70)
print("PASSO 3: TOP_P = 0.1 (CONSERVADOR/PREVISIVEL)")
print("=" * 70)

print("""
Com top_p = 0.1, pegamos palavras ate acumular 10% de probabilidade.
""")

top_p = 0.1
palavras_selecionadas_01 = []
probs_selecionadas_01 = []
acumulado = 0

print(f"Selecionando palavras ate acumular {top_p:.0%}:")
print("-" * 50)

for palavra, prob in zip(vocab_ordenado, probs_ordenadas):
    if acumulado < top_p:
        palavras_selecionadas_01.append(palavra)
        probs_selecionadas_01.append(prob)
        acumulado += prob
        print(f"  + '{palavra}' ({prob:.1%}) -> Acumulado: {acumulado:.1%} [INCLUSO]")
    else:
        print(f"  - '{palavra}' ({prob:.1%}) -> [EXCLUIDO - ja passou {top_p:.0%}]")
        break

# Mostrar mais algumas excluidas
for palavra, prob in list(zip(vocab_ordenado, probs_ordenadas))[len(palavras_selecionadas_01)+1:4]:
    print(f"  - '{palavra}' ({prob:.1%}) -> [EXCLUIDO]")
print("  ...")

print(f"\nPalavras disponiveis com top_p=0.1: {palavras_selecionadas_01}")
print(f"Total de opcoes: {len(palavras_selecionadas_01)}")

# Renormalizar probabilidades
probs_norm_01 = np.array(probs_selecionadas_01) / sum(probs_selecionadas_01)
print(f"\nProbabilidades renormalizadas (somam 100%):")
for p, prob in zip(palavras_selecionadas_01, probs_norm_01):
    print(f"  '{p}': {prob:.1%}")

# ============================================================
# TOP_P = 0.9 (CRIATIVO)
# ============================================================
print("\n" + "=" * 70)
print("PASSO 4: TOP_P = 0.9 (CRIATIVO/DIVERSO)")
print("=" * 70)

print("""
Com top_p = 0.9, pegamos palavras ate acumular 90% de probabilidade.
""")

top_p = 0.9
palavras_selecionadas_09 = []
probs_selecionadas_09 = []
acumulado = 0

print(f"Selecionando palavras ate acumular {top_p:.0%}:")
print("-" * 50)

for palavra, prob in zip(vocab_ordenado, probs_ordenadas):
    if acumulado < top_p:
        palavras_selecionadas_09.append(palavra)
        probs_selecionadas_09.append(prob)
        acumulado += prob
        status = "INCLUSO"
    else:
        status = "EXCLUIDO"
    print(f"  {'+ ' if status == 'INCLUSO' else '- '}'{palavra}' ({prob:.1%}) -> Acumulado: {acumulado:.1%} [{status}]")

print(f"\nPalavras disponiveis com top_p=0.9: {palavras_selecionadas_09}")
print(f"Total de opcoes: {len(palavras_selecionadas_09)}")

# ============================================================
# COMPARACAO VISUAL
# ============================================================
print("\n" + "=" * 70)
print("PASSO 5: COMPARACAO VISUAL")
print("=" * 70)

print("""
                    TOP_P = 0.1              TOP_P = 0.9
                    (Conservador)            (Criativo)
                    -------------            ----------
Palavras
disponiveis:        {0:<24} {1}

Comportamento:      Sempre escolhe           Pode escolher palavras
                    palavras "seguras"       menos obvias/criativas

Exemplo de
geracao:            "O gato pulou no         "O gato pulou no
                     SOFA"                    ARCO-IRIS"
                    (previsivel)             (surpreendente!)
""".format(str(palavras_selecionadas_01), str(palavras_selecionadas_09[:5])))

# ============================================================
# SIMULACAO DE GERACAO
# ============================================================
print("\n" + "=" * 70)
print("PASSO 6: SIMULANDO GERACAO DE TEXTO")
print("=" * 70)

def gerar_com_top_p(vocab, probs, top_p, n_geracoes=5):
    """Simula geracao de texto com top_p."""
    # Ordenar
    indices = np.argsort(probs)[::-1]
    vocab_ord = [vocab[i] for i in indices]
    probs_ord = probs[indices]

    # Selecionar palavras ate atingir top_p
    selecionadas = []
    probs_sel = []
    acum = 0
    for v, p in zip(vocab_ord, probs_ord):
        if acum < top_p:
            selecionadas.append(v)
            probs_sel.append(p)
            acum += p

    # Renormalizar
    probs_sel = np.array(probs_sel) / sum(probs_sel)

    # Gerar amostras
    geracoes = np.random.choice(selecionadas, size=n_geracoes, p=probs_sel)
    return list(geracoes), selecionadas

print("Gerando 10 continuacoes para: 'O gato pulou no ___'\n")

np.random.seed(123)
geracoes_01, pool_01 = gerar_com_top_p(vocabulario, probabilidades, 0.1, 10)
np.random.seed(123)
geracoes_09, pool_09 = gerar_com_top_p(vocabulario, probabilidades, 0.9, 10)

print("TOP_P = 0.1 (Conservador):")
print(f"  Pool de palavras: {pool_01}")
print(f"  Geracoes: {geracoes_01}")
print(f"  Palavras unicas: {len(set(geracoes_01))}")

print("\nTOP_P = 0.9 (Criativo):")
print(f"  Pool de palavras: {pool_09}")
print(f"  Geracoes: {geracoes_09}")
print(f"  Palavras unicas: {len(set(geracoes_09))}")

# ============================================================
# EXEMPLO COM FRASE COMPLETA
# ============================================================
print("\n" + "=" * 70)
print("PASSO 7: EXEMPLO DE HISTORIA CRIATIVA")
print("=" * 70)

# Simulando geracao de uma historia
historias_conservador = [
    "Era uma vez um gato que morava em uma casa.",
    "Era uma vez um gato que morava em uma casa.",
    "Era uma vez um gato que morava em uma casa grande.",
    "Era uma vez um gato que morava em uma casa pequena.",
    "Era uma vez um gato que morava em uma casa.",
]

historias_criativo = [
    "Era uma vez um gato que surfava nas nuvens de algodao.",
    "Era uma vez um gato astronauta que descobriu um planeta de lasanha.",
    "Era uma vez um gato filosofo que questionava a existencia dos ratos.",
    "Era uma vez um gato DJ que tocava musica eletronica para passarinhos.",
    "Era uma vez um gato samurai que protegia o reino dos peixinhos dourados.",
]

print("Prompt: 'Escreva o inicio de uma historia infantil criativa'\n")

print("TOP_P = 0.1 (Conservador) - 5 geracoes:")
print("-" * 50)
for i, h in enumerate(historias_conservador, 1):
    print(f"  {i}. {h}")

print("\nTOP_P = 0.9 (Criativo) - 5 geracoes:")
print("-" * 50)
for i, h in enumerate(historias_criativo, 1):
    print(f"  {i}. {h}")

print("""
OBSERVACAO:
- Com top_p=0.1, as historias sao quase IDENTICAS (repetitivas)
- Com top_p=0.9, cada historia eh UNICA e SURPREENDENTE
""")

# ============================================================
# QUANDO USAR CADA UM
# ============================================================
print("\n" + "=" * 70)
print("PASSO 8: QUANDO USAR CADA VALOR")
print("=" * 70)

print("""
+------------------+-------------------+-------------------+
| Tarefa           | top_p Recomendado | Por que?          |
+------------------+-------------------+-------------------+
| Codigo/SQL       | 0.1 - 0.3         | Precisa ser       |
|                  |                   | CORRETO, nao      |
|                  |                   | criativo          |
+------------------+-------------------+-------------------+
| Resumos          | 0.3 - 0.5         | Fiel ao original, |
|                  |                   | pouca criatividade|
+------------------+-------------------+-------------------+
| Chatbot geral    | 0.5 - 0.7         | Equilibrio entre  |
|                  |                   | coerencia e       |
|                  |                   | variedade         |
+------------------+-------------------+-------------------+
| Historias        | 0.8 - 0.95        | Maximo de         |
| criativas        |                   | criatividade e    |
|                  |                   | surpresa          |
+------------------+-------------------+-------------------+
| Brainstorming    | 0.9 - 1.0         | Ideias malucas    |
|                  |                   | sao bem-vindas!   |
+------------------+-------------------+-------------------+
""")

# ============================================================
# TOP_P vs TEMPERATURE
# ============================================================
print("\n" + "=" * 70)
print("PASSO 9: TOP_P vs TEMPERATURE")
print("=" * 70)

print("""
Ambos controlam diversidade, mas de formas diferentes:

TEMPERATURE:
- Modifica as PROBABILIDADES diretamente
- temp=0: sempre escolhe a mais provavel
- temp=2: probabilidades ficam mais "achatadas"

TOP_P:
- Limita o CONJUNTO de palavras consideradas
- top_p=0.1: so considera as mais provaveis
- top_p=1.0: considera todas

COMBINACAO COMUM:
- Para codigo: temperature=0.2, top_p=0.1
- Para criativo: temperature=0.8, top_p=0.9

VISUALIZACAO:
                    Probabilidade
                    |
            temp=0  |####
                    |#
                    |
                    +------------------> Palavras

                    |
            temp=2  |## ## # # # # # # #
                    |
                    +------------------> Palavras
                    (mais "achatado", mais opcoes viaveis)
""")

# ============================================================
# DEMONSTRACAO MATEMATICA
# ============================================================
print("\n" + "=" * 70)
print("PASSO 10: A MATEMATICA POR TRAS")
print("=" * 70)

print("""
ALGORITMO DO TOP_P (Nucleus Sampling):

1. Modelo gera probabilidades para cada palavra
2. Ordenar palavras por probabilidade (maior -> menor)
3. Somar probabilidades ate atingir top_p
4. DESCARTAR palavras restantes
5. Renormalizar probabilidades restantes
6. Amostrar da distribuicao filtrada
""")

print("Exemplo numerico:")
print("-" * 50)

probs_exemplo = [0.4, 0.3, 0.15, 0.1, 0.05]
palavras_exemplo = ["A", "B", "C", "D", "E"]

print(f"Probabilidades originais: {probs_exemplo}")
print(f"Palavras: {palavras_exemplo}")

for top_p_teste in [0.5, 0.7, 0.9]:
    acum = 0
    selecionadas = []
    probs_sel = []

    for p, prob in zip(palavras_exemplo, probs_exemplo):
        if acum < top_p_teste:
            selecionadas.append(p)
            probs_sel.append(prob)
            acum += prob

    probs_renorm = [p/sum(probs_sel) for p in probs_sel]

    print(f"\ntop_p = {top_p_teste}:")
    print(f"  Selecionadas: {selecionadas}")
    print(f"  Probs originais: {probs_sel}")
    print(f"  Probs renormalizadas: {[f'{p:.2f}' for p in probs_renorm]}")

# ============================================================
# RESUMO FINAL
# ============================================================
print("\n" + "=" * 70)
print("RESUMO FINAL")
print("=" * 70)

print("""
TOP_P (Nucleus Sampling):

  top_p = 0.1                    top_p = 0.9
  -----------                    -----------
  Poucas opcoes                  Muitas opcoes
  Repetitivo                     Diverso
  Previsivel                     Surpreendente
  Seguro                         Criativo
  Ideal para: codigo             Ideal para: historias

FORMULA MENTAL:
  top_p BAIXO = "Jogue pelo seguro"
  top_p ALTO  = "Seja criativo!"

ANALOGIA:
  top_p = 0.1 -> Restaurante: "Quero o prato mais pedido"
  top_p = 0.9 -> Restaurante: "Me surpreenda com algo diferente!"
""")
