"""
Self-Attention com Visualização Interativa.
"""

import numpy as np
import matplotlib.pyplot as plt


def softmax(x: np.ndarray) -> np.ndarray:
    exp_x = np.exp(x - np.max(x, axis=-1, keepdims=True))
    return exp_x / np.sum(exp_x, axis=-1, keepdims=True)


def self_attention_visual(X, W_q, W_k, W_v, tokens):
    """Self-attention com visualização passo a passo."""

    # Calcular Q, K, V
    Q = X @ W_q
    K = X @ W_k
    V = X @ W_v

    # Scores e scaling
    d_k = K.shape[-1]
    scores = Q @ K.T
    scaled_scores = scores / np.sqrt(d_k)

    # Attention weights
    attention_weights = softmax(scaled_scores)

    # Output
    output = attention_weights @ V

    # Criar visualização
    fig, axes = plt.subplots(2, 3, figsize=(14, 9))
    fig.suptitle('Self-Attention Passo a Passo', fontsize=14, fontweight='bold')

    # 1. Entrada X
    ax1 = axes[0, 0]
    im1 = ax1.imshow(X, cmap='coolwarm', aspect='auto')
    ax1.set_title('1. Entrada X\n(tokens × dimensões)')
    ax1.set_yticks(range(len(tokens)))
    ax1.set_yticklabels(tokens)
    ax1.set_xlabel('Dimensão')
    plt.colorbar(im1, ax=ax1, shrink=0.8)

    # 2. Query, Key, Value
    ax2 = axes[0, 1]
    qkv_combined = np.hstack([Q, K, V])
    im2 = ax2.imshow(qkv_combined, cmap='coolwarm', aspect='auto')
    ax2.set_title('2. Q, K, V\n(projeções da entrada)')
    ax2.set_yticks(range(len(tokens)))
    ax2.set_yticklabels(tokens)
    ax2.axvline(Q.shape[1] - 0.5, color='black', linewidth=2)
    ax2.axvline(Q.shape[1] + K.shape[1] - 0.5, color='black', linewidth=2)
    ax2.set_xlabel('Q | K | V')
    plt.colorbar(im2, ax=ax2, shrink=0.8)

    # 3. Scores (Q @ K^T)
    ax3 = axes[0, 2]
    im3 = ax3.imshow(scaled_scores, cmap='YlOrRd', aspect='auto')
    ax3.set_title('3. Scores (Q·K^T / √d)\n(similaridade entre tokens)')
    ax3.set_xticks(range(len(tokens)))
    ax3.set_xticklabels(tokens, rotation=45)
    ax3.set_yticks(range(len(tokens)))
    ax3.set_yticklabels(tokens)
    for i in range(len(tokens)):
        for j in range(len(tokens)):
            ax3.text(j, i, f'{scaled_scores[i,j]:.2f}', ha='center', va='center', fontsize=9)
    plt.colorbar(im3, ax=ax3, shrink=0.8)

    # 4. Attention Weights (após softmax)
    ax4 = axes[1, 0]
    im4 = ax4.imshow(attention_weights, cmap='Blues', aspect='auto', vmin=0, vmax=1)
    ax4.set_title('4. Pesos de Atenção\n(softmax dos scores)')
    ax4.set_xticks(range(len(tokens)))
    ax4.set_xticklabels(tokens, rotation=45)
    ax4.set_yticks(range(len(tokens)))
    ax4.set_yticklabels(tokens)
    for i in range(len(tokens)):
        for j in range(len(tokens)):
            ax4.text(j, i, f'{attention_weights[i,j]:.2f}', ha='center', va='center', fontsize=10, fontweight='bold')
    plt.colorbar(im4, ax=ax4, shrink=0.8, label='Atenção')

    # 5. Diagrama de fluxo de atenção
    ax5 = axes[1, 1]
    ax5.set_xlim(-1, 3)
    ax5.set_ylim(-0.5, len(tokens) - 0.5)
    ax5.set_title('5. Fluxo de Atenção\n(de onde cada token "olha")')
    ax5.axis('off')

    # Desenhar tokens à esquerda e direita
    for i, token in enumerate(tokens):
        y = len(tokens) - 1 - i
        ax5.text(0, y, token, ha='center', va='center', fontsize=11,
                bbox=dict(boxstyle='round', facecolor='lightblue', edgecolor='blue'))
        ax5.text(2, y, token, ha='center', va='center', fontsize=11,
                bbox=dict(boxstyle='round', facecolor='lightgreen', edgecolor='green'))

    # Desenhar setas com espessura proporcional à atenção
    for i in range(len(tokens)):
        for j in range(len(tokens)):
            weight = attention_weights[i, j]
            if weight > 0.1:  # Só mostrar conexões significativas
                y_from = len(tokens) - 1 - i
                y_to = len(tokens) - 1 - j
                ax5.annotate('', xy=(1.8, y_to), xytext=(0.2, y_from),
                           arrowprops=dict(arrowstyle='->', color='purple',
                                         alpha=weight, lw=weight * 5))

    ax5.text(0, -0.4, 'Query', ha='center', fontsize=9, style='italic')
    ax5.text(2, -0.4, 'Key/Value', ha='center', fontsize=9, style='italic')

    # 6. Output
    ax6 = axes[1, 2]
    im6 = ax6.imshow(output, cmap='coolwarm', aspect='auto')
    ax6.set_title('6. Saída\n(média ponderada dos Values)')
    ax6.set_yticks(range(len(tokens)))
    ax6.set_yticklabels(tokens)
    ax6.set_xlabel('Dimensão')
    plt.colorbar(im6, ax=ax6, shrink=0.8)

    plt.tight_layout()
    plt.savefig('self_attention_visualization.png', dpi=150, bbox_inches='tight')
    print("\n[Imagem salva! Abrindo...]")
    plt.show(block=False)
    plt.pause(2)
    plt.close()

    return attention_weights, output


# Exemplo com tokens de uma frase
if __name__ == "__main__":
    np.random.seed(123)

    # Tokens de exemplo (simulando embeddings)
    tokens = ['O', 'gato', 'comeu', 'peixe']
    seq_len = len(tokens)
    d_model = 8
    d_k = d_v = 4

    # Criar embeddings simulados (na prática, viriam de uma lookup table)
    # Vamos criar embeddings que façam sentido semanticamente
    X = np.random.randn(seq_len, d_model)
    # Fazer "gato" e "peixe" mais similares (ambos são substantivos/animais)
    X[1] = X[1] + np.array([0.5, 0.5, 0, 0, 0, 0, 0, 0])
    X[3] = X[3] + np.array([0.4, 0.4, 0, 0, 0, 0, 0, 0])

    # Pesos (normalmente aprendidos durante treinamento)
    W_q = np.random.randn(d_model, d_k) * 0.3
    W_k = np.random.randn(d_model, d_k) * 0.3
    W_v = np.random.randn(d_model, d_v) * 0.3

    print("=" * 50)
    print("SELF-ATTENTION VISUALIZADO")
    print("=" * 50)
    print(f"\nFrase: '{' '.join(tokens)}'")
    print(f"Sequência: {seq_len} tokens")
    print(f"Dimensão do modelo: {d_model}")
    print(f"Dimensão Q/K: {d_k}")
    print()

    weights, output = self_attention_visual(X, W_q, W_k, W_v, tokens)

    print("\nInterpretação dos Pesos de Atenção:")
    print("-" * 40)
    for i, token in enumerate(tokens):
        top_attention = np.argmax(weights[i])
        print(f"'{token}' presta mais atenção em '{tokens[top_attention]}' ({weights[i, top_attention]:.1%})")

    print(f"\nImagem salva em: self_attention_visualization.png")
