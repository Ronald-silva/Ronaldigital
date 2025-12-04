# 🚀 Sara AI 2.0 - Guia Completo

## Visão Geral

Sara 2.0 é uma transformação completa do sistema de assistente de vendas, elevando-a de uma IA básica para uma assistente de classe mundial capaz de:

✅ **Compreensão Contextual Profunda** - Entende intenção real, não apenas palavras-chave
✅ **Respostas Naturais e Humanizadas** - Linguagem fluida, empática e não robótica
✅ **Vendas Consultivas Inteligentes** - SPIN, BANT e Value-First aplicados dinamicamente
✅ **Memória Conversacional** - Lembra informações entre mensagens
✅ **Modelos State-of-the-Art** - Claude 3.5 Sonnet, GPT-4o, Gemini 2.0 Flash

---

## 📋 O Que Mudou

### Antes (Sara v1)

- ❌ Modelos antigos (Mixtral-8x7b, GPT-3.5-turbo)
- ❌ Prompts genéricos de 18 linhas
- ❌ Roteamento baseado em nº de mensagens
- ❌ Respostas roteirizadas
- ❌ Contexto perdido entre mensagens
- ❌ Configurações JSON decorativas

### Depois (Sara v2)

- ✅ **Modelos modernos** (Claude 3.5 Sonnet, GPT-4o, Gemini 2.0)
- ✅ **Prompts de 200+ linhas** estruturados
- ✅ **Roteamento inteligente** via análise de intenção
- ✅ **Respostas adaptativas** e contextuais
- ✅ **Sistema de memória** conversacional
- ✅ **JSONs integrados** como fonte de verdade

---

## 🛠️ Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# ═══════════════════════════════════════════════════════════════
# SARA AI 2.0 - Configuração de APIs
# ═══════════════════════════════════════════════════════════════

# 🚀 Feature Flag: Ativa Sara 2.0 (recomendado)
SARA_V2=true

# ═══════════════════════════════════════════════════════════════
# MODELOS DE IA (Configure pelo menos UM)
# ═══════════════════════════════════════════════════════════════

# 🥇 PRIORIDADE 1: Claude 3.5 Sonnet (RECOMENDADO)
# Melhor para: Conversação natural, humanização, empatia
# Custo: ~$15/1M tokens de saída
# Obter chave: https://console.anthropic.com/
ANTHROPIC_API_KEY=sk-ant-api03-...

# 🥈 PRIORIDADE 2: GPT-4o (Alternativa Excelente)
# Melhor para: Análise técnica, raciocínio, velocidade
# Custo: ~$10/1M tokens de saída
# Obter chave: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-proj-...

# 🥉 PRIORIDADE 3: Gemini 2.0 Flash (Custo-Benefício)
# Melhor para: Respostas rápidas, economia
# Custo: ~$0.20/1M tokens de saída
# Obter chave: https://aistudio.google.com/app/apikey
GOOGLE_API_KEY=AIzaSy...

# 🔄 FALLBACK: Grok (Compatibilidade)
# Mantido para compatibilidade, mas não recomendado como principal
GROK_API_KEY=...

# ═══════════════════════════════════════════════════════════════
# RECOMENDAÇÃO DE CONFIGURAÇÃO
# ═══════════════════════════════════════════════════════════════
#
# Para melhor experiência:
# 1. Configure ANTHROPIC_API_KEY (Claude 3.5 Sonnet)
# 2. Adicione OPENAI_API_KEY como fallback
# 3. Opcionalmente, adicione GOOGLE_API_KEY para economia
#
# Custo estimado (500 conversas/mês):
# - Claude only: ~$120/mês
# - GPT-4o only: ~$80/mês
# - Gemini only: ~$2/mês (mas qualidade inferior)
# - Claude + GPT-4o fallback: ~$100/mês (RECOMENDADO)
#
# ═══════════════════════════════════════════════════════════════
```

### 2. Instalação de Dependências

```bash
npm install @langchain/anthropic @langchain/openai @langchain/google-genai
```

### 3. Ativação

Sara 2.0 usa feature flag para permitir rollback fácil:

```bash
# Ativar Sara 2.0
SARA_V2=true

# Desativar (volta para v1)
SARA_V2=false
```

---

## 🎯 Como Usar

### Exemplo Básico

```javascript
import { SaraAIv2 } from './lib/agents/saraAI-v2.js';

const sara = new SaraAIv2();

const resultado = await sara.processMessage(
  "Preciso de um e-commerce urgente. Quanto custa?",
  {
    nome: "João",
    email: "joao@example.com"
  },
  [] // histórico vazio
);

console.log(resultado);
/* Resultado:
{
  success: true,
  response: "Perfeito! Adoro projetos com foco! 🚀\n\n**E-commerce completo:**\n💰 Investimento: R$ 1.200-2.500...",
  leadScore: 3,
  nextAction: "fechar",
  methodology: "bant",
  extractedData: {
    nome: "João",
    email: "joao@example.com",
    tipo_projeto: "e-commerce",
    prazo: "urgente"
  },
  conversationStage: "qualified_hot",
  modelUsed: "claude"
}
*/
```

### Conversação Multi-turno

```javascript
const chatHistory = [];

// Mensagem 1
let resultado = await sara.processMessage("Oi, boa tarde!", { nome: "Maria" }, chatHistory);
chatHistory.push(
  { role: 'user', content: "Oi, boa tarde!" },
  { role: 'assistant', content: resultado.response }
);

// Mensagem 2 (Sara lembra do contexto)
resultado = await sara.processMessage("Quero um site para minha loja de roupas", { nome: "Maria" }, chatHistory);
chatHistory.push(
  { role: 'user', content: "Quero um site para minha loja de roupas" },
  { role: 'assistant', content: resultado.response }
);

// Sara vai perguntar detalhes específicos sobre loja de roupas
```

---

## 📊 Estrutura do Projeto

```
lib/
├── agents/
│   ├── saraAI.js              # Sara v1 (legada)
│   ├── saraAI-v2.js           # 🆕 Sara v2 (nova)
│   └── api-manager-v2.js      # 🆕 Gerenciador de APIs modernas
├── prompts/
│   ├── master-prompt.js       # 🆕 Prompt mestre estruturado
│   └── few-shot-examples.js   # 🆕 Biblioteca de exemplos
└── utils/                      # Utilitários futuros (Sprint 2)

api/
└── agente.js                   # API endpoint (com feature flag)

data/
├── maestro.json                # Agora integrado ao prompt
├── sara_personality.json       # Agora integrado ao prompt
└── persona_*.json              # Metodologias integradas
```

---

## 🧪 Testando

### Teste 1: Produto Não Vendido

```javascript
const result = await sara.processMessage("Vocês fazem computadores?", {}, []);

// Esperado:
// ✅ Resposta direta "Não"
// ✅ Explica o que fazemos
// ✅ Redireciona: "Mas posso ajudar se precisar de site para vender computadores"
// ✅ Tom natural, não robótico
```

### Teste 2: Lead Quente

```javascript
const result = await sara.processMessage(
  "Preciso de um e-commerce urgente. Quanto custa e quanto tempo leva?",
  { nome: "Cliente" },
  []
);

// Esperado:
// ✅ Responde preço: R$ 1.200-2.500
// ✅ Responde prazo: 10-15 dias (normal) ou 7 dias (urgente)
// ✅ Lead score: 3-4 (quente)
// ✅ Próxima ação: "fechar"
// ✅ Pede nome/email para proposta
```

### Teste 3: Objeção de Preço

```javascript
const result = await sara.processMessage(
  "Achei caro. Vi por R$ 300 em outro lugar.",
  {},
  []
);

// Esperado:
// ✅ Valida a preocupação (empatia)
// ✅ Demonstra valor (não defende preço)
// ✅ Usa caso de sucesso
// ✅ Propõe próximo passo (call, material)
// ✅ Metodologia: "value_first"
```

---

## 📈 Métricas e Monitoramento

### Lead Scoring

Sara 2.0 usa metodologia BANT para pontuação:

| Score | Classificação | Critérios | Ação Recomendada |
|-------|---------------|-----------|-------------------|
| 4 | QUENTE 🔥 | Budget + Authority + Need + Timeline | Fechar venda |
| 3 | QUENTE 🔥 | 3 de 4 critérios | Fechar venda |
| 2 | MORNO 🌡️ | 2 critérios | Qualificar mais |
| 0-1 | FRIO ❄️ | 0-1 critério | Nutrir |

### Custos Estimados

Baseado em 500 conversas/mês (média 4 mensagens cada):

| Modelo | Custo/Mensagem | Custo Mensal | Qualidade |
|--------|----------------|--------------|-----------|
| Claude 3.5 Sonnet | $0.06 | $120 | ⭐⭐⭐⭐⭐ |
| GPT-4o | $0.04 | $80 | ⭐⭐⭐⭐ |
| Gemini 2.0 Flash | $0.001 | $2 | ⭐⭐⭐ |
| Mixtral (Grok) | $0.002 | $4 | ⭐⭐ |

**Recomendação:** Claude 3.5 Sonnet principal + GPT-4o fallback = ~$100/mês

---

## 🎓 Metodologias Implementadas

### SPIN Selling (Neil Rackham)

Sara usa quando cliente tem problema mas não sabe solução:

- **S**ituation: "Me conta sobre seu negócio..."
- **P**roblem: "Qual o maior desafio..."
- **I**mplication: "Como isso impacta suas vendas..."
- **N**eed-payoff: "Se resolvêssemos, o que mudaria..."

### BANT (Jill Konrath)

Sara qualifica objetivamente quando cliente demonstra interesse:

- **B**udget: "Qual faixa de investimento você pensou?"
- **A**uthority: "Você decide ou tem mais alguém?"
- **N**eed: "Confirma: você precisa de [X]?"
- **T**imeline: "Para quando você precisa?"

### Value-First (Gary Vaynerchuk)

Sara nutre quando cliente está explorando:

- Oferece conteúdo útil
- Mostra casos de sucesso
- Constrói relacionamento antes de vender

---

## 🐛 Troubleshooting

### Sara não está respondendo

1. Verifique se `SARA_V2=true` no `.env`
2. Confirme que pelo menos uma API key está configurada
3. Veja logs no console para identificar erros

```bash
# Deve mostrar:
✅ Claude 3.5 Sonnet inicializado (Prioridade 1)
✅ Sara AI 2.0 inicializada
🤖 Usando Sara v2.0 (Moderna)
```

### Respostas ainda robóticas

1. Confirme que está usando Claude 3.5 Sonnet ou GPT-4o (não Mixtral)
2. Verifique se few-shot examples estão sendo carregados
3. Ajuste tom no `sara_personality.json`

### Erros de API

```
Error: All models failed. Last error: ...
```

**Solução:**
- Verifique se as API keys estão corretas
- Confirme que tem créditos nas contas
- Teste cada API separadamente

---

## 🚀 Próximos Passos (Sprint 2 e 3)

### Sprint 2: Inteligência Contextual

- [ ] Sistema de análise de intenção dedicado
- [ ] Integração completa dos JSONs
- [ ] Context builder otimizado

### Sprint 3: Memória Persistente

- [ ] Sistema de memória com Redis/PostgreSQL
- [ ] RAG para base de conhecimento
- [ ] Aprendizado contínuo

---

## 📞 Suporte

- **Documentação completa:** `PLANO_TRANSFORMACAO_SARA.md`
- **Código fonte:** `lib/agents/saraAI-v2.js`
- **Exemplos:** `lib/prompts/few-shot-examples.js`

---

**Desenvolvido com ❤️ para Ronald Digital**

*Sara 2.0 - Vendas Consultivas Inteligentes*
