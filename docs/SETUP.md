# Setup - Study Tracker

## Deploy no GitHub Pages

### 1. Configure o repositório

```bash
# Inicialize git se ainda não tiver
git init
git add .
git commit -m "Initial commit"

# Crie o repo no GitHub e conecte
git remote add origin https://github.com/SEU_USUARIO/study-tracker.git
git push -u origin main
```

### 2. Habilite GitHub Pages

1. Vá em **Settings** > **Pages**
2. Em **Source**, selecione **GitHub Actions**
3. O deploy será automático a cada push na main

### 3. Configure o base path (importante!)

Edite `vite.config.js` e adicione o base path:

```js
export default defineConfig({
  plugins: [react()],
  base: "/study-tracker/", // nome do seu repositório
});
```

---

## Banco de Dados (Supabase) - Opcional

### 1. Crie uma conta no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta gratuita
3. Crie um novo projeto

### 2. Execute o SQL de criação

No **SQL Editor** do Supabase, execute:

```sql
-- Tabela para armazenar dados dos usuários
CREATE TABLE user_data (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  data_key TEXT NOT NULL,
  data_value JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, data_key)
);

-- Índice para buscas rápidas
CREATE INDEX idx_user_data_user_id ON user_data(user_id);
CREATE INDEX idx_user_data_key ON user_data(data_key);

-- RLS (Row Level Security) - cada usuário só vê seus dados
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;

-- Política: usuários podem ver/editar apenas seus próprios dados
CREATE POLICY "Users can manage their own data"
  ON user_data
  FOR ALL
  USING (true)  -- Permitir para usuários anônimos (sem auth)
  WITH CHECK (true);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
CREATE TRIGGER update_user_data_updated_at
  BEFORE UPDATE ON user_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

### 3. Obtenha as credenciais

1. Vá em **Settings** > **API**
2. Copie:
   - **Project URL** (ex: `https://xxx.supabase.co`)
   - **anon public key** (começa com `eyJ...`)

### 4. Configure as variáveis de ambiente

**Para desenvolvimento local**, crie `.env.local`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Para GitHub Actions**, adicione os secrets:

1. Vá em **Settings** > **Secrets and variables** > **Actions**
2. Adicione:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

---

## Estrutura do Projeto

```
study-tracker/
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions
├── docs/
│   └── SETUP.md           # Este arquivo
├── src/
│   ├── components/        # Componentes React
│   ├── constants/         # Constantes (cores, configs)
│   ├── contexts/          # Contexts (tema)
│   ├── data/              # Dados gerados
│   ├── estudos/           # Scripts Python
│   ├── lib/               # Supabase, sync
│   └── utils/             # Utilitários
├── scripts/               # Scripts de automação
├── .env.local             # Variáveis locais (não commitado)
├── vite.config.js         # Configuração Vite
└── package.json
```

---

## Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Gerar módulos de estudo
npm run generate:modules

# Criar novo módulo
npm run new:module 2 prompt-engineering
```

---

## Tier Gratuito do Supabase

- **500 MB** de banco de dados
- **1 GB** de storage
- **2 GB** de bandwidth
- **50.000** requests/mês

Mais que suficiente para uso pessoal!
