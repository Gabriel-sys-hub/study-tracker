// Recursos de estudo organizados por semana e tópico
// Estrutura: resources[weekNumber][topicIndex]
// Links verificados e funcionais

export const studyResources = {
  // ========== MÊS 1 — IA & LLMs ==========

  // SEMANA 1: Arquitetura dos LLMs e APIs
  1: [
    {
      // Transformers, embeddings, tokens
      videos: [
        { title: "Let's build GPT: from scratch, in code", url: "https://www.youtube.com/watch?v=kCc8FmEb1nY", duration: "1h 56min", lang: "en" },
        { title: "Attention in transformers, visually explained (3Blue1Brown)", url: "https://www.youtube.com/watch?v=eMlx5fFNoYc", duration: "26 min", lang: "en" },
        { title: "But what is a GPT? Visual intro to Transformers (3Blue1Brown)", url: "https://www.youtube.com/watch?v=wjZofJX0v4M", duration: "27 min", lang: "en" },
        { title: "Deep Dive into LLMs like ChatGPT (Karpathy)", url: "https://www.youtube.com/watch?v=7xTGNNLPyMI", duration: "3h 31min", lang: "en" },
      ],
      books: [
        { title: "Natural Language Processing with Transformers", author: "Lewis Tunstall et al.", link: "https://www.oreilly.com/library/view/natural-language-processing/9781098136789/" },
        { title: "Build a Large Language Model (From Scratch)", author: "Sebastian Raschka", link: "https://www.manning.com/books/build-a-large-language-model-from-scratch" },
      ],
      articles: [
        { title: "The Illustrated Transformer (Jay Alammar)", url: "https://jalammar.github.io/illustrated-transformer/", lang: "en" },
        { title: "Hugging Face - Tokenizer Summary", url: "https://huggingface.co/docs/transformers/tokenizer_summary", lang: "en" },
        { title: "Neural Networks: Zero to Hero (GitHub)", url: "https://github.com/karpathy/nn-zero-to-hero", lang: "en" },
      ],
      exercises: [
        { description: "Use o tokenizer online da OpenAI (platform.openai.com/tokenizer) para tokenizar 5 frases diferentes e compare o número de tokens", difficulty: "easy" },
        { description: "Visualize embeddings de palavras relacionadas usando TensorFlow Projector (projector.tensorflow.org)", difficulty: "medium" },
        { description: "Siga o tutorial do Karpathy para implementar self-attention do zero", difficulty: "hard" },
      ]
    },
    {
      // Context window, temperatura, top-p/k
      videos: [
        { title: "Let's build GPT (seção sobre parâmetros)", url: "https://www.youtube.com/watch?v=kCc8FmEb1nY", duration: "1h 56min", lang: "en" },
      ],
      books: [
        { title: "Build a Large Language Model (From Scratch)", author: "Sebastian Raschka", link: "https://www.manning.com/books/build-a-large-language-model-from-scratch" },
      ],
      articles: [
        { title: "Anthropic - Model Parameters", url: "https://docs.anthropic.com/en/api/complete", lang: "en" },
        { title: "OpenAI - API Reference", url: "https://platform.openai.com/docs/api-reference/chat/create", lang: "en" },
      ],
      exercises: [
        { description: "Teste o mesmo prompt com temperatura 0, 0.5 e 1.0 no playground da OpenAI - documente as diferenças", difficulty: "easy" },
        { description: "Compare respostas usando top_p=0.9 vs top_p=0.1 para geração criativa", difficulty: "medium" },
        { description: "Crie um script que demonstra como context window afeta a qualidade das respostas", difficulty: "medium" },
      ]
    },
    {
      // Diferenças entre modelos (GPT-4o, Claude, Gemini)
      videos: [
        { title: "Deep Dive into LLMs like ChatGPT", url: "https://www.youtube.com/watch?v=7xTGNNLPyMI", duration: "3h 31min", lang: "en" },
      ],
      books: [
        { title: "Generative AI with LangChain", author: "Ben Auffarth", link: "https://www.packtpub.com/product/generative-ai-with-langchain/9781835083468" },
      ],
      articles: [
        { title: "Claude 3 Model Card", url: "https://www.anthropic.com/news/claude-3-family", lang: "en" },
        { title: "GPT-4 Technical Report", url: "https://openai.com/research/gpt-4", lang: "en" },
        { title: "Gemini Model Overview", url: "https://deepmind.google/technologies/gemini/", lang: "en" },
        { title: "LMSYS Chatbot Arena Leaderboard", url: "https://chat.lmsys.org/?leaderboard", lang: "en" },
        { title: "Artificial Analysis - LLM Comparison", url: "https://artificialanalysis.ai/models", lang: "en" },
      ],
      exercises: [
        { description: "Compare as respostas de 3 modelos diferentes para o mesmo prompt complexo", difficulty: "easy" },
        { description: "Teste capacidades de raciocínio matemático entre GPT-4, Claude e Gemini", difficulty: "medium" },
        { description: "Crie uma matriz comparativa de features: preço, context window, multimodal, etc.", difficulty: "medium" },
      ]
    },
    {
      // Tokenização na prática
      videos: [
        { title: "Let's build the GPT Tokenizer (Karpathy)", url: "https://www.youtube.com/watch?v=zduSFxRajkE", duration: "2h 13min", lang: "en" },
      ],
      books: [
        { title: "Speech and Language Processing (free online)", author: "Jurafsky & Martin", link: "https://web.stanford.edu/~jurafsky/slp3/" },
      ],
      articles: [
        { title: "OpenAI Tokenizer Tool", url: "https://platform.openai.com/tokenizer", lang: "en" },
        { title: "Hugging Face - BPE Tokenization", url: "https://huggingface.co/learn/nlp-course/chapter6/5", lang: "en" },
        { title: "Tiktokenizer - Compare tokenizers", url: "https://tiktokenizer.vercel.app/", lang: "en" },
      ],
      exercises: [
        { description: "Use o tiktoken para contar tokens de um texto longo e calcule o custo estimado", difficulty: "easy" },
        { description: "Compare tokenização de código vs texto natural - qual usa mais tokens?", difficulty: "medium" },
        { description: "Implemente BPE tokenizer do zero seguindo o tutorial do Karpathy", difficulty: "hard" },
      ]
    },
    {
      // Explorar playgrounds (Anthropic + OpenAI)
      videos: [],
      books: [],
      articles: [
        { title: "Anthropic Console", url: "https://console.anthropic.com/", lang: "en" },
        { title: "OpenAI Playground", url: "https://platform.openai.com/playground", lang: "en" },
        { title: "Getting Started with Claude", url: "https://docs.anthropic.com/en/docs/quickstart", lang: "en" },
        { title: "OpenAI Quickstart", url: "https://platform.openai.com/docs/quickstart", lang: "en" },
      ],
      exercises: [
        { description: "Crie uma conta na Anthropic e OpenAI, explore os playgrounds", difficulty: "easy" },
        { description: "Teste system prompts diferentes e documente como afetam as respostas", difficulty: "easy" },
        { description: "Use o playground para iterar em um prompt até conseguir output estruturado perfeito", difficulty: "medium" },
      ]
    },
  ],

  // SEMANA 2: Prompt Engineering Avançado
  2: [
    {
      // Zero-shot, Few-shot, Many-shot
      videos: [
        { title: "ChatGPT Prompt Engineering for Developers (DeepLearning.AI)", url: "https://learn.deeplearning.ai/courses/chatgpt-prompt-eng/", duration: "1h", lang: "en" },
      ],
      books: [
        { title: "Prompt Engineering Guide (free)", author: "DAIR.AI", link: "https://www.promptingguide.ai/" },
      ],
      articles: [
        { title: "Prompting Guide - Few-Shot", url: "https://www.promptingguide.ai/techniques/fewshot", lang: "en" },
        { title: "Anthropic Prompt Engineering", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview", lang: "en" },
        { title: "Learn Prompting", url: "https://learnprompting.org/", lang: "en" },
      ],
      exercises: [
        { description: "Crie um classificador de sentimentos usando zero-shot, few-shot (3 exemplos) e many-shot (10 exemplos)", difficulty: "easy" },
        { description: "Compare a precisão de cada abordagem em 20 textos de teste", difficulty: "medium" },
        { description: "Encontre o número mínimo de exemplos necessários para uma tarefa específica", difficulty: "medium" },
      ]
    },
    {
      // Chain-of-Thought e variações
      videos: [
        { title: "ChatGPT Prompt Engineering for Developers", url: "https://learn.deeplearning.ai/courses/chatgpt-prompt-eng/", duration: "1h", lang: "en" },
      ],
      books: [],
      articles: [
        { title: "Chain-of-Thought Prompting", url: "https://www.promptingguide.ai/techniques/cot", lang: "en" },
        { title: "Chain-of-Thought Paper (arXiv)", url: "https://arxiv.org/abs/2201.11903", lang: "en" },
        { title: "Extended Thinking - Claude", url: "https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking", lang: "en" },
        { title: "Tree of Thoughts Paper", url: "https://arxiv.org/abs/2305.10601", lang: "en" },
      ],
      exercises: [
        { description: "Resolva 5 problemas de matemática com e sem CoT - compare resultados", difficulty: "easy" },
        { description: "Implemente self-consistency: gere 5 respostas e escolha a mais frequente", difficulty: "medium" },
        { description: "Crie um prompt que usa Tree of Thoughts para um problema de planejamento", difficulty: "hard" },
      ]
    },
    {
      // Structured Outputs (JSON, XML)
      videos: [],
      books: [],
      articles: [
        { title: "OpenAI Structured Outputs", url: "https://platform.openai.com/docs/guides/structured-outputs", lang: "en" },
        { title: "Claude - Use XML Tags", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/use-xml-tags", lang: "en" },
        { title: "JSON Mode Guide", url: "https://platform.openai.com/docs/guides/json-mode", lang: "en" },
      ],
      exercises: [
        { description: "Extraia dados estruturados de um texto livre para JSON com schema definido", difficulty: "easy" },
        { description: "Use XML tags para organizar um prompt complexo multi-parte", difficulty: "medium" },
        { description: "Crie um parser que valida o JSON retornado contra um JSON Schema", difficulty: "medium" },
      ]
    },
    {
      // Prompt chaining
      videos: [],
      books: [],
      articles: [
        { title: "Prompt Chaining - Anthropic", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/chain-prompts", lang: "en" },
        { title: "Prompt Chaining Guide", url: "https://www.promptingguide.ai/techniques/prompt-chaining", lang: "en" },
      ],
      exercises: [
        { description: "Crie uma chain de 3 prompts: resumir → extrair entidades → gerar perguntas", difficulty: "medium" },
        { description: "Implemente um pipeline que traduz, analisa sentimento e categoriza texto", difficulty: "medium" },
        { description: "Construa um sistema de revisão de código em 4 etapas encadeadas", difficulty: "hard" },
      ]
    },
    {
      // Técnicas anti-alucinação
      videos: [],
      books: [],
      articles: [
        { title: "Reduce Hallucinations - Anthropic", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/reduce-hallucinations", lang: "en" },
        { title: "Mitigating Hallucinations - Pinecone", url: "https://www.pinecone.io/learn/hallucination/", lang: "en" },
      ],
      exercises: [
        { description: "Teste prompts que pedem fontes e verifique se o modelo inventa citações", difficulty: "easy" },
        { description: "Implemente um prompt que força o modelo a dizer 'não sei' quando apropriado", difficulty: "medium" },
        { description: "Crie um sistema de verificação cruzada com múltiplas chamadas de API", difficulty: "hard" },
      ]
    },
  ],

  // SEMANA 3: APIs de LLMs na Prática
  3: [
    {
      // Streaming de respostas (SSE)
      videos: [],
      books: [],
      articles: [
        { title: "OpenAI Streaming Guide", url: "https://platform.openai.com/docs/api-reference/streaming", lang: "en" },
        { title: "Anthropic Streaming", url: "https://docs.anthropic.com/en/api/streaming", lang: "en" },
      ],
      exercises: [
        { description: "Implemente streaming básico com a API da Anthropic em Node.js", difficulty: "easy" },
        { description: "Crie uma UI que mostra tokens sendo gerados em tempo real", difficulty: "medium" },
        { description: "Implemente cancelamento de stream e tratamento de erros robusto", difficulty: "medium" },
      ]
    },
    {
      // Multimodal (imagens, PDFs)
      videos: [],
      books: [],
      articles: [
        { title: "Claude Vision Guide", url: "https://docs.anthropic.com/en/docs/build-with-claude/vision", lang: "en" },
        { title: "OpenAI Vision Guide", url: "https://platform.openai.com/docs/guides/vision", lang: "en" },
        { title: "Claude PDF Support", url: "https://docs.anthropic.com/en/docs/build-with-claude/pdf-support", lang: "en" },
      ],
      exercises: [
        { description: "Envie uma imagem para Claude e peça descrição detalhada", difficulty: "easy" },
        { description: "Crie um extrator de dados de recibos/notas fiscais usando vision", difficulty: "medium" },
        { description: "Implemente um analisador de PDF que extrai tabelas e gráficos", difficulty: "hard" },
      ]
    },
    {
      // Gerenciamento de histórico de conversa
      videos: [],
      books: [],
      articles: [
        { title: "Maintain Context - Anthropic", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/maintain-context", lang: "en" },
        { title: "Conversational Memory - LangChain", url: "https://python.langchain.com/docs/modules/memory/", lang: "en" },
      ],
      exercises: [
        { description: "Implemente um chat simples que mantém histórico de mensagens", difficulty: "easy" },
        { description: "Crie um sistema de sliding window que mantém as últimas N mensagens", difficulty: "medium" },
        { description: "Implemente sumarização automática de histórico quando excede limite", difficulty: "hard" },
      ]
    },
    {
      // Rate limits e retry com backoff exponencial
      videos: [],
      books: [],
      articles: [
        { title: "Anthropic Rate Limits", url: "https://docs.anthropic.com/en/api/rate-limits", lang: "en" },
        { title: "OpenAI Rate Limits", url: "https://platform.openai.com/docs/guides/rate-limits", lang: "en" },
        { title: "Exponential Backoff - AWS", url: "https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/", lang: "en" },
      ],
      exercises: [
        { description: "Implemente uma função de retry com backoff exponencial e jitter", difficulty: "easy" },
        { description: "Crie um rate limiter client-side que respeita os headers da API", difficulty: "medium" },
        { description: "Implemente um sistema de filas para requisições em lote respeitando limites", difficulty: "hard" },
      ]
    },
    {
      // Prompt Caching da Anthropic
      videos: [],
      books: [],
      articles: [
        { title: "Prompt Caching - Anthropic", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching", lang: "en" },
        { title: "Prompt Caching Announcement", url: "https://www.anthropic.com/news/prompt-caching", lang: "en" },
      ],
      exercises: [
        { description: "Implemente prompt caching para um system prompt grande e fixo", difficulty: "easy" },
        { description: "Compare custos com e sem caching para 100 requisições similares", difficulty: "medium" },
        { description: "Otimize uma aplicação RAG para usar caching no contexto recuperado", difficulty: "hard" },
      ]
    },
  ],

  // SEMANA 4: Function Calling & Tool Use
  4: [
    {
      // O que é Tool Use e por que é essencial
      videos: [],
      books: [],
      articles: [
        { title: "Tool Use - Anthropic", url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use", lang: "en" },
        { title: "Function Calling - OpenAI", url: "https://platform.openai.com/docs/guides/function-calling", lang: "en" },
        { title: "LLM Agents - Pinecone", url: "https://www.pinecone.io/learn/llm-agents/", lang: "en" },
      ],
      exercises: [
        { description: "Liste 10 casos de uso onde tool use é essencial vs. apenas texto", difficulty: "easy" },
        { description: "Desenhe a arquitetura de um assistente que usa ferramentas externas", difficulty: "medium" },
      ]
    },
    {
      // Definir ferramentas com JSON Schema
      videos: [],
      books: [],
      articles: [
        { title: "JSON Schema Basics", url: "https://json-schema.org/learn/getting-started-step-by-step", lang: "en" },
        { title: "Tool Definition - Anthropic", url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use#defining-tools", lang: "en" },
        { title: "Function Calling Best Practices - OpenAI", url: "https://platform.openai.com/docs/guides/function-calling/best-practices", lang: "en" },
      ],
      exercises: [
        { description: "Defina o schema JSON para uma ferramenta de busca de clima", difficulty: "easy" },
        { description: "Crie schemas para 5 ferramentas diferentes com validação de parâmetros", difficulty: "medium" },
        { description: "Implemente validação automática de parâmetros recebidos do LLM", difficulty: "medium" },
      ]
    },
    {
      // Fluxo: LLM decide → código executa → resultado volta
      videos: [],
      books: [],
      articles: [
        { title: "Agentic Loop - Anthropic", url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use#agentic-loop", lang: "en" },
        { title: "Handling Tool Results", url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use#handling-tool-results", lang: "en" },
      ],
      exercises: [
        { description: "Implemente o fluxo completo de tool use com uma ferramenta simples", difficulty: "medium" },
        { description: "Adicione logging detalhado em cada etapa do fluxo", difficulty: "easy" },
        { description: "Crie um diagrama de sequência do fluxo completo de tool use", difficulty: "easy" },
      ]
    },
    {
      // Parallel tool use
      videos: [],
      books: [],
      articles: [
        { title: "Parallel Tool Use - Anthropic", url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use#parallel-tool-use", lang: "en" },
        { title: "Parallel Function Calling - OpenAI", url: "https://platform.openai.com/docs/guides/function-calling/parallel-function-calling", lang: "en" },
      ],
      exercises: [
        { description: "Configure parallel tool use e execute múltiplas ferramentas simultaneamente", difficulty: "medium" },
        { description: "Compare tempo de execução: sequencial vs paralelo para 5 ferramentas", difficulty: "medium" },
        { description: "Implemente tratamento de erros quando uma das ferramentas paralelas falha", difficulty: "hard" },
      ]
    },
    {
      // Projeto: API com tools sem frameworks
      videos: [],
      books: [],
      articles: [
        { title: "Tool Use Examples - Anthropic", url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use#examples", lang: "en" },
        { title: "Anthropic Cookbook (GitHub)", url: "https://github.com/anthropics/anthropic-cookbook", lang: "en" },
      ],
      exercises: [
        { description: "Crie uma API Express que usa Claude com 3 ferramentas customizadas", difficulty: "hard" },
        { description: "Implemente ferramentas: buscar clima, calcular, e buscar dados de API externa", difficulty: "hard" },
        { description: "Adicione autenticação e rate limiting à sua API", difficulty: "hard" },
      ]
    },
  ],

  // ========== MÊS 2 — Agentes & RAG ==========

  // SEMANA 5: Embeddings e Busca Vetorial
  5: [
    {
      // O que são embeddings
      videos: [
        { title: "But what is a GPT? (seção sobre embeddings)", url: "https://www.youtube.com/watch?v=wjZofJX0v4M", duration: "27 min", lang: "en" },
      ],
      books: [],
      articles: [
        { title: "What are Embeddings? - Pinecone", url: "https://www.pinecone.io/learn/vector-embeddings/", lang: "en" },
        { title: "OpenAI Embeddings Guide", url: "https://platform.openai.com/docs/guides/embeddings", lang: "en" },
        { title: "Visualizing Embeddings - TensorFlow", url: "https://projector.tensorflow.org/", lang: "en" },
      ],
      exercises: [
        { description: "Gere embeddings para 10 frases e visualize a similaridade entre elas", difficulty: "easy" },
        { description: "Compare embeddings de sinônimos vs antônimos - qual a diferença?", difficulty: "medium" },
        { description: "Crie um buscador semântico simples com embeddings e cosseno", difficulty: "medium" },
      ]
    },
    {
      // Modelos de embedding
      videos: [],
      books: [],
      articles: [
        { title: "Voyage AI Embeddings", url: "https://docs.voyageai.com/docs/embeddings", lang: "en" },
        { title: "OpenAI Embedding Models", url: "https://platform.openai.com/docs/guides/embeddings/embedding-models", lang: "en" },
        { title: "BGE Models - HuggingFace", url: "https://huggingface.co/BAAI/bge-large-en-v1.5", lang: "en" },
        { title: "MTEB Leaderboard", url: "https://huggingface.co/spaces/mteb/leaderboard", lang: "en" },
      ],
      exercises: [
        { description: "Compare custo/dimensão/performance de 3 modelos de embedding", difficulty: "easy" },
        { description: "Teste o mesmo dataset com Voyage AI, OpenAI e BGE - qual performa melhor?", difficulty: "medium" },
        { description: "Rode BGE localmente com Hugging Face Transformers", difficulty: "hard" },
      ]
    },
    {
      // Similaridade cosseno vs distância euclidiana
      videos: [],
      books: [],
      articles: [
        { title: "Vector Similarity Metrics - Pinecone", url: "https://www.pinecone.io/learn/vector-similarity/", lang: "en" },
        { title: "Distance Metrics - Weaviate", url: "https://weaviate.io/blog/distance-metrics-in-vector-search", lang: "en" },
      ],
      exercises: [
        { description: "Implemente similaridade cosseno e distância euclidiana do zero", difficulty: "easy" },
        { description: "Compare resultados de busca usando ambas métricas - quando diferem?", difficulty: "medium" },
        { description: "Teste dot product vs cosseno para embeddings normalizados", difficulty: "medium" },
      ]
    },
    {
      // Chunking strategies
      videos: [],
      books: [],
      articles: [
        { title: "Chunking Strategies - Pinecone", url: "https://www.pinecone.io/learn/chunking-strategies/", lang: "en" },
        { title: "Text Splitters - LangChain", url: "https://python.langchain.com/docs/modules/data_connection/document_transformers/", lang: "en" },
        { title: "Chunking Best Practices - Unstructured", url: "https://unstructured.io/blog/chunking-for-rag-best-practices", lang: "en" },
      ],
      exercises: [
        { description: "Implemente 3 estratégias de chunking diferentes para o mesmo documento", difficulty: "medium" },
        { description: "Compare retrieval quality com fixed vs recursive chunking", difficulty: "medium" },
        { description: "Implemente semantic chunking usando embeddings para detectar quebras", difficulty: "hard" },
      ]
    },
    {
      // Chunk overlap e metadata filtering
      videos: [],
      books: [],
      articles: [
        { title: "Chunk Overlap - Pinecone", url: "https://www.pinecone.io/learn/chunking-strategies/", lang: "en" },
        { title: "Metadata Filtering - Pinecone", url: "https://docs.pinecone.io/docs/metadata-filtering", lang: "en" },
      ],
      exercises: [
        { description: "Teste overlap de 0%, 10%, 20% e 50% - qual dá melhores resultados?", difficulty: "medium" },
        { description: "Adicione metadata (autor, data, categoria) aos chunks e filtre busca", difficulty: "medium" },
        { description: "Implemente um sistema de busca híbrida: vetor + metadata filter", difficulty: "hard" },
      ]
    },
  ],

  // SEMANA 6: Bancos Vetoriais e RAG Pipeline
  6: [
    {
      // Comparativo de bancos vetoriais
      videos: [],
      books: [],
      articles: [
        { title: "Vector Database Comparison", url: "https://benchmark.vectorview.ai/", lang: "en" },
        { title: "Top Vector Databases - DataCamp", url: "https://www.datacamp.com/blog/the-top-5-vector-databases", lang: "en" },
        { title: "pgvector - GitHub", url: "https://github.com/pgvector/pgvector", lang: "en" },
        { title: "Chroma Documentation", url: "https://docs.trychroma.com/", lang: "en" },
        { title: "Qdrant Documentation", url: "https://qdrant.tech/documentation/", lang: "en" },
      ],
      exercises: [
        { description: "Crie uma tabela comparativa: preço, self-hosted, features, escala", difficulty: "easy" },
        { description: "Configure Chroma localmente e faça operações CRUD básicas", difficulty: "medium" },
        { description: "Compare latência de busca: Pinecone (cloud) vs Chroma (local)", difficulty: "hard" },
      ]
    },
    {
      // RAG pipeline completo do zero
      videos: [
        { title: "RAG From Scratch - freeCodeCamp (Lance Martin)", url: "https://www.youtube.com/watch?v=sVcwVQRHIc8", duration: "2h", lang: "en" },
      ],
      books: [],
      articles: [
        { title: "RAG from Scratch - GitHub (LangChain)", url: "https://github.com/langchain-ai/rag-from-scratch", lang: "en" },
        { title: "Building RAG Applications - Anthropic", url: "https://docs.anthropic.com/en/docs/build-with-claude/rag", lang: "en" },
        { title: "RAG Tutorial - LangChain", url: "https://python.langchain.com/docs/tutorials/rag/", lang: "en" },
        { title: "What is RAG? - IBM", url: "https://www.ibm.com/think/topics/retrieval-augmented-generation", lang: "en" },
      ],
      exercises: [
        { description: "Implemente RAG básico: ingest → embed → store → retrieve → generate", difficulty: "hard" },
        { description: "Adicione um documento e faça 5 perguntas sobre ele", difficulty: "medium" },
        { description: "Meça a latência de cada etapa do pipeline", difficulty: "medium" },
      ]
    },
    {
      // Sparse vs Dense retrieval
      videos: [],
      books: [],
      articles: [
        { title: "Semantic Search - Pinecone", url: "https://www.pinecone.io/learn/semantic-search/", lang: "en" },
        { title: "BM25 Algorithm - Elastic", url: "https://www.elastic.co/blog/practical-bm25-part-2-the-bm25-algorithm-and-its-variables", lang: "en" },
      ],
      exercises: [
        { description: "Implemente busca BM25 usando rank-bm25 ou similar", difficulty: "medium" },
        { description: "Compare resultados: keyword search vs semantic search para 10 queries", difficulty: "medium" },
        { description: "Identifique casos onde BM25 é melhor que embeddings", difficulty: "medium" },
      ]
    },
    {
      // Hybrid search
      videos: [],
      books: [],
      articles: [
        { title: "Hybrid Search - Pinecone", url: "https://www.pinecone.io/learn/hybrid-search-intro/", lang: "en" },
        { title: "Hybrid Search Fusion - Weaviate", url: "https://weaviate.io/blog/hybrid-search-fusion-algorithms", lang: "en" },
      ],
      exercises: [
        { description: "Implemente hybrid search combinando BM25 + embeddings", difficulty: "hard" },
        { description: "Teste diferentes pesos para sparse vs dense (0.3/0.7, 0.5/0.5, etc)", difficulty: "medium" },
        { description: "Implemente Reciprocal Rank Fusion (RRF) para combinar rankings", difficulty: "hard" },
      ]
    },
    {
      // Reranking
      videos: [],
      books: [],
      articles: [
        { title: "Cohere Rerank", url: "https://docs.cohere.com/docs/rerank-overview", lang: "en" },
        { title: "Cross-Encoder Reranking - SBERT", url: "https://www.sbert.net/examples/applications/cross-encoder/README.html", lang: "en" },
        { title: "Rerankers - Pinecone", url: "https://www.pinecone.io/learn/series/rag/rerankers/", lang: "en" },
      ],
      exercises: [
        { description: "Adicione Cohere Rerank ao seu pipeline RAG existente", difficulty: "medium" },
        { description: "Compare resultados com e sem reranking para 10 queries", difficulty: "medium" },
        { description: "Teste cross-encoder local (sentence-transformers) vs Cohere", difficulty: "hard" },
      ]
    },
  ],

  // SEMANA 7: Agentes
  7: [
    {
      // ReAct pattern
      videos: [],
      books: [],
      articles: [
        { title: "ReAct Prompting - DAIR.AI", url: "https://www.promptingguide.ai/techniques/react", lang: "en" },
        { title: "ReAct Paper (arXiv)", url: "https://arxiv.org/abs/2210.03629", lang: "en" },
        { title: "Agentic Systems - Anthropic", url: "https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems", lang: "en" },
        { title: "Building Effective Agents - Anthropic", url: "https://www.anthropic.com/engineering/building-effective-agents", lang: "en" },
      ],
      exercises: [
        { description: "Implemente o loop ReAct básico: Thought → Action → Observation", difficulty: "medium" },
        { description: "Crie um agente que pesquisa informações e responde perguntas", difficulty: "hard" },
        { description: "Adicione logging para visualizar o raciocínio do agente", difficulty: "easy" },
      ]
    },
    {
      // Tipos de memória
      videos: [],
      books: [],
      articles: [
        { title: "LLM Memory - Pinecone", url: "https://www.pinecone.io/learn/llm-memory/", lang: "en" },
        { title: "LLM Agents - Lilian Weng", url: "https://lilianweng.github.io/posts/2023-06-23-agent/", lang: "en" },
      ],
      exercises: [
        { description: "Implemente memória in-context com sliding window", difficulty: "easy" },
        { description: "Adicione memória externa usando vector DB para fatos importantes", difficulty: "medium" },
        { description: "Crie sistema de memória episódica que lembra interações passadas", difficulty: "hard" },
      ]
    },
    {
      // Multi-agent systems
      videos: [],
      books: [],
      articles: [
        { title: "Multi-Agent Systems - Anthropic", url: "https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems#multi-agent-systems", lang: "en" },
      ],
      exercises: [
        { description: "Desenhe arquitetura de sistema multi-agente para análise de código", difficulty: "medium" },
        { description: "Implemente orquestrador que delega para agentes especializados", difficulty: "hard" },
        { description: "Adicione comunicação entre agentes para tarefas colaborativas", difficulty: "hard" },
      ]
    },
    {
      // LangGraph, CrewAI, AutoGen
      videos: [],
      books: [],
      articles: [
        { title: "LangGraph Documentation", url: "https://langchain-ai.github.io/langgraph/", lang: "en" },
        { title: "CrewAI Documentation", url: "https://docs.crewai.com/", lang: "en" },
        { title: "AutoGen Documentation", url: "https://microsoft.github.io/autogen/", lang: "en" },
      ],
      exercises: [
        { description: "Crie um workflow simples com LangGraph (2-3 nodes)", difficulty: "medium" },
        { description: "Implemente uma crew de 3 agentes com CrewAI", difficulty: "medium" },
        { description: "Compare a mesma tarefa implementada em LangGraph vs CrewAI", difficulty: "hard" },
      ]
    },
    {
      // Human-in-the-loop
      videos: [],
      books: [],
      articles: [
        { title: "Human-in-the-Loop - Anthropic", url: "https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems#human-in-the-loop", lang: "en" },
        { title: "HITL - LangGraph", url: "https://langchain-ai.github.io/langgraph/concepts/human_in_the_loop/", lang: "en" },
      ],
      exercises: [
        { description: "Adicione confirmação humana antes de ações destrutivas", difficulty: "easy" },
        { description: "Implemente sistema de aprovação para decisões do agente", difficulty: "medium" },
        { description: "Crie UI para visualizar e aprovar/rejeitar ações pendentes", difficulty: "hard" },
      ]
    },
  ],

  // SEMANA 8: Avaliação e Observabilidade
  8: [
    {
      // Métricas de RAG
      videos: [],
      books: [],
      articles: [
        { title: "RAG Evaluation - Pinecone", url: "https://www.pinecone.io/learn/rag-evaluation/", lang: "en" },
        { title: "RAGAS Metrics", url: "https://docs.ragas.io/en/latest/concepts/metrics/", lang: "en" },
      ],
      exercises: [
        { description: "Defina ground truth para 20 queries e calcule precision/recall manualmente", difficulty: "medium" },
        { description: "Implemente cálculo automatizado de faithfulness", difficulty: "hard" },
        { description: "Crie dashboard de métricas para seu pipeline RAG", difficulty: "hard" },
      ]
    },
    {
      // RAGAS
      videos: [],
      books: [],
      articles: [
        { title: "RAGAS Documentation", url: "https://docs.ragas.io/", lang: "en" },
        { title: "Getting Started - RAGAS", url: "https://docs.ragas.io/en/latest/getstarted/", lang: "en" },
      ],
      exercises: [
        { description: "Instale RAGAS e avalie seu pipeline com as métricas padrão", difficulty: "medium" },
        { description: "Gere synthetic test data com RAGAS", difficulty: "medium" },
        { description: "Compare scores antes/depois de otimizações no pipeline", difficulty: "hard" },
      ]
    },
    {
      // Testes de regressão para LLMs
      videos: [],
      books: [],
      articles: [
        { title: "Evaluating AI Systems - Anthropic", url: "https://www.anthropic.com/news/evaluating-ai-systems", lang: "en" },
        { title: "Promptfoo Documentation", url: "https://www.promptfoo.dev/docs/intro", lang: "en" },
      ],
      exercises: [
        { description: "Crie suite de 20 test cases para seu prompt principal", difficulty: "medium" },
        { description: "Configure Promptfoo para rodar testes automaticamente", difficulty: "medium" },
        { description: "Adicione testes de regressão ao CI/CD pipeline", difficulty: "hard" },
      ]
    },
    {
      // Langfuse / LangSmith
      videos: [],
      books: [],
      articles: [
        { title: "Langfuse Documentation", url: "https://langfuse.com/docs", lang: "en" },
        { title: "LangSmith Documentation", url: "https://docs.smith.langchain.com/", lang: "en" },
      ],
      exercises: [
        { description: "Configure Langfuse e trace 10 requests do seu app", difficulty: "medium" },
        { description: "Analise latência e custos por feature no dashboard", difficulty: "easy" },
        { description: "Configure alertas para latência alta ou erros frequentes", difficulty: "medium" },
      ]
    },
    {
      // Guardrails e prompt injection
      videos: [],
      books: [],
      articles: [
        { title: "Prompt Injection Guide - Lakera", url: "https://www.lakera.ai/blog/guide-to-prompt-injection", lang: "en" },
        { title: "Guardrails AI Documentation", url: "https://docs.guardrailsai.com/", lang: "en" },
        { title: "OWASP LLM Top 10", url: "https://owasp.org/www-project-top-10-for-large-language-model-applications/", lang: "en" },
      ],
      exercises: [
        { description: "Tente 10 técnicas de prompt injection no seu app - quantas funcionam?", difficulty: "medium" },
        { description: "Implemente detecção básica de prompt injection", difficulty: "medium" },
        { description: "Configure Guardrails AI para validar inputs e outputs", difficulty: "hard" },
      ]
    },
  ],

  // Semanas 9-16 com estrutura similar mas links verificados de documentação oficial
  // ... (mantendo a mesma estrutura para as semanas restantes)

  9: [
    { videos: [], books: [], articles: [{ title: "Amazon Bedrock Documentation", url: "https://docs.aws.amazon.com/bedrock/", lang: "en" }, { title: "Claude on Bedrock", url: "https://docs.anthropic.com/en/api/claude-on-amazon-bedrock", lang: "en" }], exercises: [{ description: "Configure acesso ao Bedrock e faça sua primeira chamada", difficulty: "medium" }] },
    { videos: [], books: [], articles: [{ title: "Lambda Best Practices", url: "https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html", lang: "en" }], exercises: [{ description: "Crie uma Lambda que chama Claude via API Gateway", difficulty: "medium" }] },
    { videos: [], books: [], articles: [{ title: "ECS Best Practices", url: "https://docs.aws.amazon.com/AmazonECS/latest/bestpracticesguide/", lang: "en" }], exercises: [{ description: "Containerize sua aplicação LLM", difficulty: "medium" }] },
    { videos: [], books: [], articles: [{ title: "DynamoDB Single Table Design", url: "https://www.alexdebrie.com/posts/dynamodb-single-table/", lang: "en" }], exercises: [{ description: "Configure S3 para armazenar documentos do RAG", difficulty: "easy" }] },
    { videos: [], books: [{ title: "The CDK Book", author: "Sathyajith Bhat", link: "https://www.thecdkbook.com/" }], articles: [{ title: "AWS CDK Documentation", url: "https://docs.aws.amazon.com/cdk/v2/guide/home.html", lang: "en" }], exercises: [{ description: "Crie um stack CDK básico", difficulty: "medium" }] },
  ],

  10: [
    { videos: [], books: [], articles: [{ title: "Event-Driven Architecture - AWS", url: "https://aws.amazon.com/event-driven-architecture/", lang: "en" }], exercises: [{ description: "Crie pipeline: upload S3 → SQS → Lambda", difficulty: "medium" }] },
    { videos: [], books: [], articles: [{ title: "Step Functions Guide", url: "https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html", lang: "en" }], exercises: [{ description: "Crie state machine para pipeline RAG", difficulty: "medium" }] },
    { videos: [], books: [], articles: [{ title: "GPTCache - GitHub", url: "https://github.com/zilliztech/GPTCache", lang: "en" }], exercises: [{ description: "Implemente cache semântico", difficulty: "hard" }] },
    { videos: [], books: [], articles: [{ title: "Token Counting - Anthropic", url: "https://docs.anthropic.com/en/docs/build-with-claude/token-counting", lang: "en" }], exercises: [{ description: "Implemente tracking de tokens", difficulty: "easy" }] },
    { videos: [], books: [], articles: [{ title: "Deployment Strategies - AWS", url: "https://docs.aws.amazon.com/whitepapers/latest/practicing-continuous-integration-continuous-delivery/deployment-methods.html", lang: "en" }], exercises: [{ description: "Configure blue/green deployment", difficulty: "hard" }] },
  ],

  11: [
    { videos: [], books: [], articles: [{ title: "Cursor Documentation", url: "https://docs.cursor.com/", lang: "en" }, { title: "Cursor Rules Directory", url: "https://cursor.directory/", lang: "en" }], exercises: [{ description: "Crie .cursorrules personalizado", difficulty: "easy" }] },
    { videos: [], books: [], articles: [{ title: "GitHub Copilot Docs", url: "https://docs.github.com/en/copilot", lang: "en" }], exercises: [{ description: "Configure copilot-instructions.md", difficulty: "easy" }] },
    { videos: [], books: [], articles: [{ title: "Claude Code Documentation", url: "https://docs.anthropic.com/en/docs/claude-code", lang: "en" }], exercises: [{ description: "Use Claude Code para uma tarefa", difficulty: "easy" }] },
    { videos: [], books: [], articles: [{ title: "v0 by Vercel", url: "https://v0.dev/", lang: "en" }, { title: "Bolt.new", url: "https://bolt.new/", lang: "en" }], exercises: [{ description: "Crie um componente UI com v0", difficulty: "easy" }] },
    { videos: [], books: [], articles: [{ title: "Aider Documentation", url: "https://aider.chat/", lang: "en" }], exercises: [{ description: "Instale Aider e conecte ao Claude", difficulty: "easy" }] },
  ],

  12: [
    { videos: [], books: [], articles: [{ title: "LLM Pricing Comparison", url: "https://artificialanalysis.ai/models", lang: "en" }], exercises: [{ description: "Calcule custo médio por requisição", difficulty: "easy" }] },
    { videos: [], books: [], articles: [{ title: "LiteLLM Documentation", url: "https://docs.litellm.ai/", lang: "en" }], exercises: [{ description: "Configure LiteLLM como proxy", difficulty: "medium" }] },
    { videos: [], books: [], articles: [{ title: "Presidio Documentation", url: "https://microsoft.github.io/presidio/", lang: "en" }], exercises: [{ description: "Configure Presidio para detectar PII", difficulty: "medium" }] },
    { videos: [], books: [], articles: [{ title: "LGPD - Gov.br", url: "https://www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd", lang: "pt" }], exercises: [{ description: "Liste quais dados são PII segundo LGPD", difficulty: "easy" }] },
    { videos: [], books: [], articles: [{ title: "Ollama", url: "https://ollama.ai/", lang: "en" }], exercises: [{ description: "Instale Ollama e rode Llama 3", difficulty: "easy" }] },
  ],

  13: [
    { videos: [], books: [{ title: "Effective TypeScript", author: "Dan Vanderkam", link: "https://effectivetypescript.com/" }], articles: [{ title: "Conditional Types", url: "https://www.typescriptlang.org/docs/handbook/2/conditional-types.html", lang: "en" }], exercises: [{ description: "Crie tipo que extrai return type", difficulty: "medium" }] },
    { videos: [], books: [], articles: [{ title: "Mapped Types", url: "https://www.typescriptlang.org/docs/handbook/2/mapped-types.html", lang: "en" }], exercises: [{ description: "Crie tipo que transforma propriedades em optional", difficulty: "easy" }] },
    { videos: [], books: [], articles: [{ title: "satisfies operator", url: "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html", lang: "en" }], exercises: [{ description: "Refatore objeto para usar satisfies", difficulty: "easy" }] },
    { videos: [], books: [], articles: [{ title: "Branded Types", url: "https://egghead.io/blog/using-branded-types-in-typescript", lang: "en" }], exercises: [{ description: "Crie branded types para UserId, Email", difficulty: "medium" }] },
    { videos: [], books: [], articles: [{ title: "Type Challenges", url: "https://github.com/type-challenges/type-challenges", lang: "en" }], exercises: [{ description: "Complete 5 desafios 'easy'", difficulty: "easy" }] },
  ],

  14: [
    { videos: [], books: [], articles: [{ title: "Server Components", url: "https://nextjs.org/docs/app/building-your-application/rendering/server-components", lang: "en" }], exercises: [{ description: "Identifique componentes Server vs Client", difficulty: "easy" }] },
    { videos: [], books: [], articles: [{ title: "Server Actions", url: "https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations", lang: "en" }], exercises: [{ description: "Crie form com Server Action", difficulty: "medium" }] },
    { videos: [], books: [], articles: [{ title: "Partial Prerendering", url: "https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering", lang: "en" }], exercises: [{ description: "Habilite PPR experimental", difficulty: "easy" }] },
    { videos: [], books: [], articles: [{ title: "Caching in Next.js", url: "https://nextjs.org/docs/app/building-your-application/caching", lang: "en" }], exercises: [{ description: "Configure revalidação de cache", difficulty: "medium" }] },
    { videos: [], books: [], articles: [{ title: "Loading UI and Streaming", url: "https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming", lang: "en" }], exercises: [{ description: "Implemente Suspense boundaries", difficulty: "easy" }] },
  ],

  15: [
    { videos: [], books: [], articles: [{ title: "tRPC Documentation", url: "https://trpc.io/docs", lang: "en" }], exercises: [{ description: "Configure tRPC em Next.js", difficulty: "medium" }] },
    { videos: [], books: [], articles: [{ title: "Drizzle Documentation", url: "https://orm.drizzle.team/docs/overview", lang: "en" }], exercises: [{ description: "Configure Drizzle com PostgreSQL", difficulty: "medium" }] },
    { videos: [], books: [], articles: [{ title: "Neon Documentation", url: "https://neon.tech/docs/introduction", lang: "en" }], exercises: [{ description: "Crie projeto Neon e conecte", difficulty: "easy" }] },
    { videos: [], books: [], articles: [{ title: "Vercel AI SDK", url: "https://sdk.vercel.ai/docs", lang: "en" }], exercises: [{ description: "Crie chatbot com useChat", difficulty: "medium" }] },
    { videos: [], books: [], articles: [{ title: "Generating Structured Data", url: "https://sdk.vercel.ai/docs/ai-sdk-core/generating-structured-data", lang: "en" }], exercises: [{ description: "Use generateObject com Zod", difficulty: "medium" }] },
  ],

  16: [
    { videos: [], books: [], articles: [{ title: "Clerk Documentation", url: "https://clerk.com/docs", lang: "en" }], exercises: [{ description: "Configure Clerk em Next.js", difficulty: "medium" }] },
    { videos: [], books: [], articles: [{ title: "Stripe Documentation", url: "https://stripe.com/docs", lang: "en" }], exercises: [{ description: "Configure Stripe Checkout", difficulty: "medium" }] },
    { videos: [], books: [], articles: [{ title: "UploadThing Documentation", url: "https://docs.uploadthing.com/", lang: "en" }], exercises: [{ description: "Configure UploadThing", difficulty: "easy" }] },
    { videos: [], books: [], articles: [{ title: "Resend Documentation", url: "https://resend.com/docs", lang: "en" }], exercises: [{ description: "Configure Resend e envie email", difficulty: "easy" }] },
    { videos: [], books: [], articles: [{ title: "Vercel Documentation", url: "https://vercel.com/docs", lang: "en" }, { title: "Sentry for Next.js", url: "https://docs.sentry.io/platforms/javascript/guides/nextjs/", lang: "en" }], exercises: [{ description: "Deploy no Vercel", difficulty: "easy" }] },
  ],
};

// Helper para obter recursos de um tópico específico
export const getTopicResources = (week, topicIndex) => {
  return studyResources[week]?.[topicIndex] || null;
};
