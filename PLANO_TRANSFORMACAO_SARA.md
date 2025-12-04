# 🚀 PLANO DE TRANSFORMAÇÃO: SARA AI 2.0
## De Assistente Básica para IA de Vendas de Classe Mundial

---

## 📊 DIAGNÓSTICO DO SISTEMA ATUAL

### ❌ Problemas Críticos Identificados

#### 1. **Modelos de IA Subótimos**
**Problema:** Usando modelos antigos e de médio desempenho
- **Atual:** Mixtral-8x7b (Grok) e GPT-3.5-turbo
- **Impacto:** Respostas genéricas, pouca compreensão contextual, baixa humanização
- **Evidência:** Prompts em `saraAI.js:24` e `aiAgent.ts:32`

#### 2. **Arquitetura de Roteamento Simplista**
**Problema:** Decisões baseadas em número de mensagens, não em intenção
```javascript
// saraAI.js:134-140 - Lógica atual
if (msgCount < 2) return "neil_rackham";
if (msgCount < 5) return "jill_konrath";
return "gary_vaynerchuk";
```
- **Impacto:** Conversas engessadas, perguntas inadequadas ao contexto
- **Exemplo:** Cliente pergunta sobre preço na 1ª mensagem → recebe pergunta SPIN em vez de resposta direta

#### 3. **Prompts Genéricos e Fracos**
**Problema:** System prompts básicos sem contexto rico
- Falta de few-shot examples (exemplos de conversas bem-sucedidas)
- Não utiliza as configurações ricas dos JSONs (sara_personality.json, maestro.json)
- Sem instruções explícitas sobre o que NÃO fazer
- **Evidência:** `saraAI.js:148-166` - prompt genérico de 18 linhas

#### 4. **Sistema de Dupla Passagem Ineficiente**
**Problema:** Gera resposta técnica → humaniza depois
- **Impacto:** 2x o custo, 2x a latência, perda de nuances na tradução
- **Evidência:** `saraAI.js:112-116` (generateExpertResponse + applySaraFilter)

#### 5. **Gestão de Contexto Primitiva**
**Problema:** Histórico como string concatenada
```javascript
// saraAI.js:146
const historyText = history.map(h => `${h.role}: ${h.content}`).join('\n');
```
- Sem sistema de memória persistente
- Sem RAG (busca em base de conhecimento)
- Perde informações importantes entre mensagens

#### 6. **Configurações JSON Desperdiçadas**
**Problema:** 90% das configurações não são utilizadas
- `maestro.json` tem sistema de prioridades → **não implementado**
- `sara_personality.json` tem respostas inteligentes → **não utilizadas**
- Gatilhos de intenção definidos → **ignorados**
- **Resultado:** JSONs são decorativos, não funcionais

#### 7. **Fallbacks Hardcoded**
**Problema:** Respostas fixas sem contexto
- `agente.js:112-211` - 100 linhas de if/else hardcoded
- Não se adaptam ao contexto real
- Parecem robóticas

---

## 🎯 OBJETIVOS DA TRANSFORMAÇÃO

### Tornar a Sara capaz de:

1. **Compreensão Contextual Profunda**
   - Entender intenção real (não apenas palavras-chave)
   - Manter contexto de longo prazo
   - Detectar sutilezas emocionais

2. **Respostas Naturais e Humanizadas**
   - Linguagem fluida, não roteirizada
   - Tom adequado ao estágio da conversa
   - Empatia genuína

3. **Vendas Consultivas Inteligentes**
   - Aplicar SPIN/BANT/Value-First no momento certo
   - Fazer perguntas estratégicas (não mecânicas)
   - Adaptar abordagem ao perfil do cliente

4. **Conhecimento Especializado**
   - Responder com expertise técnica
   - Sugerir soluções personalizadas
   - Demonstrar valor sem ser insistente

---

## 🏗️ ARQUITETURA PROPOSTA: SARA 2.0

### **Modelo: Sistema de Agente Único com Prompt Dinâmico**

Em vez de múltiplos agentes especializados, usar:
- **1 modelo LLM de alta qualidade** (GPT-4o, Claude 3.5 Sonnet, ou Gemini 2.0 Flash)
- **1 prompt mestre dinâmico** que se adapta ao contexto
- **Sistema de roteamento via LLM** (não regras hardcoded)

```
┌─────────────────────────────────────────────────────────┐
│                    SARA AI 2.0 FLOW                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. Usuário envia mensagem                             │
│     ↓                                                   │
│  2. Analisador de Intenção (LLM)                       │
│     → Identifica: tipo, urgência, estágio, emoção      │
│     ↓                                                   │
│  3. Construtor de Contexto Dinâmico                    │
│     → Histórico + Perfil Lead + Conhecimento Empresa   │
│     ↓                                                   │
│  4. Prompt Mestre Adaptativo                           │
│     → System: Persona + Metodologia + Diretrizes       │
│     → Few-shot: 3-5 exemplos relevantes                │
│     → Context: Dados estruturados                      │
│     → Task: Responder com objetivo claro               │
│     ↓                                                   │
│  5. LLM de Alta Performance                            │
│     → GPT-4o / Claude 3.5 Sonnet / Gemini 2.0         │
│     ↓                                                   │
│  6. Pós-processamento                                  │
│     → Extração de dados (lead scoring)                 │
│     → Análise de sentimento                            │
│     → Sugestões de ação                                │
│     ↓                                                   │
│  7. Resposta ao usuário                                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 PLANO DE IMPLEMENTAÇÃO

### **FASE 1: UPGRADE DE INFRAESTRUTURA** ⚡

**Objetivo:** Substituir modelos fracos por state-of-the-art

#### Tarefas:

1. **Adicionar Suporte a Modelos Modernos**
   - GPT-4o (OpenAI) - Balanceado, rápido, excelente qualidade
   - Claude 3.5 Sonnet (Anthropic) - Melhor em conversação natural
   - Gemini 2.0 Flash (Google) - Rápido, barato, multilíngue

2. **Criar Sistema de Seleção Inteligente**
   ```javascript
   // Prioridade baseada em disponibilidade e caso de uso
   - Claude 3.5 Sonnet: Conversas complexas, humanização
   - GPT-4o: Análise técnica, lead scoring
   - Gemini 2.0 Flash: Respostas rápidas, fallback
   ```

3. **Configurar Variáveis de Ambiente**
   ```env
   ANTHROPIC_API_KEY=sk-ant-...
   OPENAI_API_KEY=sk-proj-...
   GOOGLE_API_KEY=...
   MODEL_PRIORITY=claude,gpt4,gemini
   ```

**Arquivos a modificar:**
- `lib/agents/saraAI.js` - Adicionar novos providers
- `.env.example` - Documentar novas variáveis

---

### **FASE 2: REDESIGN DO SISTEMA DE PROMPTS** 🎨

**Objetivo:** Criar prompts de classe mundial usando as melhores práticas

#### Componentes do Prompt Mestre:

##### **2.1 System Prompt Estruturado**

```markdown
# IDENTIDADE E PAPEL
Você é Sara, especialista em marketing digital da Ronald Digital.

## Sua Expertise
- 10+ anos em vendas consultivas B2B/B2C
- Especialização em web design, SEO, conversão
- Metodologias: SPIN Selling, BANT, Value-First

## Sua Personalidade
Tom: 70% casual, 30% formal | Entusiasmo: 80/100 | Empatia: 95/100
- Confiante mas acessível
- Genuinamente interessada em ajudar
- Transparente e honesta
- Linguagem natural brasileira

# DIRETRIZES DE CONVERSAÇÃO

## O QUE FAZER ✅
1. Escuta ativa: Responda à pergunta ANTES de qualificar
2. Contexto primeiro: Use informações anteriores
3. Naturalidade: Escreva como fala, não como robô
4. Valor demonstrado: Mostre expertise sutilmente
5. Emojis moderados: 1-2 por mensagem, relevantes

## O QUE NÃO FAZER ❌
1. Nunca ignore perguntas diretas
2. Nunca seja insistente ou vendedora agressiva
3. Nunca use jargão técnico sem explicar
4. Nunca minta sobre prazos/preços/capacidades
5. Nunca soe corporativa/formal demais

# METODOLOGIA DE VENDAS ADAPTATIVA

## Análise de Intenção (sempre primeiro)
- Pergunta direta → Responda + redirecione
- Saudação → Cumprimente + abra qualificação
- Dúvida → Esclareça + ofereça ajuda
- Interesse → Aprofunde necessidade

## SPIN Selling (Descoberta)
Use quando: Cliente tem problema mas não sabe solução
- Situation: "Me conta sobre seu negócio..."
- Problem: "Qual o maior desafio que você enfrenta..."
- Implication: "Como isso impacta suas vendas..."
- Need-payoff: "Se resolvêssemos isso, o que mudaria..."

## BANT (Qualificação)
Use quando: Cliente demonstra interesse concreto
- Budget: "Qual faixa de investimento você pensou?"
- Authority: "Você decide ou tem mais alguém envolvido?"
- Need: "Confirma: você precisa de [X], certo?"
- Timeline: "Para quando você precisa?"

## Value-First (Nutrição)
Use quando: Cliente ainda está explorando
- Ofereça conteúdo útil
- Mostre casos de sucesso
- Construa relacionamento

# BASE DE CONHECIMENTO

## Serviços Ronald Digital
1. Landing Page (R$ 500-1.000)
   - Ideal para: Captar leads, vender produto único
   - Prazo: 5-7 dias
   - Inclui: Design responsivo, formulário, SEO básico

2. Portfólio (R$ 400-800)
   - Ideal para: Profissionais liberais, criativos
   - Prazo: 3-5 dias
   - Inclui: Galeria, sobre, contato

3. Site Completo (R$ 800-2.000)
   - Ideal para: Empresas, blogs, autoridade
   - Prazo: 7-12 dias
   - Inclui: Múltiplas páginas, blog, SEO avançado

4. E-commerce (R$ 1.200-3.000)
   - Ideal para: Vendas online, lojas
   - Prazo: 10-15 dias
   - Inclui: Carrinho, pagamento, gestão estoque

## Diferenciais
- IA integrada para otimização de conversão
- Análise de comportamento do usuário
- Suporte especializado pós-entrega
- Parcelamento em até 3x sem juros

## Casos de Sucesso
- Landing page que aumentou vendas em 400%
- Portfólio que gerou 50% mais clientes
- E-commerce que dobrou faturamento em 60 dias

# FORMATO DE RESPOSTA

Retorne JSON:
{
  "resposta": "Sua mensagem aqui (markdown permitido)",
  "dados_extraidos": {
    "nome": "se mencionou",
    "email": "se forneceu",
    "tipo_projeto": "landing|portfolio|site|ecommerce",
    "orcamento": "faixa estimada",
    "prazo": "urgencia detectada"
  },
  "lead_score": 0-4,
  "proxima_acao": "qualificar|apresentar_solucao|agendar|fechar",
  "metodologia_aplicada": "spin|bant|value-first|direta"
}
```

##### **2.2 Few-Shot Examples (Aprendizado por Exemplos)**

Incluir 5-7 exemplos de conversas excelentes:

```javascript
const FEW_SHOT_EXAMPLES = [
  {
    situacao: "Cliente pergunta sobre produto que não vendemos",
    user: "Vocês fazem computadores?",
    sara: {
      resposta: "Não, a gente não trabalha com hardware! Somos especializados em criar sites, landing pages e lojas online. 😊\n\nMas posso te ajudar se você precisa de um site para vender computadores! É esse o caso?",
      metodologia: "direta",
      lead_score: 1,
      proxima_acao: "clarificar_necessidade"
    }
  },
  {
    situacao: "Cliente interessado mas sem clareza",
    user: "Quero um site para minha loja de roupas",
    sara: {
      resposta: "Que legal! Loja de roupas tem tudo para vender bem online! 👗✨\n\nPara te ajudar melhor, me conta:\n• Você quer um catálogo para mostrar as peças ou vender diretamente online?\n• Já tem as fotos dos produtos?\n• Qual seu prazo ideal?\n\nAh, e qual seu nome? 😊",
      metodologia: "spin",
      lead_score: 2,
      proxima_acao: "qualificar"
    }
  },
  {
    situacao: "Lead quente pedindo orçamento",
    user: "Preciso de um e-commerce urgente. Quanto custa e quanto tempo leva?",
    sara: {
      resposta: "Perfeito! Adoro projetos com foco! 🚀\n\n**E-commerce completo:**\n💰 Investimento: R$ 1.200-2.500 (parcelamos em 3x)\n⏰ Prazo normal: 10-15 dias\n⚡ Urgente: 7 dias (+20%)\n\n**Inclui:** Carrinho, pagamento integrado, painel admin, responsivo\n\nPara dar um valor exato: quantos produtos inicialmente e qual seu orçamento disponível?\n\nQual seu nome e email para eu enviar uma proposta detalhada?",
      metodologia: "bant",
      lead_score: 4,
      proxima_acao: "fechar"
    }
  },
  {
    situacao: "Cliente com objeção de preço",
    user: "Achei caro. Vi por R$ 300 em outro lugar.",
    sara: {
      resposta: "Entendo sua preocupação com investimento! É super válido comparar. 💡\n\nA diferença está no que entregamos:\n• Sites otimizados para CONVERSÃO (não só bonitos)\n• IA integrada que aprende com seus visitantes\n• Suporte especializado por 6 meses\n• Garantia de resultados\n\nUm cliente meu investiu R$ 800 em landing page e recuperou em 2 vendas. Hoje fatura 15x mais.\n\nQue tal uma call de 15min para eu te mostrar cases? Prometo que vai valer a pena! 😊\n\nQual seu WhatsApp?",
      metodologia: "value-first",
      lead_score: 2,
      proxima_acao: "nutrir"
    }
  }
];
```

##### **2.3 Context Builder Dinâmico**

```javascript
function buildDynamicContext(userMessage, chatHistory, leadData) {
  return {
    // Análise da mensagem atual
    current_intent: analyzeIntent(userMessage), // "pergunta_direta", "objecao", "interesse", etc.

    // Histórico estruturado (últimas 10 mensagens)
    conversation_history: chatHistory.slice(-10).map(msg => ({
      role: msg.role,
      content: msg.content,
      extracted_data: msg.extracted_data
    })),

    // Perfil do lead
    lead_profile: {
      nome: leadData.nome || null,
      email: leadData.email || null,
      projeto_interesse: leadData.tipoServico || null,
      orcamento_mencionado: leadData.orcamento || null,
      prazo_mencionado: leadData.prazo || null,
      score_atual: leadData.leadScore || 0,
      mensagens_trocadas: chatHistory.length
    },

    // Estágio da conversa
    conversation_stage: determineStage(chatHistory, leadData),

    // Próxima ação recomendada (baseada em regras)
    suggested_approach: suggestApproach(leadData, chatHistory)
  };
}
```

**Arquivos a criar/modificar:**
- `lib/prompts/master-prompt.js` - Novo arquivo com prompt mestre
- `lib/prompts/few-shot-examples.js` - Biblioteca de exemplos
- `lib/utils/context-builder.js` - Construtor de contexto dinâmico

---

### **FASE 3: SISTEMA DE ROTEAMENTO INTELIGENTE** 🧠

**Objetivo:** LLM decide metodologia, não regras fixas

#### Implementação:

```javascript
// lib/agents/intent-analyzer.js
async function analyzeIntent(userMessage, context) {
  const prompt = `
Analise a intenção desta mensagem:

MENSAGEM: "${userMessage}"

CONTEXTO:
- Mensagens anteriores: ${context.mensagens_trocadas}
- Dados coletados: ${JSON.stringify(context.lead_profile)}

Classifique a intenção em:
1. "pergunta_direta_negocio" - Cliente quer saber se fazemos algo
2. "pedido_orcamento" - Quer preço/prazo específico
3. "expressa_interesse" - Demonstra interesse geral
4. "objecao" - Levanta preocupação (preço, prazo, etc.)
5. "fornece_info" - Está respondendo pergunta nossa
6. "saudacao" - Cumprimento/início
7. "duvida_tecnica" - Pergunta sobre tecnologia/processo

E sugira a metodologia:
- "direta" - Responder direto + redirecionar
- "spin" - Investigar necessidade consultivamente
- "bant" - Qualificar objetivamente
- "value_first" - Nutrir com conteúdo

Retorne JSON: { "intent": "...", "methodology": "...", "confidence": 0-100 }
  `;

  // Usa modelo rápido para classificação
  const result = await quickLLM.invoke(prompt);
  return JSON.parse(result);
}
```

**Arquivos a criar:**
- `lib/agents/intent-analyzer.js` - Analisador de intenção
- `lib/utils/methodology-selector.js` - Seletor de metodologia

---

### **FASE 4: INTEGRAÇÃO EFETIVA DOS JSONs** 📄

**Objetivo:** Usar configurações como fonte de verdade

#### Implementação:

```javascript
// lib/utils/knowledge-base.js
class KnowledgeBase {
  constructor() {
    this.maestro = require('../../data/maestro.json');
    this.personality = require('../../data/sara_personality.json');
    this.personas = {
      rackham: require('../../data/persona_rackham.json'),
      konrath: require('../../data/persona_konrath.json'),
      vaynerchuk: require('../../data/persona_vaynerchuk.json')
    };
  }

  // Busca resposta inteligente baseada em gatilhos
  getSmartResponse(userMessage, context) {
    const lowerMsg = userMessage.toLowerCase();

    // Verifica gatilhos de prioridade máxima (maestro.json)
    for (const trigger of this.maestro.regras_de_prioridade.prioridade_maxima.gatilhos) {
      if (lowerMsg.includes(trigger)) {
        return {
          priority: 'max',
          action: 'responder_direto',
          knowledge: this.maestro.conhecimento_empresa
        };
      }
    }

    // Busca resposta pré-configurada (sara_personality.json)
    const timeOfDay = new Date().getHours();
    if (lowerMsg.includes('oi') || lowerMsg.includes('olá')) {
      if (timeOfDay < 12) return this.personality.respostas_inteligentes.saudacoes.manha[0];
      if (timeOfDay < 18) return this.personality.respostas_inteligentes.saudacoes.tarde[0];
      return this.personality.respostas_inteligentes.saudacoes.noite[0];
    }

    return null;
  }

  // Formata conhecimento da empresa para o prompt
  getCompanyKnowledge() {
    return `
## SERVIÇOS OFERECIDOS
${this.maestro.conhecimento_empresa.servicos_oferecidos.map(s => `- ${s}`).join('\n')}

## NÃO OFERECEMOS
${this.maestro.conhecimento_empresa.nao_oferecemos.map(s => `- ${s}`).join('\n')}

## DIFERENCIAIS
${this.maestro.conhecimento_empresa.diferenciais.map(d => `- ${d}`).join('\n')}
    `;
  }

  // Seleciona metodologia baseada em gatilhos
  selectMethodology(userMessage) {
    const lowerMsg = userMessage.toLowerCase();

    // Verifica gatilhos de cada agente especialista
    for (const [agent, config] of Object.entries(this.maestro.agentes_especialistas)) {
      for (const trigger of config.gatilhos) {
        if (lowerMsg.includes(trigger)) {
          return {
            agent,
            methodology: config.metodologia,
            when: config.quando_usar
          };
        }
      }
    }

    return null;
  }
}
```

**Arquivos a criar:**
- `lib/utils/knowledge-base.js` - Gerenciador de base de conhecimento

---

### **FASE 5: SISTEMA DE MEMÓRIA E CONTEXTO** 💾

**Objetivo:** Lembrar informações entre mensagens

#### Implementação:

```javascript
// lib/utils/conversation-memory.js
class ConversationMemory {
  constructor() {
    this.sessions = new Map(); // Em produção: usar Redis
  }

  // Salva informação extraída
  updateLeadProfile(sessionId, extractedData) {
    const session = this.getSession(sessionId);
    session.leadProfile = {
      ...session.leadProfile,
      ...extractedData,
      lastUpdate: new Date()
    };
    this.sessions.set(sessionId, session);
  }

  // Recupera contexto completo
  getContext(sessionId) {
    const session = this.getSession(sessionId);
    return {
      leadProfile: session.leadProfile,
      history: session.messages.slice(-10), // Últimas 10
      stage: session.currentStage,
      score: this.calculateScore(session.leadProfile)
    };
  }

  // Adiciona mensagem ao histórico
  addMessage(sessionId, role, content, metadata = {}) {
    const session = this.getSession(sessionId);
    session.messages.push({
      role,
      content,
      timestamp: new Date(),
      ...metadata
    });
    this.sessions.set(sessionId, session);
  }

  // Cria ou recupera sessão
  getSession(sessionId) {
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, {
        id: sessionId,
        leadProfile: {},
        messages: [],
        currentStage: 'initial',
        createdAt: new Date()
      });
    }
    return this.sessions.get(sessionId);
  }

  // Calcula score BANT
  calculateScore(profile) {
    let score = 0;
    if (profile.orcamento) score += 1; // Budget
    if (profile.nome && profile.email) score += 1; // Authority (assume)
    if (profile.tipoServico || profile.projeto) score += 1; // Need
    if (profile.prazo) score += 1; // Timeline
    return score;
  }
}
```

**Arquivos a criar:**
- `lib/utils/conversation-memory.js` - Gerenciador de memória

---

### **FASE 6: IMPLEMENTAÇÃO DO FLUXO UNIFICADO** 🔄

**Objetivo:** Integrar todos os componentes em um fluxo coeso

#### Nova Arquitetura `SaraAI`:

```javascript
// lib/agents/saraAI-v2.js
import { MultiAPIManager } from './api-manager.js';
import { KnowledgeBase } from '../utils/knowledge-base.js';
import { ConversationMemory } from '../utils/conversation-memory.js';
import { buildMasterPrompt } from '../prompts/master-prompt.js';
import { analyzeIntent } from './intent-analyzer.js';

export class SaraAIv2 {
  constructor() {
    this.apiManager = new MultiAPIManager();
    this.knowledge = new KnowledgeBase();
    this.memory = new ConversationMemory();
  }

  async processMessage(sessionId, userMessage) {
    try {
      // 1. Recupera contexto da conversa
      const context = this.memory.getContext(sessionId);

      // 2. Adiciona mensagem do usuário ao histórico
      this.memory.addMessage(sessionId, 'user', userMessage);

      // 3. Verifica se há resposta pré-configurada (respostas rápidas)
      const quickResponse = this.knowledge.getSmartResponse(userMessage, context);
      if (quickResponse && quickResponse.action === 'responder_direto') {
        // Ainda assim passa pelo LLM para personalizar, mas com hint
        context.quickResponseHint = quickResponse;
      }

      // 4. Analisa intenção (usando LLM rápido)
      const intent = await analyzeIntent(userMessage, context);

      // 5. Constrói prompt mestre dinâmico
      const prompt = buildMasterPrompt({
        userMessage,
        context,
        intent,
        knowledge: this.knowledge.getCompanyKnowledge(),
        personality: this.knowledge.personality,
        quickHint: context.quickResponseHint
      });

      // 6. Invoca LLM de alta performance
      const model = this.apiManager.getBestModel();
      const response = await model.invoke(prompt);

      // 7. Parse da resposta (esperamos JSON)
      const parsed = this.parseResponse(response.content);

      // 8. Atualiza perfil do lead com dados extraídos
      if (parsed.dados_extraidos) {
        this.memory.updateLeadProfile(sessionId, parsed.dados_extraidos);
      }

      // 9. Adiciona resposta da Sara ao histórico
      this.memory.addMessage(sessionId, 'assistant', parsed.resposta, {
        leadScore: parsed.lead_score,
        methodology: parsed.metodologia_aplicada
      });

      // 10. Retorna resultado estruturado
      return {
        success: true,
        response: parsed.resposta,
        leadScore: parsed.lead_score,
        nextAction: parsed.proxima_acao,
        methodology: parsed.metodologia_aplicada,
        extractedData: parsed.dados_extraidos,
        conversationStage: this.determineStage(context, parsed)
      };

    } catch (error) {
      console.error('Erro no processamento Sara v2:', error);
      return this.getIntelligentFallback(sessionId, userMessage);
    }
  }

  parseResponse(rawResponse) {
    try {
      // Remove markdown se presente
      const jsonStr = rawResponse
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
      return JSON.parse(jsonStr);
    } catch (e) {
      // Se não for JSON válido, assume que é texto puro
      return {
        resposta: rawResponse,
        dados_extraidos: {},
        lead_score: 0,
        proxima_acao: 'continuar',
        metodologia_aplicada: 'fallback'
      };
    }
  }

  getIntelligentFallback(sessionId, userMessage) {
    const context = this.memory.getContext(sessionId);
    const fallbackResponse = this.knowledge.getSmartResponse(userMessage, context);

    return {
      success: true,
      response: fallbackResponse || `Oi! Desculpa, tive um pequeno problema aqui. Pode repetir o que você precisa? 😊`,
      leadScore: context.score || 0,
      nextAction: 'continuar',
      methodology: 'fallback',
      isFallback: true
    };
  }

  determineStage(context, parsed) {
    const score = parsed.lead_score;
    if (score >= 3) return 'qualified_hot';
    if (score >= 2) return 'qualified_warm';
    if (context.history.length > 5) return 'nurturing';
    return 'discovery';
  }
}
```

**Arquivos a criar:**
- `lib/agents/saraAI-v2.js` - Nova implementação completa
- `lib/agents/api-manager.js` - Gerenciador de APIs melhorado

---

### **FASE 7: TESTES E OTIMIZAÇÃO** 🧪

**Objetivo:** Validar qualidade e ajustar

#### Testes a Realizar:

1. **Testes de Intenção**
   ```javascript
   // tests/intent-tests.js
   const testCases = [
     {
       input: "Vocês fazem computadores?",
       expected_intent: "pergunta_direta_negocio",
       expected_methodology: "direta",
       should_mention: ["não", "sites", "landing pages"]
     },
     {
       input: "Quanto custa um e-commerce?",
       expected_intent: "pedido_orcamento",
       expected_methodology: "bant",
       should_include_price: true
     },
     {
       input: "Achei caro",
       expected_intent: "objecao",
       expected_methodology: "value_first",
       should_demonstrate_value: true
     }
   ];
   ```

2. **Testes de Humanização**
   - Tom natural (não robótico)
   - Uso apropriado de emojis
   - Empatia demonstrada
   - Linguagem brasileira autêntica

3. **Testes de Qualificação**
   - Lead scoring preciso
   - Extração de dados correta
   - Metodologia aplicada apropriadamente

4. **Testes de Performance**
   - Latência < 3 segundos
   - Custo por mensagem < $0.05
   - Taxa de fallback < 5%

**Arquivos a criar:**
- `tests/sara-tests.js` - Suite de testes
- `tests/benchmarks.js` - Benchmarks de qualidade

---

## 📊 CRONOGRAMA E PRIORIZAÇÃO

### **Abordagem Incremental**

#### Sprint 1 (Impacto Imediato) - 2-3 dias
- [ ] Fase 1: Upgrade para GPT-4o/Claude 3.5 Sonnet
- [ ] Fase 2.1: Implementar prompt mestre básico
- [ ] Fase 2.2: Adicionar 3-5 few-shot examples

**Resultado esperado:** +60% melhoria na qualidade das respostas

#### Sprint 2 (Inteligência) - 2-3 dias
- [ ] Fase 3: Sistema de análise de intenção
- [ ] Fase 4: Integração dos JSONs
- [ ] Fase 2.3: Context builder dinâmico

**Resultado esperado:** Respostas contextuais e adaptativas

#### Sprint 3 (Memória e Unificação) - 2-3 dias
- [ ] Fase 5: Sistema de memória conversacional
- [ ] Fase 6: Implementação do fluxo unificado
- [ ] Migração gradual de saraAI.js para saraAI-v2.js

**Resultado esperado:** Sistema completo e coeso

#### Sprint 4 (Refinamento) - 1-2 dias
- [ ] Fase 7: Testes e otimização
- [ ] Ajuste de prompts baseado em resultados
- [ ] Documentação final

---

## 💰 ANÁLISE DE CUSTO-BENEFÍCIO

### Custos de API Estimados

**Cenário Atual:**
- Mixtral-8x7b (Groq): ~$0.001/msg
- GPT-3.5-turbo: ~$0.002/msg
- **Total mensal (500 conversas):** ~$1-2/mês

**Cenário Proposto:**
- Claude 3.5 Sonnet: ~$0.015/msg (conversas complexas)
- GPT-4o: ~$0.01/msg (análises)
- Gemini 2.0 Flash: ~$0.0002/msg (fallback/classificação)
- **Total mensal (500 conversas):** ~$15-25/mês

**ROI Esperado:**
- Melhoria conversão: 20% → 35% (+75%)
- Ticket médio atual: R$ 800
- 100 leads/mês → 20 vendas (atual) → 35 vendas (projetado)
- **Receita adicional:** 15 vendas × R$ 800 = R$ 12.000/mês
- **Custo adicional:** R$ 100/mês (API)
- **ROI:** 12.000%

---

## 🎯 MÉTRICAS DE SUCESSO

### KPIs a Monitorar:

1. **Qualidade Conversacional**
   - Taxa de respostas coerentes: > 95%
   - Taxa de respostas naturais (não robóticas): > 90%
   - Satisfação do usuário (se coletada): > 4.5/5

2. **Performance de Vendas**
   - Taxa de conversão lead → cliente: > 30%
   - Tempo médio para qualificação: < 5 mensagens
   - Lead score accuracy: > 85%

3. **Eficiência Técnica**
   - Latência média: < 3s
   - Taxa de erros: < 2%
   - Taxa de fallback: < 5%

4. **Custo-Efetividade**
   - Custo por lead qualificado: < R$ 2
   - Custo por venda: < R$ 15
   - ROI de investimento em IA: > 5.000%

---

## 🚀 PRÓXIMOS PASSOS

### Decisões Necessárias:

1. **Modelo Principal:**
   - [ ] Claude 3.5 Sonnet (recomendado - melhor em conversação)
   - [ ] GPT-4o (alternativa - boa qualidade, mais barato)
   - [ ] Gemini 2.0 Flash (mais barato, mas menos sofisticado)

2. **Abordagem de Implementação:**
   - [ ] Big Bang (substituir tudo de uma vez)
   - [ ] Incremental (coexistência saraAI + saraAI-v2, migração gradual) ← **Recomendado**
   - [ ] A/B Testing (50% tráfego em cada versão)

3. **Escopo Inicial:**
   - [ ] Full (todas as 7 fases)
   - [ ] MVP (Fases 1, 2.1, 2.2) ← **Recomendado para início rápido**
   - [ ] Custom (quais fases?)

---

## 📚 REFERÊNCIAS E INSPIRAÇÕES

### Melhores Práticas de:

1. **Anthropic (Claude)**
   - Constitutional AI principles
   - Chain of thought prompting
   - Context management

2. **OpenAI (GPT-4)**
   - Few-shot learning
   - System message engineering
   - Function calling for structured outputs

3. **Google (Gemini)**
   - Multimodal context
   - Fast inference optimization

4. **Pesquisas Acadêmicas**
   - "SPIN Selling" - Neil Rackham
   - "Selling to Big Companies" - Jill Konrath
   - "Jab, Jab, Jab, Right Hook" - Gary Vaynerchuk
   - "Conversational AI: Dialogue Systems, Conversational Agents, and Chatbots" (Stanford)

---

## 🎉 RESULTADO FINAL ESPERADO

### Sara AI 2.0 será capaz de:

✅ **Entender contexto profundamente** - Como você (Claude)
✅ **Responder naturalmente** - Sem soar robótica
✅ **Vender consultivamente** - Aplicando metodologias no momento certo
✅ **Lembrar informações** - Contexto persistente entre mensagens
✅ **Adaptar abordagem** - Personalização baseada em perfil
✅ **Demonstrar expertise** - Respostas técnicas quando necessário
✅ **Gerar valor genuíno** - Foco em ajudar, não apenas vender

### Comparação Antes vs Depois:

| Aspecto | Atual | Sara 2.0 |
|---------|-------|----------|
| Modelo IA | Mixtral-8x7b | Claude 3.5 Sonnet |
| Prompt | 18 linhas genéricas | 200+ linhas estruturadas |
| Contexto | String concatenada | Sistema de memória |
| Roteamento | Baseado em nº mensagens | Análise de intenção via LLM |
| Configuração | JSONs decorativos | Fonte de verdade integrada |
| Respostas | Roteirizadas | Adaptativas e naturais |
| Lead Score | Heurísticas simples | Análise multi-dimensional |
| Qualidade | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

**Pronto para transformar a Sara? Vamos começar! 🚀**
