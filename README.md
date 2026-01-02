# Sara AI 2.0 - Agente de Vendas Inteligente | Ronald Digital

**Sistema de conversação com IA state-of-the-art** para captação, qualificação e vendas de sites, com respostas **100% naturais e humanizadas**.

## 🚀 O que é a Sara AI v2?

Sara é uma assistente de vendas inteligente que conversa de forma **natural e empática**, como uma pessoa real por WhatsApp. Ela utiliza as melhores IAs do mercado e metodologias de vendas consultivas (SPIN, BANT, Value-First) para qualificar leads e fechar vendas 24/7.

### ✨ Diferenciais

- **Conversação Natural**: Respostas humanizadas, nada de robô corporativo
- **Multi-Model AI**: Claude 3.5 Sonnet, Gemini 1.5 Flash, GPT-4o com fallback automático
- **Metodologias de Vendas**: SPIN Selling, BANT, Value-First aplicadas de forma adaptativa
- **Qualificação Inteligente**: Lead scoring automático baseado em Budget, Authority, Need, Timeline
- **Contexto Dinâmico**: Lembra de toda a conversa e adapta respostas ao estágio do cliente

## 📋 Serviços Oferecidos

- **Landing Pages**: R$ 500-1.000 (Foco em alta conversão e captação de leads)
- **Portfólios**: R$ 400-800 (Foco em credibilidade e apresentação profissional)
- **Sites/Blogs**: R$ 800-2.000 (Foco em autoridade, SEO e conteúdo)

## 🧠 Tecnologias

### Backend - Sara AI v2
- **LangChain**: Framework para orquestração de agentes de IA
- **Claude 3.5 Sonnet (Anthropic)** 🥇: Modelo PRINCIPAL - Melhor em conversação natural e humanização
- **Gemini 1.5 Flash (Google)** 🥈: Modelo SECUNDÁRIO - Rápido e econômico para análise de intenção
- **GPT-4o (OpenAI)** 🥉: Fallback de alta performance
- **Vercel Serverless Functions**: Backend escalável com proxy para APIs de IA (evita CORS)

### Frontend
- **React + Vite**: Interface moderna e performática
- **TypeScript**: Tipagem estática para código mais seguro
- **Tailwind CSS**: Estilização responsiva e customizável

---

## 📦 Instalação

### 1. Clone o repositório e instale as dependências

```bash
git clone <seu-repo>
cd ronald-digital
npm install
```

### 2. Configure as variáveis de ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas chaves de API:

```env
# 🥇 PRIORIDADE 1: Claude 3.5 Sonnet (RECOMENDADO)
ANTHROPIC_API_KEY=sk-ant-api03-sua_chave_aqui

# 🥈 PRIORIDADE 2: Gemini 1.5 Flash (Rápido e Econômico)
GOOGLE_API_KEY=sua_chave_google
VITE_GEMINI_API_KEY=sua_chave_google

# 🥉 PRIORIDADE 3: GPT-4o (Fallback de Alta Performance)
OPENAI_API_KEY=sk-sua_chave_openai

# ⚙️ Configurações do Negócio
BUSINESS_EMAIL=ronald.digital27@gmail.com
BUSINESS_PHONE=5585991575525
BUSINESS_NAME=Ronald Digital

# 💰 Faixas de Preço dos Serviços
LANDING_PAGE_MIN=500
LANDING_PAGE_MAX=1000
PORTFOLIO_MIN=400
PORTFOLIO_MAX=800
WEBSITE_MIN=800
WEBSITE_MAX=2000

# 🚀 Feature Flags
SARA_V2=true
```

### 3. Rode o ambiente de desenvolvimento

**IMPORTANTE**: Use `npm run dev:full` para rodar **frontend + backend** juntos:

```bash
npm run dev:full
```

Isso iniciará:
- ✅ Frontend (Vite) em `http://localhost:3000`
- ✅ Backend (Vercel Functions) em `http://localhost:3000/api/*`

> **Nota**: `npm run dev` roda apenas o frontend. Para que a Sara AI funcione, você PRECISA do backend rodando!

---

## 🔑 Obtendo suas API Keys

### 1. Claude 3.5 Sonnet - Anthropic (RECOMENDADO 🥇)

A melhor opção para conversação natural e humanizada.

1. Acesse: https://console.anthropic.com/
2. Crie sua conta e obtenha a API Key
3. Adicione em `ANTHROPIC_API_KEY` no `.env`

**Custo**: ~$0.003 por conversa (3 mensagens)
**Vantagens**: Respostas mais naturais, empáticas e contextuais

### 2. Gemini 1.5 Flash - Google (RÁPIDO 🥈)

Excelente para velocidade e custo-benefício.

1. Acesse: https://ai.google.dev/
2. Obtenha sua API Key (Google AI Studio)
3. Adicione em `GOOGLE_API_KEY` e `VITE_GEMINI_API_KEY` no `.env`

**Custo**: ~$0.0001 por conversa (quase grátis)
**Vantagens**: Ultra rápido, bom para análise de intenção

### 3. GPT-4o - OpenAI (FALLBACK 🥉)

Alta performance quando outros modelos estão indisponíveis.

1. Acesse: https://platform.openai.com/
2. Crie sua conta e obtenha a API Key
3. Adicione em `OPENAI_API_KEY` no `.env`

**Custo**: ~$0.002 por conversa
**Vantagens**: Confiável, boa performance geral

> **Recomendação**: Configure pelo menos **Claude + Gemini** para melhor experiência.

---

## 🎯 Como Funciona

### Arquitetura da Sara AI v2

```
┌─────────────┐       ┌──────────────┐       ┌─────────────────┐
│   Frontend  │──────▶│   Backend    │──────▶│   Claude 3.5    │
│  (Vite/React)│       │  (Vercel API)│       │     Sonnet      │
└─────────────┘       └──────────────┘       └─────────────────┘
                             │                       │
                             │                  (fallback)
                             │                       ▼
                             │                ┌─────────────────┐
                             │                │  Gemini Flash   │
                             │                └─────────────────┘
                             │                       │
                             │                  (fallback)
                             │                       ▼
                             │                ┌─────────────────┐
                             │                │     GPT-4o      │
                             ▼                └─────────────────┘
                      ┌──────────────┐
                      │ Sara AI v2   │
                      │ (LangChain)  │
                      └──────────────┘
                             │
                    ┌────────┴────────┐
                    ▼                 ▼
             ┌─────────────┐   ┌─────────────┐
             │ Master      │   │ Knowledge   │
             │ Prompt      │   │ Base        │
             └─────────────┘   └─────────────┘
```

### Fluxo de Conversação

1. **Usuário envia mensagem** → Frontend (`ChatWidget.tsx`)
2. **Frontend chama backend** → `POST /api/agente`
3. **Backend analisa intenção** → Regras + LLM (se necessário)
4. **Constrói contexto dinâmico** → Lead score, histórico, metodologia
5. **Invoca Claude 3.5 Sonnet** → Com prompt humanizado e few-shot examples
6. **Extrai resposta JSON** → `{ resposta, dados_extraidos, lead_score, proxima_acao }`
7. **Retorna ao frontend** → Exibe resposta natural da Sara

### Exemplo de Conversa Real

```
👤 Usuário: "oi"

🤖 Sara: "Oi! Que bom te ver por aqui! 😊
         Sou a Sara, ajudo pessoas a transformarem seus negócios na internet.
         Como posso te ajudar hoje?"

👤 Usuário: "preciso de um site para um salão de beleza"

🤖 Sara: "Que legal! Um site para salão de beleza pode fazer muita diferença! 💇‍♀️

         Me conta: você quer um site mais simples para mostrar seus serviços
         e horários, ou algo mais completo com agendamento online?

         E já pensou em algum orçamento?"

👤 Usuário: "queria algo completo, com agendamento. tenho uns 1500 pra investir"

🤖 Sara: "Perfeito! Com R$ 1.500 dá pra fazer um site bem profissional! 🚀

         Vou te passar uma proposta personalizada. Pode me mandar seu
         WhatsApp ou email pra eu enviar os detalhes?"
```

### Metodologias de Vendas Adaptativas

A Sara AI v2 aplica metodologias de vendas de forma inteligente:

#### 1. **SPIN Selling** (Neil Rackham) - Descoberta
- **Situação**: "Me conta: que tipo de negócio você tem?"
- **Problema**: "Você já tem site? Como está captando clientes hoje?"
- **Implicação**: "Sem um site profissional, muitos clientes podem estar escolhendo seus concorrentes..."
- **Necessidade**: "Um site bem feito pode triplicar suas vendas online. Que tal conversarmos?"

#### 2. **BANT** (Jill Konrath) - Qualificação
- **Budget**: Identifica orçamento disponível
- **Authority**: Confirma que é o decisor
- **Need**: Valida a necessidade real
- **Timeline**: Define prazo de implementação

**Lead Score**:
- 0-1: Lead Frio (Nutrir com conteúdo)
- 2: Lead Morno (Qualificar mais)
- 3-4: Lead Quente (Fechar venda / Agendar call)

#### 3. **Value-First** (Gary Vaynerchuk) - Vendas
- Oferece valor antes de pedir algo
- Compartilha dicas, exemplos, cases de sucesso
- Constrói relacionamento genuíno
- Fecha venda de forma natural, sem pressão

---

## 🔧 Integração no Seu Site

### Usando o Widget de Chat

```jsx
import ChatWidget from './components/chat/ChatWidget';

function App() {
  return (
    <div>
      {/* Seu conteúdo */}

      {/* Widget da Sara AI */}
      <ChatWidget />
    </div>
  );
}
```

### Chamando a API Diretamente

```javascript
const response = await fetch('/api/agente', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    mensagem: "Olá, preciso de um site",
    nome: "João Silva",
    email: "joao@exemplo.com",
    historico: [] // Array de mensagens anteriores
  })
});

const resultado = await response.json();

console.log(resultado);
// {
//   success: true,
//   response: "Oi João! Que bom te ver por aqui! 😊...",
//   leadScore: 2,
//   nextAction: "qualificar",
//   methodology: "spin",
//   extractedData: { nome: "João Silva", email: "joao@exemplo.com" }
// }
```

---

## 📊 Estrutura de Resposta da API

```typescript
{
  success: boolean,
  response: string,              // Resposta humanizada da Sara
  leadScore: number,             // 0-4 (BANT Score)
  nextAction: string,            // descobrir_necessidade | qualificar | fechar | nutrir
  methodology: string,           // spin | bant | value_first
  extractedData: {
    nome?: string,
    email?: string,
    telefone?: string,
    tipo_projeto?: string,
    orcamento?: number,
    prazo?: string,
    negocio?: string
  },
  conversationStage: string,     // initial | discovery | qualified_warm | qualified_hot
  modelUsed: string,             // claude | gemini | gpt4 | fallback
  cost: number,                  // Custo estimado da chamada
  data: {
    response: string,
    sentiment: string,           // positive | neutral | negative
    suggested_actions: string[]  // Ações sugeridas para o frontend
  }
}
```

---

## 🧪 Testando Localmente

### 1. Inicie o servidor de desenvolvimento

```bash
npm run dev:full
```

### 2. Acesse o site

Abra: http://localhost:3000

### 3. Teste o chat

Clique no ícone de chat no canto inferior direito e converse com a Sara!

### 4. Monitore os logs

Terminal mostrará:
```
✅ Claude 3.5 Sonnet inicializado (Prioridade 1)
✅ Gemini 1.5 Flash inicializado (Prioridade 2)
🎯 Modelos disponíveis: claude, gemini
🏆 Modelo principal: claude

🔵 Nova mensagem: "oi"
🎯 Intenção: greeting | Metodologia: spin | Confiança: 95%
📊 Estágio: initial | Lead Score: 0/4 ❄️
🔄 Tentando com claude...
✅ Resposta obtida com claude (custo estimado: $0.0024)
```

---

## 🚀 Deploy no Vercel

### 1. Conecte seu repositório

```bash
# Instale a Vercel CLI
npm i -g vercel

# Faça login
vercel login

# Deploy
vercel --prod
```

### 2. Configure as variáveis de ambiente

No painel do Vercel:
1. Acesse **Settings** → **Environment Variables**
2. Adicione todas as variáveis do `.env`:
   - `ANTHROPIC_API_KEY`
   - `GOOGLE_API_KEY`
   - `VITE_GEMINI_API_KEY`
   - `OPENAI_API_KEY`
   - `BUSINESS_EMAIL`
   - `BUSINESS_PHONE`
   - etc.

### 3. Teste em produção

Acesse: `https://seu-site.vercel.app`

---

## 💡 Personalizando a Sara

### 1. Modificar Prompts

Edite [lib/prompts/master-prompt.js](lib/prompts/master-prompt.js):

```javascript
// Altere o tom de voz
const REGRA_DE_OURO = `
  Você é a Sara, mas mais DESCONTRAÍDA e INFORMAL.
  Fale como uma amiga próxima, use gírias e seja bem à vontade!
`;

// Adicione seus próprios exemplos (few-shot learning)
const fewShotExamples = [
  {
    user: "quanto custa?",
    assistant: "Opa! Os valores variam de R$ 500 até R$ 2.000..."
  }
];
```

### 2. Ajustar Preços

Edite `.env`:

```env
LANDING_PAGE_MIN=800
LANDING_PAGE_MAX=1500
WEBSITE_MIN=1200
WEBSITE_MAX=3000
```

### 3. Customizar Conhecimento

Edite [lib/utils/knowledge-base.js](lib/utils/knowledge-base.js):

```javascript
// Adicione FAQs personalizadas
const customFAQs = [
  {
    pergunta: "Fazem e-commerce?",
    resposta: "Sim! Fazemos lojas online completas com...",
    keywords: ["ecommerce", "loja", "vender online"]
  }
];
```

---

## 📈 Métricas e Analytics

A Sara AI v2 registra automaticamente:

- **Lead Score**: 0-4 (baseado em BANT)
- **Classificação**: Quente 🔥 / Morno 🌡️ / Frio ❄️
- **Estágio**: Initial → Discovery → Qualified → Closing
- **Metodologia Aplicada**: SPIN, BANT ou Value-First
- **Custo por Conversa**: Tracking de gastos com APIs
- **Taxa de Conversão**: Leads frios → quentes

Acesse os dados via `saraInstance.getPerformanceMetrics()`.

---

## 🔒 Segurança das API Keys

### ⚠️ IMPORTANTE: Proteção de Credenciais

Este projeto implementa **boas práticas de segurança** para proteger suas API keys:

### ✅ O que está PROTEGIDO

1. **API Keys no Backend APENAS**
   - Todas as chaves ficam em variáveis de ambiente do servidor
   - `.env` está no `.gitignore` (não é commitado no Git)
   - Frontend NUNCA acessa as chaves diretamente

2. **Arquitetura de Proxy Segura**
   ```
   Frontend → Backend (/api/agente) → Claude/Gemini/GPT
   ```
   - Frontend chama `/api/agente`
   - Backend faz proxy para as APIs de IA
   - Chaves ficam no servidor (Vercel)

3. **Sem Variáveis VITE_ para API Keys**
   - ❌ **NUNCA** use `VITE_ANTHROPIC_API_KEY`
   - ❌ **NUNCA** use `VITE_GOOGLE_API_KEY`
   - ✅ **SEMPRE** use `ANTHROPIC_API_KEY` (sem prefixo)
   - Variáveis com `VITE_` são expostas no navegador!

### 🚨 Checklist de Segurança

Antes de fazer deploy, verifique:

- [ ] Arquivo `.env` está no `.gitignore`
- [ ] Nenhuma chave foi commitada no Git
- [ ] Variáveis de API não usam prefixo `VITE_`
- [ ] Código do frontend não tem chaves hardcoded
- [ ] No Vercel, as variáveis estão configuradas em **Settings → Environment Variables**

### 🛡️ Como Verificar se está Seguro

1. **Abra DevTools (F12) no seu site**
2. **Vá em Network → Faça uma requisição**
3. **Procure por suas API keys**
   - Se você encontrar suas chaves → ❌ **VULNERÁVEL!**
   - Se não encontrar nada → ✅ **SEGURO!**

### 💡 Boas Práticas

1. **Use .env para desenvolvimento local**
   ```bash
   # .env (não commitar!)
   ANTHROPIC_API_KEY=sk-ant-api03-...
   GOOGLE_API_KEY=AIzaSy...
   ```

2. **Configure no Vercel para produção**
   - Settings → Environment Variables
   - Adicione as mesmas variáveis do `.env`
   - Clique em "Production" e "Preview"

3. **Rotacione chaves comprometidas imediatamente**
   - Se suas chaves foram expostas, **REVOGUE-AS** imediatamente
   - Crie novas chaves no console da API
   - Atualize no `.env` e no Vercel

### 🔐 Conformidade

- ✅ Não expõe credenciais no frontend
- ✅ Usa variáveis de ambiente
- ✅ Backend faz proxy seguro
- ✅ Logs não expõem chaves sensíveis
- ✅ Conformidade com OWASP Top 10

---

## ⚠️ Troubleshooting

### ❌ "Nenhum modelo de IA foi inicializado"

**Causa**: Nenhuma API key configurada.

**Solução**: Configure pelo menos `ANTHROPIC_API_KEY` ou `GOOGLE_API_KEY` no `.env`.

### ❌ "Connection refused" ou "404 Not Found"

**Causa**: Backend não está rodando.

**Solução**: Use `npm run dev:full` (não apenas `npm run dev`).

### ❌ "CORS policy blocked"

**Causa**: Tentando chamar API de IA direto do frontend.

**Solução**: Sempre chame `/api/agente`. O backend faz proxy para as APIs.

### ❌ "API key is invalid"

**Causa**: Chave de API incorreta ou expirada.

**Solução**:
1. Verifique se a chave está correta no `.env`
2. Confirme que a chave está ativa no console da API
3. Teste com outra chave (ex: trocar de projeto no console Anthropic)

### ❌ Respostas robóticas/corporativas

**Causa**: Prompts não estão humanizados.

**Solução**: Verifique se `lib/prompts/master-prompt.js` tem a seção "REGRA DE OURO" enfatizando conversação natural.

---

## 💰 Custos Estimados

### Por Conversa (5 mensagens)

| Modelo | Custo/Conversa | Observações |
|--------|----------------|-------------|
| **Claude 3.5 Sonnet** | ~$0.003 - $0.008 | Melhor qualidade |
| **Gemini 1.5 Flash** | ~$0.0001 - $0.0003 | Mais econômico |
| **GPT-4o** | ~$0.002 - $0.005 | Bom custo-benefício |

### Custo Mensal Estimado

- **100 conversas/mês**: R$ 5-15
- **500 conversas/mês**: R$ 25-75
- **1.000 conversas/mês**: R$ 50-150

> **Dica**: Use Gemini Flash para análise de intenção (rápido e barato) e Claude para respostas finais (qualidade máxima).

### Vercel (Gratuito)

- 100GB de largura de banda
- 100GB-hours de execução serverless
- Suficiente para ~10.000 conversas/mês

---

## 📚 Arquivos Importantes

- `api/agente.js` - Endpoint principal da API
- `lib/agents/saraAI-v2.js` - Classe principal da Sara AI
- `lib/agents/api-manager-v2.js` - Gerenciador de múltiplas APIs com fallback
- `lib/prompts/master-prompt.js` - Prompts humanizados e few-shot examples
- `lib/utils/knowledge-base.js` - Base de conhecimento (FAQs, serviços, etc)
- `lib/utils/context-builder.js` - Construtor de contexto dinâmico
- `src/components/chat/ChatWidget.tsx` - Widget de chat do frontend

---

## 🤝 Suporte

Dúvidas ou problemas?

- **Email**: ronald.digital27@gmail.com
- **WhatsApp**: +55 85 99157-5525

---

## 📄 Licença

Este projeto é privado e proprietário da Ronald Digital.

---

**Agora você tem um agente de IA de classe mundial rodando 24/7, com conversação natural e vendas consultivas! 🚀**
