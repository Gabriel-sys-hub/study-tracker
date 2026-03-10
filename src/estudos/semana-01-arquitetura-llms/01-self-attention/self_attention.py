"""
Implementação simplificada de Self-Attention em Python.
"""

import numpy as np


def softmax(x: np.ndarray) -> np.ndarray:
    """Aplica softmax ao longo do último eixo."""
    exp_x = np.exp(x - np.max(x, axis=-1, keepdims=True))
    return exp_x / np.sum(exp_x, axis=-1, keepdims=True)


def self_attention(
    X: np.ndarray,
    W_q: np.ndarray,
    W_k: np.ndarray,
    W_v: np.ndarray,
) -> tuple[np.ndarray, np.ndarray]:
    """
    Self-Attention simplificado.

    Args:
        X: Matriz de entrada (seq_len, d_model)
        W_q: Pesos para Query (d_model, d_k)
        W_k: Pesos para Key (d_model, d_k)
        W_v: Pesos para Value (d_model, d_v)

    Returns:
        output: Saída do attention (seq_len, d_v)
        attention_weights: Pesos de atenção (seq_len, seq_len)
    """
    # 1. Calcular Query, Key, Value
    Q = X @ W_q  # (seq_len, d_k)
    K = X @ W_k  # (seq_len, d_k)
    V = X @ W_v  # (seq_len, d_v)

    # 2. Calcular scores de atenção: Q @ K^T
    d_k = K.shape[-1]
    scores = Q @ K.T  # (seq_len, seq_len)

    # 3. Escalar por sqrt(d_k) para estabilidade
    scores = scores / np.sqrt(d_k)

    # 4. Aplicar softmax para obter pesos de atenção
    attention_weights = softmax(scores)  # (seq_len, seq_len)

    # 5. Multiplicar pelos Values
    output = attention_weights @ V  # (seq_len, d_v)

    return output, attention_weights


# Exemplo de uso
if __name__ == "__main__":
    np.random.seed(42)

    # Parâmetros
    seq_len = 4   # Tamanho da sequência
    d_model = 8   # Dimensão do modelo
    d_k = 6       # Dimensão de Q e K
    d_v = 6       # Dimensão de V

    # Entrada: 4 tokens, cada um com 8 dimensões
    X = np.random.randn(seq_len, d_model)

    # Matrizes de pesos (normalmente aprendidas)
    W_q = np.random.randn(d_model, d_k) * 0.1
    W_k = np.random.randn(d_model, d_k) * 0.1
    W_v = np.random.randn(d_model, d_v) * 0.1

    # Aplicar self-attention
    output, weights = self_attention(X, W_q, W_k, W_v)

    print("Entrada X:")
    print(f"  Shape: {X.shape}")

    print("\nPesos de Atenção:")
    print(f"  Shape: {weights.shape}")
    print(weights.round(3))

    print("\nSaída:")
    print(f"  Shape: {output.shape}")
    print(output.round(3))

    # Verificar que os pesos somam 1 por linha
    print(f"\nSoma dos pesos por linha: {weights.sum(axis=1).round(3)}")
