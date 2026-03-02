# RonalDigital — Site + Sara AI

Site institucional com agente de IA integrado para captação e qualificação de leads.

**Domínio:** [ronaldigital.tech](https://www.ronaldigital.tech)
**Deploy:** Vercel
**Stack:** React + TypeScript + Vite + Tailwind CSS

---

## Serviços Oferecidos

| Serviço | Faixa de Preço |
|---|---|
| Landing Pages | R$ 500 – R$ 1.000 |
| Portfólios | R$ 400 – R$ 800 |
| Sites Institucionais | R$ 800 – R$ 2.000 |
| Agentes de IA | Sob consulta |

---

## Stack

### Frontend
- React 18 + TypeScript
- Vite 5 (build)
- Tailwind CSS + shadcn/ui
- React Router DOM v6
- React Helmet Async (SEO por página)

### Backend (Vercel Serverless)
- Node.js + Express
- LangChain (orquestração)
- **Claude 3 Haiku** (Anthropic) — modelo principal
- **Gemini 2.0 Flash** (Google) — fallback rápido
- **Grok / Mixtral** (Groq) — fallback final

### Sara AI
- `api/agente.js` — endpoint principal
- `lib/agents/saraAI-v2.js` — agente principal
- `lib/agents/api-manager-v2.js` — multi-model com fallback automático
- `lib/prompts/master-prompt.js` — system prompt + fluxo BANT

---

## Instalação

```bash
git clone <repo>
cd ronald-digital
npm install
```

### Variáveis de ambiente

Copie o exemplo e configure:

```bash
cp .env.example .env
```

```env
# Modelo principal (recomendado)
ANTHROPIC_API_KEY=sk-ant-api03-...

# Fallback rápido
GEMINI_API_KEY=AIzaSy...

# Fallback final
GROK_API_KEY=gsk_...

# EmailJS (formulário de contato)
VITE_EMAILJS_SERVICE_ID=...
VITE_EMAILJS_TEMPLATE_ID=...
VITE_EMAILJS_PUBLIC_KEY=...

# Feature flag Sara v2
SARA_V2=true
```

---

## Desenvolvimento

```bash
# Apenas o frontend (sem Sara AI)
npm run dev

# Frontend + backend (Sara AI funcional)
npm run dev:full
```

> `npm run dev:full` usa a Vercel CLI e inicia frontend em `localhost:3000` com as serverless functions em `/api/*`.

**Nota sobre memória:** os scripts já incluem `--max-old-space-size=4096` para evitar crash de OOM durante o build.

---

## Build e Deploy

```bash
npm run build
```

O deploy é automático via Vercel ao fazer push para `main`.

### Variáveis no Vercel

Em **Settings → Environment Variables**, configure:
- `ANTHROPIC_API_KEY`
- `GEMINI_API_KEY`
- `GROK_API_KEY`
- `SARA_V2=true`
- `VITE_EMAILJS_*`

---

## Estrutura

```
ronald-digital/
├── api/                        # Vercel Serverless Functions
│   ├── agente.js               # Endpoint principal da Sara AI
│   ├── metrics.js              # Métricas de conversa
│   └── product-recommender.js  # Recomendador de serviços
│
├── lib/                        # Backend — lógica de negócio
│   ├── agents/
│   │   ├── saraAI-v2.js        # Agente principal (ATIVO)
│   │   ├── saraAI.js           # Agente legado (fallback)
│   │   ├── api-manager-v2.js   # Multi-model com fallback
│   │   ├── knowledgeBase.js    # Catálogo de serviços
│   │   └── intent-analyzer.js  # Análise de intenção
│   ├── prompts/
│   │   └── master-prompt.js    # System prompt da Sara
│   └── utils/
│       ├── knowledge-base.js   # Base de conhecimento
│       ├── notifications.js    # Notificações de lead
│       └── context-builder.js  # Contexto dinâmico
│
├── src/                        # Frontend React
│   ├── pages/                  # Páginas do site
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   ├── Services.tsx
│   │   ├── Portfolio.tsx
│   │   ├── Contact.tsx
│   │   ├── SaraAI.tsx          # Página de chat com a Sara
│   │   └── FAQ.tsx
│   ├── components/
│   │   ├── SEO.tsx             # Componente SEO por página
│   │   ├── chat/               # Widgets de chat
│   │   ├── layout/             # Header + Footer
│   │   ├── sections/           # Seções da Home
│   │   └── ui/                 # shadcn/ui
│   └── services/
│       └── notificationService.ts
│
├── public/
│   ├── sitemap.xml             # Sitemap para Google
│   └── robots.txt              # Regras de crawl
│
├── index.html                  # Entry point + JSON-LD Schema
├── vite.config.ts
└── vercel.json                 # Funções, headers e cache
```

---

## SEO

Configuração completa implementada:

- **JSON-LD Schema** (`Organization` + `LocalBusiness`) no `index.html`
- **`react-helmet-async`** — título, description e canonical únicos por página
- **`/public/sitemap.xml`** — 7 URLs indexadas com prioridade
- **`/public/robots.txt`** — com referência ao sitemap
- **`vercel.json`** — headers de cache e segurança (`X-Frame-Options`, `X-Content-Type-Options`, etc.)

Para registrar no Google Search Console, submeta o sitemap:
```
https://www.ronaldigital.tech/sitemap.xml
```

---

## Fluxo da Sara AI

```
Usuário → ChatWidget → POST /api/agente
                              │
                      saraAI-v2.js (LangChain)
                              │
                    master-prompt.js (BANT + JSON)
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
        Claude Haiku    Gemini 2.0       Grok/Mixtral
        (principal)     Flash (2°)       (fallback)
```

Resposta sempre em JSON:
```json
{
  "resposta": "Texto para o usuário",
  "dados_extraidos": { "nome": null, "email": null, "tipo_projeto": null },
  "lead_score": 0,
  "proxima_acao": "descobrir_necessidade"
}
```

---

## Troubleshooting

**Sara não responde / erro 500**
Configure `ANTHROPIC_API_KEY` ou `GEMINI_API_KEY` nas variáveis de ambiente.

**Build com crash (out of memory)**
Os scripts `npm run dev` e `npm run build` já incluem `--max-old-space-size=4096`. Feche outros programas se o erro persistir.

**Crash com segfault no Git Bash**
Use o terminal PowerShell do VSCode em vez do Git Bash.

**404 em `/contact`**
Redirect configurado em `App.tsx`: `/contact` → `/contato`.

---

## Contato

- **Email:** contato@ronaldigital.tech
- **WhatsApp:** +55 85 99157-5525
- **Instagram:** [@ronal.digital](https://instagram.com/ronal.digital)
- **TikTok:** [@ronal_digital](https://tiktok.com/@ronal_digital)

---

*Projeto privado — RonalDigital © 2026*
