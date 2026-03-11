import { useState, useEffect } from "react";
import { Button, Card } from "./ui";
import {
  CATEGORY_COLORS,
  COMMON_STYLES,
  DIFFICULTY_CONFIG,
  RESOURCE_TYPE_CONFIG,
  GRADIENTS,
} from "../constants/theme";
import { cn, saveToStorage, loadFromStorage } from "../utils";

const AI_SUGGESTIONS_KEY = "study-tracker-ai-suggestions";
const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Temas e tópicos quentes de desenvolvimento organizados por categoria.
 * Cada tópico contém recursos reais em português e inglês.
 */
const HOT_TOPICS_DATABASE = {
  ai_ml: {
    name: "IA & Machine Learning",
    icon: "🤖",
    color: "purple",
    topics: [
      {
        title: "RAG Avançado com Reranking",
        description: "Técnicas de Retrieval-Augmented Generation com cross-encoders",
        difficulty: "hard",
        resources: [
          { type: "video", title: "RAG From Scratch", author: "LangChain", url: "https://www.youtube.com/watch?v=wd7TZ4w1mSw", lang: "en", duration: "1h 30min" },
          { type: "video", title: "Construindo RAG do Zero", author: "Código Fonte TV", url: "https://www.youtube.com/watch?v=BrsocJb-fAo", lang: "pt", duration: "45min" },
          { type: "docs", title: "LangChain RAG Tutorial", url: "https://python.langchain.com/docs/tutorials/rag/", lang: "en" },
          { type: "article", title: "Cohere Rerank Documentation", url: "https://docs.cohere.com/docs/reranking", lang: "en" },
          { type: "video", title: "Advanced RAG Techniques", author: "Sam Witteveen", url: "https://www.youtube.com/watch?v=TRjq7t2Ms5I", lang: "en", duration: "25min" },
        ],
      },
      {
        title: "Fine-tuning de LLMs com LoRA",
        description: "Adaptar modelos de linguagem com Low-Rank Adaptation",
        difficulty: "hard",
        resources: [
          { type: "video", title: "Fine-tuning LLMs with LoRA", author: "Hugging Face", url: "https://www.youtube.com/watch?v=Us5ZFp16PaU", lang: "en", duration: "35min" },
          { type: "video", title: "Fine-tuning com LoRA na Prática", author: "Sandeco", url: "https://www.youtube.com/watch?v=YBHgYX1Xtm0", lang: "pt", duration: "1h" },
          { type: "docs", title: "PEFT Documentation", url: "https://huggingface.co/docs/peft", lang: "en" },
          { type: "article", title: "QLoRA: Efficient Finetuning", url: "https://arxiv.org/abs/2305.14314", lang: "en" },
          { type: "tutorial", title: "Axolotl Fine-tuning Guide", url: "https://github.com/OpenAccess-AI-Collective/axolotl", lang: "en" },
        ],
      },
      {
        title: "Agentes com Tool Use",
        description: "Construir agentes que usam ferramentas externas",
        difficulty: "medium",
        resources: [
          { type: "video", title: "Building AI Agents", author: "Anthropic", url: "https://www.youtube.com/watch?v=F_kd4w0gFVo", lang: "en", duration: "40min" },
          { type: "video", title: "Criando Agentes de IA", author: "Lucas Montano", url: "https://www.youtube.com/watch?v=HiTvQg2Gjr4", lang: "pt", duration: "30min" },
          { type: "docs", title: "Claude Tool Use Guide", url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use", lang: "en" },
          { type: "docs", title: "OpenAI Function Calling", url: "https://platform.openai.com/docs/guides/function-calling", lang: "en" },
          { type: "tutorial", title: "LangGraph Agents Tutorial", url: "https://langchain-ai.github.io/langgraph/tutorials/", lang: "en" },
        ],
      },
      {
        title: "Embeddings e Busca Vetorial",
        description: "Entender embeddings e implementar busca semântica",
        difficulty: "medium",
        resources: [
          { type: "video", title: "Word Embeddings Explained", author: "3Blue1Brown", url: "https://www.youtube.com/watch?v=wjZofJX0v4M", lang: "en", duration: "20min" },
          { type: "video", title: "Embeddings na Prática", author: "Filipe Deschamps", url: "https://www.youtube.com/watch?v=pfYxKbkd8rU", lang: "pt", duration: "25min" },
          { type: "docs", title: "OpenAI Embeddings Guide", url: "https://platform.openai.com/docs/guides/embeddings", lang: "en" },
          { type: "article", title: "Pinecone Learning Center", url: "https://www.pinecone.io/learn/", lang: "en" },
          { type: "tutorial", title: "Qdrant Quickstart", url: "https://qdrant.tech/documentation/quick-start/", lang: "en" },
        ],
      },
      {
        title: "Prompt Engineering Avançado",
        description: "Técnicas avançadas: Chain-of-Thought, Few-shot, ReAct",
        difficulty: "medium",
        resources: [
          { type: "video", title: "Prompt Engineering Course", author: "DeepLearning.AI", url: "https://www.youtube.com/watch?v=_ZvnD96BbKc", lang: "en", duration: "1h" },
          { type: "video", title: "Prompt Engineering Completo", author: "Código Fonte TV", url: "https://www.youtube.com/watch?v=b9wH0XXeKc8", lang: "pt", duration: "40min" },
          { type: "docs", title: "Anthropic Prompt Engineering", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering", lang: "en" },
          { type: "article", title: "Prompt Engineering Guide", url: "https://www.promptingguide.ai/", lang: "en" },
          { type: "docs", title: "OpenAI Best Practices", url: "https://platform.openai.com/docs/guides/prompt-engineering", lang: "en" },
        ],
      },
      {
        title: "Observabilidade de LLMs",
        description: "Monitorar e debugar sistemas com LLMs em produção",
        difficulty: "medium",
        resources: [
          { type: "video", title: "LLM Observability with Langfuse", author: "Langfuse", url: "https://www.youtube.com/watch?v=2E8iTT-gLMA", lang: "en", duration: "30min" },
          { type: "video", title: "Monitorando LLMs em Produção", author: "AI Brasil", url: "https://www.youtube.com/watch?v=KQjAVL5YvXM", lang: "pt", duration: "45min" },
          { type: "docs", title: "Langfuse Documentation", url: "https://langfuse.com/docs", lang: "en" },
          { type: "docs", title: "LangSmith Guide", url: "https://docs.smith.langchain.com/", lang: "en" },
          { type: "tutorial", title: "Arize Phoenix Quickstart", url: "https://docs.arize.com/phoenix/", lang: "en" },
        ],
      },
    ],
  },
  web_modern: {
    name: "Web Moderna",
    icon: "🌐",
    color: "blue",
    topics: [
      {
        title: "React Server Components",
        description: "Server Components e streaming com Next.js 15",
        difficulty: "medium",
        resources: [
          { type: "video", title: "React Server Components Explained", author: "Theo", url: "https://www.youtube.com/watch?v=VIwWgV3Lc6s", lang: "en", duration: "25min" },
          { type: "video", title: "Server Components na Prática", author: "Rocketseat", url: "https://www.youtube.com/watch?v=G3PvTT8ESsA", lang: "pt", duration: "1h" },
          { type: "docs", title: "Next.js App Router", url: "https://nextjs.org/docs/app", lang: "en" },
          { type: "article", title: "Understanding RSC", author: "Josh Comeau", url: "https://www.joshwcomeau.com/react/server-components/", lang: "en" },
          { type: "video", title: "Next.js 15 Deep Dive", author: "Vercel", url: "https://www.youtube.com/watch?v=_w0Ikk4JY7U", lang: "en", duration: "45min" },
        ],
      },
      {
        title: "Edge Runtime & Serverless",
        description: "Deploy de funções no edge com Cloudflare e Vercel",
        difficulty: "medium",
        resources: [
          { type: "video", title: "Cloudflare Workers Tutorial", author: "Cloudflare", url: "https://www.youtube.com/watch?v=H7Qe96fqg1M", lang: "en", duration: "30min" },
          { type: "video", title: "Deploy Serverless com Vercel", author: "Rocketseat", url: "https://www.youtube.com/watch?v=Cz55Jmhfw84", lang: "pt", duration: "20min" },
          { type: "docs", title: "Vercel Edge Functions", url: "https://vercel.com/docs/functions/edge-functions", lang: "en" },
          { type: "docs", title: "Cloudflare Workers Docs", url: "https://developers.cloudflare.com/workers/", lang: "en" },
          { type: "tutorial", title: "Deno Deploy Guide", url: "https://deno.com/deploy/docs", lang: "en" },
        ],
      },
      {
        title: "Astro e Islands Architecture",
        description: "Frameworks com partial hydration e zero JS por padrão",
        difficulty: "easy",
        resources: [
          { type: "video", title: "Astro Crash Course", author: "Fireship", url: "https://www.youtube.com/watch?v=dsTXcSeAZq8", lang: "en", duration: "12min" },
          { type: "video", title: "Astro: O Framework Perfeito?", author: "Código Fonte TV", url: "https://www.youtube.com/watch?v=S05Fc93FUDw", lang: "pt", duration: "15min" },
          { type: "docs", title: "Astro Documentation", url: "https://docs.astro.build/", lang: "en" },
          { type: "article", title: "Islands Architecture", author: "Jason Miller", url: "https://jasonformat.com/islands-architecture/", lang: "en" },
          { type: "tutorial", title: "Build with Astro", url: "https://docs.astro.build/en/tutorial/0-introduction/", lang: "en" },
        ],
      },
      {
        title: "tRPC e Type-safe APIs",
        description: "APIs end-to-end type-safe sem codegen",
        difficulty: "medium",
        resources: [
          { type: "video", title: "tRPC in 100 Seconds", author: "Fireship", url: "https://www.youtube.com/watch?v=2LYM8gf184U", lang: "en", duration: "3min" },
          { type: "video", title: "tRPC Completo", author: "Rocketseat", url: "https://www.youtube.com/watch?v=Lam0cYOEst8", lang: "pt", duration: "1h 30min" },
          { type: "docs", title: "tRPC Documentation", url: "https://trpc.io/docs", lang: "en" },
          { type: "docs", title: "Drizzle ORM Guide", url: "https://orm.drizzle.team/docs/overview", lang: "en" },
          { type: "video", title: "T3 Stack Tutorial", author: "Theo", url: "https://www.youtube.com/watch?v=PbjHxIuHduU", lang: "en", duration: "2h" },
        ],
      },
      {
        title: "Tailwind CSS v4",
        description: "Novidades do Tailwind v4 e CSS moderno",
        difficulty: "easy",
        resources: [
          { type: "video", title: "Tailwind CSS v4 Overview", author: "Tailwind Labs", url: "https://www.youtube.com/watch?v=ifYhVyiMGc4", lang: "en", duration: "15min" },
          { type: "video", title: "Tailwind CSS na Prática", author: "Rocketseat", url: "https://www.youtube.com/watch?v=1eLaBow7Zbo", lang: "pt", duration: "45min" },
          { type: "docs", title: "Tailwind CSS Docs", url: "https://tailwindcss.com/docs", lang: "en" },
          { type: "article", title: "What's New in v4", url: "https://tailwindcss.com/blog/tailwindcss-v4", lang: "en" },
          { type: "tutorial", title: "Tailwind UI Examples", url: "https://tailwindui.com/components", lang: "en" },
        ],
      },
      {
        title: "TypeScript Avançado",
        description: "Tipos condicionais, mapped types e template literals",
        difficulty: "hard",
        resources: [
          { type: "video", title: "Advanced TypeScript", author: "Matt Pocock", url: "https://www.youtube.com/watch?v=F3DIyR3xLnk", lang: "en", duration: "30min" },
          { type: "video", title: "TypeScript Avançado", author: "Rocketseat", url: "https://www.youtube.com/watch?v=0mYq5LrQN1s", lang: "pt", duration: "1h" },
          { type: "docs", title: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/", lang: "en" },
          { type: "tutorial", title: "Type Challenges", url: "https://github.com/type-challenges/type-challenges", lang: "en" },
          { type: "course", title: "Total TypeScript", author: "Matt Pocock", url: "https://www.totaltypescript.com/", lang: "en" },
        ],
      },
    ],
  },
  devops_cloud: {
    name: "DevOps & Cloud",
    icon: "☁️",
    color: "green",
    topics: [
      {
        title: "Docker e Containers",
        description: "Containerização de aplicações e Docker Compose",
        difficulty: "medium",
        resources: [
          { type: "video", title: "Docker Tutorial for Beginners", author: "TechWorld with Nana", url: "https://www.youtube.com/watch?v=3c-iBn73dDE", lang: "en", duration: "2h 45min" },
          { type: "video", title: "Docker do Zero", author: "Fabricio Veronez", url: "https://www.youtube.com/watch?v=ntbpIfS44Gw", lang: "pt", duration: "1h 30min" },
          { type: "docs", title: "Docker Documentation", url: "https://docs.docker.com/get-started/", lang: "en" },
          { type: "article", title: "Docker Best Practices", url: "https://docs.docker.com/develop/develop-images/dockerfile_best-practices/", lang: "en" },
          { type: "tutorial", title: "Play with Docker", url: "https://labs.play-with-docker.com/", lang: "en" },
        ],
      },
      {
        title: "Kubernetes Essencial",
        description: "Orquestração de containers com K8s",
        difficulty: "hard",
        resources: [
          { type: "video", title: "Kubernetes Course", author: "TechWorld with Nana", url: "https://www.youtube.com/watch?v=X48VuDVv0do", lang: "en", duration: "3h 30min" },
          { type: "video", title: "Kubernetes para Iniciantes", author: "LINUXtips", url: "https://www.youtube.com/watch?v=pV0nkBtW9GI", lang: "pt", duration: "2h" },
          { type: "docs", title: "Kubernetes Documentation", url: "https://kubernetes.io/docs/home/", lang: "en" },
          { type: "tutorial", title: "Kubernetes Basics", url: "https://kubernetes.io/docs/tutorials/kubernetes-basics/", lang: "en" },
          { type: "course", title: "K8s The Hard Way", url: "https://github.com/kelseyhightower/kubernetes-the-hard-way", lang: "en" },
        ],
      },
      {
        title: "Terraform e IaC",
        description: "Infraestrutura como código com Terraform",
        difficulty: "medium",
        resources: [
          { type: "video", title: "Terraform Course", author: "freeCodeCamp", url: "https://www.youtube.com/watch?v=SLB_c_ayRMo", lang: "en", duration: "2h 20min" },
          { type: "video", title: "Terraform na Prática", author: "LINUXtips", url: "https://www.youtube.com/watch?v=bIPF_hzmQGE", lang: "pt", duration: "1h" },
          { type: "docs", title: "Terraform Documentation", url: "https://developer.hashicorp.com/terraform/docs", lang: "en" },
          { type: "tutorial", title: "Terraform AWS Tutorial", url: "https://developer.hashicorp.com/terraform/tutorials/aws-get-started", lang: "en" },
          { type: "article", title: "Terraform Best Practices", url: "https://www.terraform-best-practices.com/", lang: "en" },
        ],
      },
      {
        title: "GitHub Actions CI/CD",
        description: "Automação de pipelines com GitHub Actions",
        difficulty: "easy",
        resources: [
          { type: "video", title: "GitHub Actions Tutorial", author: "Fireship", url: "https://www.youtube.com/watch?v=eB0nUzAI7M8", lang: "en", duration: "12min" },
          { type: "video", title: "CI/CD com GitHub Actions", author: "Rocketseat", url: "https://www.youtube.com/watch?v=X3F3El_yvFg", lang: "pt", duration: "30min" },
          { type: "docs", title: "GitHub Actions Docs", url: "https://docs.github.com/en/actions", lang: "en" },
          { type: "tutorial", title: "Actions Quickstart", url: "https://docs.github.com/en/actions/quickstart", lang: "en" },
          { type: "article", title: "Actions Marketplace", url: "https://github.com/marketplace?type=actions", lang: "en" },
        ],
      },
      {
        title: "AWS para Desenvolvedores",
        description: "Serviços essenciais: Lambda, S3, DynamoDB, API Gateway",
        difficulty: "medium",
        resources: [
          { type: "video", title: "AWS Certified Developer Course", author: "freeCodeCamp", url: "https://www.youtube.com/watch?v=RrKRN9zRBWs", lang: "en", duration: "12h" },
          { type: "video", title: "AWS do Zero", author: "Fabricio Veronez", url: "https://www.youtube.com/watch?v=j6yImUbs4OA", lang: "pt", duration: "2h" },
          { type: "docs", title: "AWS Documentation", url: "https://docs.aws.amazon.com/", lang: "en" },
          { type: "tutorial", title: "AWS Getting Started", url: "https://aws.amazon.com/getting-started/", lang: "en" },
          { type: "course", title: "AWS Skill Builder", url: "https://skillbuilder.aws/", lang: "en" },
        ],
      },
      {
        title: "Observabilidade com Grafana",
        description: "Métricas, logs e traces com Grafana Stack",
        difficulty: "medium",
        resources: [
          { type: "video", title: "Grafana Tutorial", author: "TechWorld with Nana", url: "https://www.youtube.com/watch?v=9TJx7QTrTyo", lang: "en", duration: "45min" },
          { type: "video", title: "Observabilidade na Prática", author: "Full Cycle", url: "https://www.youtube.com/watch?v=LzJ5ytqK2e0", lang: "pt", duration: "1h" },
          { type: "docs", title: "Grafana Documentation", url: "https://grafana.com/docs/grafana/latest/", lang: "en" },
          { type: "docs", title: "Prometheus Guide", url: "https://prometheus.io/docs/introduction/overview/", lang: "en" },
          { type: "tutorial", title: "OpenTelemetry Getting Started", url: "https://opentelemetry.io/docs/getting-started/", lang: "en" },
        ],
      },
    ],
  },
  backend: {
    name: "Backend & Databases",
    icon: "🔧",
    color: "orange",
    topics: [
      {
        title: "PostgreSQL Avançado",
        description: "CTEs, Window Functions, JSONB e otimização",
        difficulty: "hard",
        resources: [
          { type: "video", title: "PostgreSQL Tutorial", author: "freeCodeCamp", url: "https://www.youtube.com/watch?v=qw--VYLpxG4", lang: "en", duration: "4h" },
          { type: "video", title: "PostgreSQL Completo", author: "Bóson Treinamentos", url: "https://www.youtube.com/watch?v=grJlZB7yeKY", lang: "pt", duration: "2h" },
          { type: "docs", title: "PostgreSQL Documentation", url: "https://www.postgresql.org/docs/current/", lang: "en" },
          { type: "article", title: "Use The Index, Luke", url: "https://use-the-index-luke.com/", lang: "en" },
          { type: "tutorial", title: "PostgreSQL Exercises", url: "https://pgexercises.com/", lang: "en" },
        ],
      },
      {
        title: "Redis Além do Cache",
        description: "Pub/Sub, Streams, e estruturas de dados avançadas",
        difficulty: "medium",
        resources: [
          { type: "video", title: "Redis Crash Course", author: "Traversy Media", url: "https://www.youtube.com/watch?v=jgpVdJB2sKQ", lang: "en", duration: "40min" },
          { type: "video", title: "Redis na Prática", author: "Full Cycle", url: "https://www.youtube.com/watch?v=HMEwYxXFTjM", lang: "pt", duration: "1h" },
          { type: "docs", title: "Redis Documentation", url: "https://redis.io/docs/", lang: "en" },
          { type: "course", title: "Redis University", url: "https://university.redis.com/", lang: "en" },
          { type: "tutorial", title: "Try Redis", url: "https://try.redis.io/", lang: "en" },
        ],
      },
      {
        title: "Node.js Performance",
        description: "Event loop, clustering e otimização de performance",
        difficulty: "hard",
        resources: [
          { type: "video", title: "Node.js Performance", author: "Matteo Collina", url: "https://www.youtube.com/watch?v=sJfPNDMgQiI", lang: "en", duration: "45min" },
          { type: "video", title: "Performance no Node.js", author: "Erick Wendel", url: "https://www.youtube.com/watch?v=5LwM7gvpGDk", lang: "pt", duration: "1h" },
          { type: "docs", title: "Node.js Best Practices", url: "https://github.com/goldbergyoni/nodebestpractices", lang: "en" },
          { type: "article", title: "Event Loop Explained", url: "https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/", lang: "en" },
          { type: "tutorial", title: "Clinic.js Tutorial", url: "https://clinicjs.org/documentation/", lang: "en" },
        ],
      },
      {
        title: "API Design e REST",
        description: "Design de APIs RESTful, versionamento e documentação",
        difficulty: "medium",
        resources: [
          { type: "video", title: "REST API Design", author: "ByteByteGo", url: "https://www.youtube.com/watch?v=P0a7PwRNLVU", lang: "en", duration: "15min" },
          { type: "video", title: "API REST Completo", author: "Rocketseat", url: "https://www.youtube.com/watch?v=ghTrp1x_1As", lang: "pt", duration: "1h 30min" },
          { type: "article", title: "API Design Guide", url: "https://cloud.google.com/apis/design", lang: "en" },
          { type: "docs", title: "OpenAPI Specification", url: "https://swagger.io/specification/", lang: "en" },
          { type: "tutorial", title: "REST API Tutorial", url: "https://restfulapi.net/", lang: "en" },
        ],
      },
      {
        title: "Go para Backend",
        description: "Construir APIs performáticas em Go",
        difficulty: "medium",
        resources: [
          { type: "video", title: "Go Programming Course", author: "freeCodeCamp", url: "https://www.youtube.com/watch?v=un6ZyFkqFKo", lang: "en", duration: "6h" },
          { type: "video", title: "Go do Zero", author: "Full Cycle", url: "https://www.youtube.com/watch?v=WiGU_ZB-u0w", lang: "pt", duration: "2h" },
          { type: "docs", title: "Go Documentation", url: "https://go.dev/doc/", lang: "en" },
          { type: "tutorial", title: "Go by Example", url: "https://gobyexample.com/", lang: "en" },
          { type: "book", title: "Learn Go with Tests", url: "https://quii.gitbook.io/learn-go-with-tests/", lang: "en" },
        ],
      },
      {
        title: "Arquitetura de Microsserviços",
        description: "Patterns, comunicação e resiliência",
        difficulty: "hard",
        resources: [
          { type: "video", title: "Microservices Explained", author: "ByteByteGo", url: "https://www.youtube.com/watch?v=rv4LlmLmVWk", lang: "en", duration: "10min" },
          { type: "video", title: "Microsserviços na Prática", author: "Full Cycle", url: "https://www.youtube.com/watch?v=_Oyy5PFOIcU", lang: "pt", duration: "1h 30min" },
          { type: "article", title: "Microservices.io Patterns", url: "https://microservices.io/patterns/", lang: "en" },
          { type: "book", title: "Building Microservices", author: "Sam Newman", url: "https://www.oreilly.com/library/view/building-microservices-2nd/9781492034018/", lang: "en" },
          { type: "docs", title: "12 Factor App", url: "https://12factor.net/", lang: "en" },
        ],
      },
    ],
  },
};

/**
 * Gera sugestões de tópicos baseado na semana atual.
 * Usa um seed baseado na semana para garantir consistência.
 */
function generateWeeklySuggestions(weekSeed) {
  const categories = Object.entries(HOT_TOPICS_DATABASE);
  const suggestions = [];

  // Selecionar 1-2 tópicos de cada categoria usando o seed
  categories.forEach(([catKey, category], catIndex) => {
    const shuffled = [...category.topics].sort((a, b) => {
      const seedA = (weekSeed + catIndex + category.topics.indexOf(a)) % 100;
      const seedB = (weekSeed + catIndex + category.topics.indexOf(b)) % 100;
      return seedA - seedB;
    });

    // Pegar 1 ou 2 tópicos dependendo da categoria
    const count = (weekSeed + catIndex) % 2 === 0 ? 2 : 1;
    shuffled.slice(0, count).forEach((topic) => {
      suggestions.push({
        ...topic,
        category: category.name,
        categoryKey: catKey,
        icon: category.icon,
        color: category.color,
      });
    });
  });

  return suggestions.slice(0, 6); // Máximo 6 sugestões por semana
}

/**
 * Calcula o número da semana desde uma data base.
 */
function getWeekNumber() {
  const baseDate = new Date("2024-01-01").getTime();
  const now = Date.now();
  return Math.floor((now - baseDate) / WEEK_IN_MS);
}

/**
 * Componente de sugestões de IA para tópicos de estudo.
 * Atualiza automaticamente a cada semana com novos tópicos.
 */
export default function AISuggestions({ onAddToPlan }) {
  const [suggestions, setSuggestions] = useState([]);
  const [savedSuggestions, setSavedSuggestions] = useState(() =>
    loadFromStorage(AI_SUGGESTIONS_KEY, { weekNumber: 0, topics: [], saved: [] })
  );
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  const currentWeek = getWeekNumber();

  useEffect(() => {
    // Verificar se precisa gerar novas sugestões (nova semana)
    if (savedSuggestions.weekNumber !== currentWeek) {
      const newSuggestions = generateWeeklySuggestions(currentWeek);
      const newData = {
        weekNumber: currentWeek,
        topics: newSuggestions,
        saved: savedSuggestions.saved || [],
        generatedAt: new Date().toISOString(),
      };
      setSavedSuggestions(newData);
      saveToStorage(AI_SUGGESTIONS_KEY, newData);
      setSuggestions(newSuggestions);
    } else {
      setSuggestions(savedSuggestions.topics);
    }
  }, [currentWeek, savedSuggestions.weekNumber]);

  const handleRefresh = () => {
    setRefreshing(true);
    // Simular um refresh com novo seed
    const newSeed = currentWeek + Math.floor(Math.random() * 100);
    const newSuggestions = generateWeeklySuggestions(newSeed);

    setTimeout(() => {
      const newData = {
        ...savedSuggestions,
        topics: newSuggestions,
        generatedAt: new Date().toISOString(),
      };
      setSavedSuggestions(newData);
      saveToStorage(AI_SUGGESTIONS_KEY, newData);
      setSuggestions(newSuggestions);
      setRefreshing(false);
    }, 500);
  };

  const handleSaveTopic = (topic) => {
    const newSaved = [...(savedSuggestions.saved || []), {
      ...topic,
      savedAt: new Date().toISOString(),
    }];
    const newData = { ...savedSuggestions, saved: newSaved };
    setSavedSuggestions(newData);
    saveToStorage(AI_SUGGESTIONS_KEY, newData);
  };

  const handleRemoveSaved = (topicTitle) => {
    const newSaved = savedSuggestions.saved.filter(t => t.title !== topicTitle);
    const newData = { ...savedSuggestions, saved: newSaved };
    setSavedSuggestions(newData);
    saveToStorage(AI_SUGGESTIONS_KEY, newData);
  };

  const isTopicSaved = (title) => {
    return savedSuggestions.saved?.some(t => t.title === title);
  };

  const filteredSuggestions = selectedCategory === "all"
    ? suggestions
    : suggestions.filter(s => s.categoryKey === selectedCategory);

  const categories = [
    { key: "all", name: "Todos", icon: "📚" },
    ...Object.entries(HOT_TOPICS_DATABASE).map(([key, cat]) => ({
      key,
      name: cat.name,
      icon: cat.icon,
    })),
  ];

  const getDifficultyBadge = (difficulty) => {
    return DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.medium;
  };

  const daysUntilRefresh = () => {
    const baseDate = new Date("2024-01-01").getTime();
    const nextWeekStart = baseDate + (currentWeek + 1) * WEEK_IN_MS;
    const daysLeft = Math.ceil((nextWeekStart - Date.now()) / (24 * 60 * 60 * 1000));
    return daysLeft;
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-xl shadow-lg">
              🤖
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                Sugestões da IA
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Tópicos quentes de desenvolvimento atualizados semanalmente
              </p>
            </div>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            className={cn(
              "px-3 py-2 rounded-lg flex items-center gap-2",
              COMMON_STYLES.button.secondary
            )}
          >
            <span className={refreshing ? "animate-spin" : ""}>🔄</span>
            {refreshing ? "Gerando..." : "Novas Sugestões"}
          </Button>
        </div>

        {/* Countdown */}
        <div className={cn(GRADIENTS.primary, "text-white rounded-xl p-4 flex items-center justify-between shadow-lg")}>
          <div>
            <p className="text-sm opacity-80">Próxima atualização automática em</p>
            <p className="text-2xl font-bold">{daysUntilRefresh()} dia(s)</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-80">Semana</p>
            <p className="text-2xl font-bold">#{currentWeek}</p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
              selectedCategory === cat.key
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            )}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Suggestions Grid */}
      <div className="grid gap-4 md:grid-cols-2 mb-8">
        {filteredSuggestions.map((topic, i) => {
          const colorConfig = CATEGORY_COLORS[topic.color];
          const diffBadge = getDifficultyBadge(topic.difficulty);
          const isSaved = isTopicSaved(topic.title);

          return (
            <Card
              key={i}
              className={cn(
                "overflow-hidden border transition-all hover:shadow-lg",
                colorConfig.border
              )}
            >
              <div className={cn(colorConfig.header, "text-white px-4 py-3")}>
                <div className="flex items-center justify-between">
                  <span className="text-lg">{topic.icon}</span>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full", diffBadge.className)}>
                    {diffBadge.label}
                  </span>
                </div>
                <h3 className="font-bold mt-2">{topic.title}</h3>
                <p className="text-sm opacity-80 mt-1">{topic.description}</p>
              </div>

              <div className={cn("p-4", colorConfig.bg)}>
                <div className="mb-4">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                    Recursos recomendados:
                  </p>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto">
                    {topic.resources.slice(0, 4).map((resource, ri) => {
                      const resourceType = RESOURCE_TYPE_CONFIG[resource.type] || RESOURCE_TYPE_CONFIG.article;
                      const langFlag = resource.lang === "pt" ? "🇧🇷" : resource.lang === "en" ? "🇺🇸" : "";
                      return (
                        <a
                          key={ri}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            "flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-all",
                            "bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700",
                            "border border-slate-200/50 dark:border-slate-700/50",
                            "hover:shadow-sm"
                          )}
                        >
                          <span>{resourceType.icon}</span>
                          <span className="flex-1 truncate text-slate-700 dark:text-slate-200">
                            {resource.title}
                          </span>
                          {langFlag && <span className="text-[10px]">{langFlag}</span>}
                          {resource.duration && (
                            <span className="text-[10px] text-slate-400">{resource.duration}</span>
                          )}
                        </a>
                      );
                    })}
                    {topic.resources.length > 4 && (
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center pt-1">
                        +{topic.resources.length - 4} mais recursos
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => isSaved ? handleRemoveSaved(topic.title) : handleSaveTopic(topic)}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                      isSaved
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                    )}
                  >
                    {isSaved ? "✓ Salvo" : "💾 Salvar"}
                  </Button>
                  <Button
                    onClick={() => onAddToPlan?.(topic)}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-sm font-medium",
                      COMMON_STYLES.button.primary
                    )}
                  >
                    ➕ Adicionar ao Plano
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Saved Topics */}
      {savedSuggestions.saved?.length > 0 && (
        <div className="mt-8">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <span>💾</span> Tópicos Salvos ({savedSuggestions.saved.length})
          </h3>
          <div className="space-y-2">
            {savedSuggestions.saved.map((topic, i) => {
              const colorConfig = CATEGORY_COLORS[topic.color];
              return (
                <div
                  key={i}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-xl border",
                    colorConfig.bg,
                    colorConfig.border
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span>{topic.icon}</span>
                    <div>
                      <p className={cn("font-medium text-sm", colorConfig.text)}>
                        {topic.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {topic.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => onAddToPlan?.(topic)}
                      className={cn("px-3 py-1.5 text-xs rounded-lg", COMMON_STYLES.button.primary)}
                    >
                      ➕ Usar
                    </Button>
                    <button
                      onClick={() => handleRemoveSaved(topic.title)}
                      className="px-2 py-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Info Footer */}
      <div className="mt-8 p-5 bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
        <h4 className="font-medium text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
          <span>💡</span> Como funciona?
        </h4>
        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1.5">
          <li className="flex items-start gap-2"><span className="text-indigo-500">•</span> A cada semana, novos tópicos são sugeridos automaticamente</li>
          <li className="flex items-start gap-2"><span className="text-violet-500">•</span> Os tópicos são selecionados de áreas quentes do desenvolvimento</li>
          <li className="flex items-start gap-2"><span className="text-emerald-500">•</span> Salve tópicos interessantes para estudar depois</li>
          <li className="flex items-start gap-2"><span className="text-amber-500">•</span> Adicione tópicos diretamente ao seu plano de estudos</li>
          <li className="flex items-start gap-2"><span className="text-rose-500">•</span> Clique nos recursos para acessar vídeos e artigos</li>
        </ul>
      </div>
    </div>
  );
}
