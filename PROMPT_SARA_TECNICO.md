# 🔧 SARA AI - PROMPT TÉCNICO

## 🏗️ **ARQUITETURA DO SISTEMA**

### 📁 **ESTRUTURA DE ARQUIVOS:**
```
📦 ronald-digital/
├── 📁 api/
│   └── agente.js ✅ (API principal)
├── 📁 lib/agents/
│   └── saraAI.js ✅ (Core da IA)
├── 📁 src/components/chat/
│   └── ChatWidget.tsx ✅ (Interface)
├── 📁 data/
│   ├── maestro.json ✅ (Regras de prioridade)
│   ├── sara_personality.json ✅ (Personalidade)
│   ├── persona_rackham.json ✅ (SPIN Selling)
│   ├── persona_konrath.json ✅ (BANT)
│   └── persona_vaynerchuk.json ✅ (Value-First)
└── 📁 test/
    ├── test-sara-completo.js ✅
    ├── test-sara-inteligente.js ✅
    └── test-sara-humanizada.js ✅
```

## 🧠 **CLASSE PRINCIPAL: SaraAI**

### 🔄 **FLUXO DE PROCESSAMENTO:**
```javascript
processMessage(userMessage, userInfo) {
  1. updateLeadData(userInfo)
  2. analyzeMessageIntention(userMessage) 
  3. processBasedOnPriority(intention, message)
  4. formatResponse(content, agentType)
  5. return { success, response, leadScore, nextAction }
}
```

### 🎯 **ANÁLISE DE INTENÇÃO:**
```javascript
analyzeMessageIntention(message) {
  // Detecta 8 tipos de intenção:
  - pergunta_pessoal (qual seu nome?)
  - pergunta_sobre_ia (você é robô?)
  - especificacao_projeto (quero loja de roupas)
  - pergunta_preco (quanto custa?)
  - interesse_compra (quero fazer)
  - pergunta_processo (como funciona?)
  - objecao (está caro)
  - pergunta_contato (como falar?)
}
```

### 📊 **SISTEMA DE PRIORIDADES:**
```javascript
// maestro.json
{
  "regras_de_prioridade": {
    "prioridade_maxima": {
      "gatilhos": ["vocês vendem", "vocês fazem", "que tipo de"],
      "acao": "responder_diretamente"
    },
    "prioridade_alta": {
      "gatilhos": ["preciso tirar dúvidas", "me ajuda"],
      "acao": "acolher_e_convidar"
    },
    "prioridade_media": {
      "acao": "continuar_conversa_contextual"
    },
    "prioridade_baixa": {
      "gatilhos": ["oi", "olá", "boa tarde"],
      "acao": "cumprimentar_e_qualificar"
    }
  }
}
```

## 🎭 **SISTEMA DE PERSONAS**

### 🔍 **ATIVAÇÃO DE PERSONAS:**
```javascript
getActiveExpert(step, context) {
  if (step <= 2) return 'rackham';  // Descoberta
  if (step <= 4) return 'konrath';  // Qualificação  
  return 'vaynerchuk';              // Relacionamento
}
```

### 📋 **METODOLOGIAS:**
```javascript
// RACKHAM (SPIN Selling)
const spinQuestions = {
  situacao: "Qual sua situação atual online?",
  problema: "Que desafios você enfrenta?", 
  implicacao: "Como isso impacta seu negócio?",
  necessidade: "O que uma solução resolveria?"
}

// KONRATH (BANT)
const bantQuestions = {
  budget: "Qual seu orçamento disponível?",
  authority: "Você decide sobre esse projeto?",
  need: "Qual seu principal objetivo?", 
  timeline: "Para quando você precisa?"
}

// VAYNERCHUK (Value-First)
const valueContent = [
  "Guia: Como Aumentar Vendas Online",
  "Case: Loja que Faturou R$ 50k",
  "Checklist: E-commerce Essencial"
]
```

## 📊 **LEAD SCORING AUTOMÁTICO**

### 🔢 **CÁLCULO DE SCORE:**
```javascript
calculateLeadScore() {
  let score = 0;
  const text = this.conversationHistory.join(' ');
  
  // Budget indicators (+1)
  if (text.includes('orçamento|preço|valor|custo')) score++;
  
  // Authority indicators (+1)  
  if (text.includes('decisão|responsável|dono|gerente')) score++;
  
  // Need indicators (+1)
  if (text.includes('preciso|quero|necessário|problema')) score++;
  
  // Timeline indicators (+1)
  if (text.includes('urgente|prazo|quando|rápido')) score++;
  
  return Math.min(score, 4);
}
```

### 🎯 **CLASSIFICAÇÃO:**
```javascript
getLeadClassification(score) {
  if (score >= 3) return "QUENTE 🔥";
  if (score >= 2) return "MORNO 🌡️"; 
  return "FRIO ❄️";
}
```

## 🔄 **SISTEMA DE FALLBACK**

### 🌐 **MÚLTIPLAS APIs:**
```javascript
class MultiAPIManager {
  models = {
    gemini: GoogleGenerativeAI,
    grok: ChatOpenAI, 
    openai: ChatOpenAI
  }
  
  async invoke(messages) {
    for (const provider of ['gemini', 'grok', 'openai']) {
      try {
        return await this.models[provider].invoke(messages);
      } catch (error) {
        console.warn(`Falha em ${provider}`);
        continue;
      }
    }
    throw new Error("Todas as APIs falharam");
  }
}
```

### 🧠 **FALLBACK INTELIGENTE:**
```javascript
// Quando APIs falham, usa lógica interna
generateSpecificationFallback(message, projectInfo) {
  if (message.includes('roupas')) {
    return `Perfeito! Loja de roupas é incrível! 👗
    
    E-commerce completo com:
    • Catálogo por categoria
    • Filtros avançados  
    • Carrinho otimizado
    
    💰 R$ 1.200-2.500 | ⏰ 10-15 dias
    Qual seu orçamento?`;
  }
  // ... outros casos
}
```

## 🎨 **INTERFACE: ChatWidget.tsx**

### 💬 **COMPONENTE PRINCIPAL:**
```typescript
interface Message {
  id: number;
  type: 'user' | 'bot';
  text: string;
  time: string;
}

interface ConversationContext {
  clientName?: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  currentStep: number;
  leadScore?: number;
}
```

### 📡 **CHAMADA DA API:**
```typescript
const sendMessage = async () => {
  try {
    const response = await fetch('/api/agente', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: context.clientName || 'Cliente Chat',
        email: 'cliente@chat.com',
        mensagem: inputText,
        tipoServico: context.projectType || ''
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      addMessage('bot', result.resposta);
      updateContext(result);
    } else {
      // Fallback do ChatWidget
      const fallback = getIntelligentFallback(inputText, context);
      addMessage('bot', fallback);
    }
  } catch (error) {
    // Fallback em caso de erro
    const fallback = getIntelligentFallback(inputText, context);
    addMessage('bot', fallback);
  }
};
```

## 🔧 **API: agente.js**

### 📋 **ENDPOINT PRINCIPAL:**
```javascript
export default async function handler(req, res) {
  // Validação
  const { nome, email, mensagem, tipoServico } = req.body;
  
  // Processamento
  const sara = new SaraAI();
  const resultado = await sara.processMessage(mensagem, {
    nome, email, tipoServico
  });
  
  // Resposta
  return res.json({
    success: resultado.success,
    resposta: resultado.response,
    leadScore: resultado.leadScore,
    proximaAcao: resultado.nextAction,
    agenteAtivo: resultado.activeAgent
  });
}
```

### 🔄 **FALLBACK DA API:**
```javascript
} catch (error) {
  // Fallback quando Sara AI falha
  const fallbackResponse = getIntelligentFallback(mensagem, userInfo);
  
  return res.json({
    success: true,
    resposta: fallbackResponse,
    leadScore: calculateFallbackLeadScore(mensagem),
    fallback: true
  });
}
```

## 🧪 **SISTEMA DE TESTES**

### 📋 **TESTES PRINCIPAIS:**
```javascript
// test-sara-completo.js - Teste geral
// test-sara-inteligente.js - Análise de intenção  
// test-sara-humanizada.js - Perguntas pessoais
// test-sara-especificacoes.js - Projetos específicos
// test-api-funcionamento.js - Diagnóstico técnico
```

### 🔍 **EXEMPLO DE TESTE:**
```javascript
async function testSaraIntelligence() {
  const sara = new SaraAI();
  
  // Teste especificação
  const result = await sara.processMessage(
    "quero uma loja online de roupas multimarcas"
  );
  
  console.log(`Resposta: ${result.response}`);
  console.log(`Score: ${result.leadScore}/4`);
  console.log(`Agente: ${result.activeAgent}`);
}
```

## ⚙️ **CONFIGURAÇÕES**

### 🔑 **VARIÁVEIS DE AMBIENTE:**
```bash
# .env
GEMINI_API_KEY=sua_chave_gemini
GROK_API_KEY=sua_chave_grok  
OPENAI_API_KEY=sua_chave_openai
```

### 📊 **MONITORAMENTO:**
```javascript
// Logs automáticos
console.log(`🎯 Processando: ${intention.priority} | ${intention.type}`);
console.log(`✅ Resposta: ${agentType} | Score: ${leadScore}`);
console.log(`🔄 Fallback ativo para: ${message}`);
```

## 🚀 **DEPLOY E PRODUÇÃO**

### 📦 **BUILD:**
```bash
npm run build
npm run start
```

### 🔄 **MONITORAMENTO:**
- Logs de conversas em tempo real
- Métricas de performance das APIs
- Taxa de conversão por tipo de lead
- Análise de sentimento dos clientes

### 🛡️ **SEGURANÇA:**
- Validação de entrada rigorosa
- Rate limiting por IP
- Sanitização de dados
- Logs de auditoria

## 💡 **BOAS PRÁTICAS**

### ✅ **DESENVOLVIMENTO:**
- Sempre testar com `node test/test-sara-completo.js`
- Manter fallbacks atualizados
- Logs detalhados para debug
- Versionamento das personas

### 🔧 **MANUTENÇÃO:**
- Monitorar taxa de sucesso das APIs
- Atualizar respostas baseado em feedback
- A/B testing de novas funcionalidades
- Backup regular das configurações

### 📈 **OTIMIZAÇÃO:**
- Análise de conversas para melhorar detecção
- Ajuste de lead scoring baseado em conversões
- Personalização por segmento de cliente
- Integração com CRM para follow-up

---

**A Sara é um sistema robusto, inteligente e escalável que combina IA avançada com metodologias de vendas comprovadas para maximizar conversões.** 🚀✨