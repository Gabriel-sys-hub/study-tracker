"""
Exemplo de uso da API do Claude com diferentes valores de top_p
===============================================================

Para rodar este script, voce precisa:
1. Instalar: pip install anthropic
2. Configurar: export ANTHROPIC_API_KEY="sua-chave-aqui"
"""

import os

# Verificar se a biblioteca esta instalada
try:
    import anthropic
except ImportError:
    print("=" * 60)
    print("INSTALACAO NECESSARIA")
    print("=" * 60)
    print("\nExecute: pip install anthropic")
    print("\nDepois configure sua API key:")
    print("  Windows: set ANTHROPIC_API_KEY=sua-chave-aqui")
    print("  Linux/Mac: export ANTHROPIC_API_KEY=sua-chave-aqui")
    print("\nOu crie um arquivo .env com:")
    print("  ANTHROPIC_API_KEY=sua-chave-aqui")
    exit(1)

# ============================================================
# CONFIGURACAO
# ============================================================

# Verificar API key
api_key = os.environ.get("ANTHROPIC_API_KEY")
if not api_key:
    print("=" * 60)
    print("API KEY NAO ENCONTRADA")
    print("=" * 60)
    print("\nConfigure sua API key:")
    print("  Windows: set ANTHROPIC_API_KEY=sua-chave-aqui")
    print("  Linux/Mac: export ANTHROPIC_API_KEY=sua-chave-aqui")
    print("\nVoce pode obter uma chave em: https://console.anthropic.com/")

    # Modo demonstracao sem API
    print("\n" + "=" * 60)
    print("MODO DEMONSTRACAO (sem chamadas reais)")
    print("=" * 60)
    DEMO_MODE = True
else:
    DEMO_MODE = False
    client = anthropic.Anthropic()

# ============================================================
# FUNCAO PARA CHAMAR A API
# ============================================================

def gerar_resposta(prompt, temperature=1.0, top_p=1.0, max_tokens=150):
    """
    Chama a API do Claude com parametros especificos.

    Args:
        prompt: O texto de entrada
        temperature: Controla aleatoriedade (0.0 = determinístico, 1.0 = criativo)
        top_p: Nucleus sampling (0.1 = conservador, 0.9 = diverso)
        max_tokens: Maximo de tokens na resposta

    Returns:
        Texto gerado pelo modelo
    """
    if DEMO_MODE:
        # Respostas simuladas para demonstracao
        return simular_resposta(prompt, top_p)

    try:
        message = client.messages.create(
            model="claude-sonnet-4-20250514",  # Modelo mais recente
            max_tokens=max_tokens,
            temperature=temperature,
            top_p=top_p,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        return message.content[0].text
    except Exception as e:
        return f"Erro: {e}"

def simular_resposta(prompt, top_p):
    """Simula respostas para modo demonstracao."""
    if "historia" in prompt.lower() or "conto" in prompt.lower():
        if top_p <= 0.3:
            return "Era uma vez um gato que morava em uma casa. Ele gostava de dormir no sofa e brincar com bolinhas de la. Um dia, ele viu um passarinho pela janela e ficou observando por horas."
        elif top_p <= 0.6:
            return "Era uma vez um gato aventureiro chamado Felix. Ele morava em uma casa antiga perto da floresta. Certo dia, decidiu explorar alem do jardim e descobriu uma caverna misteriosa cheia de cristais brilhantes."
        else:
            return "Era uma vez um gato quantico chamado Schrodinger Jr. que existia simultaneamente em todas as dimensoes. Ele surfava ondas de probabilidade e jogava xadrez com buracos negros nas tardes de domingo cosmico."

    elif "codigo" in prompt.lower() or "funcao" in prompt.lower():
        return """def calcular_media(numeros):
    if not numeros:
        return 0
    return sum(numeros) / len(numeros)"""

    else:
        if top_p <= 0.3:
            return "Resposta direta e objetiva ao seu pedido."
        else:
            return "Resposta criativa e elaborada com perspectivas interessantes!"

# ============================================================
# DEMONSTRACAO: COMPARANDO TOP_P
# ============================================================

print("=" * 70)
print("COMPARANDO TOP_P NA API DO CLAUDE")
print("=" * 70)

if DEMO_MODE:
    print("\n[MODO DEMONSTRACAO - Respostas simuladas]")
    print("[Configure ANTHROPIC_API_KEY para usar a API real]\n")

# Prompt criativo
prompt_criativo = """Escreva o inicio de um conto infantil criativo e surpreendente
sobre um gato. Seja original! (2-3 frases)"""

print("\n" + "-" * 70)
print("TESTE 1: GERACAO CRIATIVA")
print("-" * 70)
print(f"Prompt: {prompt_criativo[:50]}...")

# Diferentes valores de top_p
configs = [
    {"top_p": 0.1, "temperature": 0.3, "desc": "CONSERVADOR"},
    {"top_p": 0.5, "temperature": 0.6, "desc": "EQUILIBRADO"},
    {"top_p": 0.9, "temperature": 0.9, "desc": "CRIATIVO"},
]

for config in configs:
    print(f"\n>>> top_p={config['top_p']}, temperature={config['temperature']} ({config['desc']})")
    print("-" * 50)

    resposta = gerar_resposta(
        prompt_criativo,
        temperature=config["temperature"],
        top_p=config["top_p"]
    )
    print(resposta)

# ============================================================
# DEMONSTRACAO: CODIGO vs CRIATIVO
# ============================================================

print("\n" + "=" * 70)
print("TESTE 2: CODIGO (top_p baixo) vs HISTORIA (top_p alto)")
print("=" * 70)

# Para codigo - conservador
prompt_codigo = "Escreva uma funcao Python que calcula a media de uma lista."

print(f"\n>>> CODIGO (top_p=0.1, temperature=0.2)")
print("-" * 50)
resposta_codigo = gerar_resposta(prompt_codigo, temperature=0.2, top_p=0.1)
print(resposta_codigo)

# Para historia - criativo
prompt_historia = "Escreva uma frase surpreendente sobre um gato espacial."

print(f"\n>>> HISTORIA (top_p=0.95, temperature=1.0)")
print("-" * 50)
resposta_historia = gerar_resposta(prompt_historia, temperature=1.0, top_p=0.95)
print(resposta_historia)

# ============================================================
# CODIGO DE EXEMPLO PARA COPIAR
# ============================================================

print("\n" + "=" * 70)
print("CODIGO PARA VOCE USAR")
print("=" * 70)

codigo_exemplo = '''
# Instale: pip install anthropic
# Configure: export ANTHROPIC_API_KEY="sua-chave"

import anthropic

client = anthropic.Anthropic()

# PARA CODIGO (preciso, deterministico)
resposta_codigo = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    temperature=0.0,   # Sem aleatoriedade
    top_p=0.1,         # So palavras mais provaveis
    messages=[{"role": "user", "content": "Escreva uma funcao..."}]
)

# PARA CRIATIVIDADE (diverso, surpreendente)
resposta_criativa = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    temperature=1.0,   # Maxima aleatoriedade
    top_p=0.95,        # Considera muitas opcoes
    messages=[{"role": "user", "content": "Escreva uma historia..."}]
)

# PARA CHAT GERAL (equilibrado)
resposta_chat = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    temperature=0.7,
    top_p=0.8,
    messages=[{"role": "user", "content": "Explique..."}]
)
'''

print(codigo_exemplo)

# ============================================================
# TABELA DE REFERENCIA
# ============================================================

print("\n" + "=" * 70)
print("TABELA DE REFERENCIA RAPIDA")
print("=" * 70)

print("""
+-------------------+-------------+--------+---------------------------+
| Caso de Uso       | temperature | top_p  | Resultado                 |
+-------------------+-------------+--------+---------------------------+
| Codigo/SQL        | 0.0 - 0.2   | 0.1    | Preciso, correto          |
| Analise de dados  | 0.2 - 0.4   | 0.2    | Consistente               |
| Resumos           | 0.3 - 0.5   | 0.3    | Fiel ao original          |
| Chat geral        | 0.6 - 0.8   | 0.7    | Natural, variado          |
| Brainstorming     | 0.8 - 1.0   | 0.9    | Criativo, diverso         |
| Historias/Poesia  | 0.9 - 1.0   | 0.95   | Surpreendente, artistico  |
+-------------------+-------------+--------+---------------------------+

DICA: Comece com temperature=0.7 e top_p=0.9 (padrao equilibrado)
      e ajuste conforme necessario!
""")
