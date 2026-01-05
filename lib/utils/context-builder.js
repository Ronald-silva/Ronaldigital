/**
 * CONTEXT BUILDER - Construtor de Contexto Otimizado
 *
 * Estrutura o contexto da conversa de forma inteligente para o LLM,
 * incluindo histórico, perfil do lead, análise de intenção, e sugestões.
 */

import { buildSalesContext, generateSalesInsights } from './sales-intelligence.js';

/**
 * Constrói contexto completo da conversa
 *
 * @param {Object} params - Parâmetros
 * @param {string} params.userMessage - Mensagem atual do usuário
 * @param {Array} params.chatHistory - Histórico de mensagens
 * @param {Object} params.leadData - Dados do lead
 * @param {Object} params.intentAnalysis - Análise de intenção
 * @param {Object} params.knowledgeBase - Base de conhecimento
 * @returns {Object} - Contexto estruturado
 */
export function buildDynamicContext({
  userMessage,
  chatHistory = [],
  leadData = {},
  intentAnalysis = null,
  knowledgeBase = null,
  productRecommendation = null
}) {
  // 🔥 NOVO: Constrói contexto de vendas de classe mundial
  const salesContext = buildSalesContext(
    userMessage,
    chatHistory.map(msg => msg.content || ''),
    leadData,
    productRecommendation
  );

  const salesInsights = generateSalesInsights(salesContext);

  return {
    // Informações da mensagem atual
    current: {
      message: userMessage,
      length: userMessage.length,
      hasQuestion: userMessage.includes('?'),
      hasExclamation: userMessage.includes('!'),
      intent: intentAnalysis || { intent: 'unknown', confidence: 0 }
    },

    // Histórico estruturado (últimas 15 mensagens)
    history: buildHistoryContext(chatHistory),

    // Perfil do lead (dados coletados)
    lead: buildLeadProfile(leadData, chatHistory),

    // Estágio da conversa
    stage: determineConversationStage(leadData, chatHistory),

    // Recomendação inteligente de produto (NOVO!)
    productRecommendation: productRecommendation,

    // 🏆 SALES INTELLIGENCE - CLASSE MUNDIAL (NOVO!)
    sales: {
      persona: salesContext.persona,
      objection: salesContext.objection,
      framework: salesContext.framework,
      roi: salesContext.roi,
      insights: salesInsights
    },

    // Sugestões estratégicas (agora com recomendação de produto)
    strategy: buildStrategyHints(leadData, chatHistory, intentAnalysis, knowledgeBase, productRecommendation),

    // Métricas da conversa
    metrics: buildConversationMetrics(chatHistory, leadData)
  };
}

/**
 * Constrói histórico estruturado
 */
function buildHistoryContext(chatHistory) {
  if (chatHistory.length === 0) {
    return {
      isEmpty: true,
      count: 0,
      recent: []
    };
  }

  // Pega últimas 15 mensagens (contexto suficiente sem poluir)
  const recent = chatHistory.slice(-15);

  // Formata mensagens
  const formatted = recent.map((msg, idx) => ({
    index: idx + 1,
    role: msg.role === 'user' ? 'Cliente' : 'Sara',
    content: msg.content,
    timestamp: msg.timestamp || null
  }));

  // Extrai informações importantes do histórico
  const userMessages = recent.filter(m => m.role === 'user');
  const saraMessages = recent.filter(m => m.role === 'assistant');

  return {
    isEmpty: false,
    count: recent.length,
    recent: formatted,
    userMessageCount: userMessages.length,
    saraMessageCount: saraMessages.length,
    lastUserMessage: userMessages[userMessages.length - 1]?.content || null,
    lastSaraMessage: saraMessages[saraMessages.length - 1]?.content || null
  };
}

/**
 * Constrói perfil do lead
 */
function buildLeadProfile(leadData, chatHistory) {
  // Extrai informações fornecidas
  const profile = {
    nome: leadData.nome || null,
    email: leadData.email || null,
    telefone: leadData.telefone || null,
    tipoServico: leadData.tipoServico || null,
    orcamento: leadData.orcamento || null,
    prazo: leadData.prazo || null,
    negocio: leadData.negocio || null,
    leadScore: leadData.leadScore || 0
  };

  // Calcula completeness
  const fieldsProvided = Object.values(profile).filter(v => v !== null && v !== 0).length;
  const totalFields = 7; // Campos relevantes (excluindo leadScore do count)
  profile.completeness = Math.round((fieldsProvided / totalFields) * 100);

  // Determina missing fields
  profile.missingFields = [];
  if (!profile.nome) profile.missingFields.push('nome');
  if (!profile.email) profile.missingFields.push('email');
  if (!profile.tipoServico) profile.missingFields.push('tipo_servico');
  if (!profile.orcamento) profile.missingFields.push('orcamento');
  if (!profile.prazo) profile.missingFields.push('prazo');

  // Classifica lead
  profile.classification = classifyLead(profile.leadScore);

  return profile;
}

/**
 * Classifica lead baseado no score
 */
function classifyLead(score) {
  if (score >= 3) return { level: 'QUENTE', emoji: '🔥', action: 'fechar' };
  if (score >= 2) return { level: 'MORNO', emoji: '🌡️', action: 'qualificar' };
  return { level: 'FRIO', emoji: '❄️', action: 'nutrir' };
}

/**
 * Determina estágio da conversa
 */
function determineConversationStage(leadData, chatHistory) {
  const messageCount = chatHistory.length;
  const leadScore = leadData.leadScore || 0;

  // Estágios:
  // 1. Inicial (0-2 msgs)
  // 2. Discovery (3-5 msgs, score < 2)
  // 3. Qualification (score >= 2)
  // 4. Closing (score >= 3)
  // 5. Nurturing (> 5 msgs, score < 2)

  if (leadScore >= 3) {
    return {
      name: 'closing',
      description: 'Fechamento de venda',
      priority: 'Pedir dados para proposta e agendar'
    };
  }

  if (leadScore >= 2) {
    return {
      name: 'qualification',
      description: 'Qualificação ativa',
      priority: 'Completar critérios BANT'
    };
  }

  if (messageCount === 0) {
    return {
      name: 'initial',
      description: 'Primeiro contato',
      priority: 'Cumprimentar e descobrir necessidade'
    };
  }

  if (messageCount <= 5) {
    return {
      name: 'discovery',
      description: 'Descoberta de necessidades',
      priority: 'Aplicar SPIN para entender problema'
    };
  }

  return {
    name: 'nurturing',
    description: 'Nutrição de lead',
    priority: 'Demonstrar valor e construir relacionamento'
  };
}

/**
 * Constrói dicas estratégicas
 */
function buildStrategyHints(leadData, chatHistory, intentAnalysis, knowledgeBase, productRecommendation) {
  const hints = {
    recommendedMethodology: 'spin',
    shouldAsk: [],
    shouldAvoid: [],
    opportunities: [],
    recommendedProduct: null,
    caseStudiesToMention: []
  };

  // 🔥 NOVO: Recomendação inteligente de produto
  if (productRecommendation && productRecommendation.recommendation) {
    const rec = productRecommendation.recommendation;

    if (rec.recommendation_type === 'confident') {
      hints.recommendedProduct = rec.primary_product;
      hints.opportunities.push(`Recomendar ${rec.primary_product.name} - ${rec.primary_product.why_recommended}`);

      // Cases relevantes
      if (rec.relevant_case_studies && rec.relevant_case_studies.length > 0) {
        hints.caseStudiesToMention = rec.relevant_case_studies.map(c => c.name);
        hints.opportunities.push(`Mencionar case: ${rec.relevant_case_studies[0].name}`);
      }

      // Upsells
      if (rec.upsell_opportunities && rec.upsell_opportunities.length > 0) {
        hints.opportunities.push(`Upsell: ${rec.upsell_opportunities[0].product}`);
      }

      // Objeções a endereçar
      if (rec.objections_to_address && rec.objections_to_address.length > 0) {
        rec.objections_to_address.forEach(obj => {
          hints.shouldAvoid.push(`Não ignorar objeção: ${obj.objection}`);
          hints.opportunities.push(`Endereçar: ${obj.response.substring(0, 80)}...`);
        });
      }

      // Produto alternativo
      if (rec.alternative_product) {
        hints.opportunities.push(`Alternativa: ${rec.alternative_product.name}`);
      }
    } else if (rec.recommendation_type === 'need_qualification') {
      hints.shouldAsk.push(...(rec.suggested_questions || []).slice(0, 2));
      hints.opportunities.push('Cliente precisa de qualificação adicional');
    } else if (rec.recommendation_type === 'out_of_scope') {
      hints.shouldAvoid.push('vender_servico_fora_escopo');
      hints.opportunities.push(`Fora do escopo: ${rec.reason} - Indicar parceiros`);
    }
  }

  // Baseado na intenção
  if (intentAnalysis) {
    hints.recommendedMethodology = intentAnalysis.methodology || 'spin';

    if (intentAnalysis.intent === 'pedido_orcamento') {
      hints.shouldAsk.push('tipo_servico', 'prazo');
      hints.opportunities.push('Lead quente - foque em BANT');
    }

    if (intentAnalysis.intent === 'objecao') {
      hints.shouldAvoid.push('insistir_preco');
      hints.opportunities.push('Demonstre valor ROI');
    }
  }

  // Baseado no perfil
  const profile = buildLeadProfile(leadData, chatHistory);

  if (!profile.nome && chatHistory.length >= 2) {
    hints.shouldAsk.push('nome');
  }

  if (!profile.email && profile.leadScore >= 2) {
    hints.shouldAsk.push('email');
  }

  if (!profile.tipoServico) {
    hints.shouldAsk.push('tipo_servico');
  }

  // Baseado no estágio
  const stage = determineConversationStage(leadData, chatHistory);

  if (stage.name === 'closing') {
    hints.opportunities.push('Lead pronto para fechar - solicite dados e agende');
  }

  if (stage.name === 'nurturing') {
    hints.opportunities.push('Demonstre casos de sucesso');
  }

  // Verifica regras da Knowledge Base
  if (knowledgeBase) {
    const maxPriority = knowledgeBase.checkMaxPriorityTriggers(chatHistory[chatHistory.length - 1]?.content || '');
    if (maxPriority) {
      hints.opportunities.push(`Prioridade máxima: ${maxPriority.description}`);
    }
  }

  return hints;
}

/**
 * Constrói métricas da conversa
 */
function buildConversationMetrics(chatHistory, leadData) {
  const userMessages = chatHistory.filter(m => m.role === 'user');
  const saraMessages = chatHistory.filter(m => m.role === 'assistant');

  // Calcula tempo médio de resposta (se timestamps disponíveis)
  let avgResponseTime = null;
  if (chatHistory.length > 1) {
    const responseTimes = [];
    for (let i = 1; i < chatHistory.length; i++) {
      if (chatHistory[i].timestamp && chatHistory[i-1].timestamp) {
        const diff = new Date(chatHistory[i].timestamp) - new Date(chatHistory[i-1].timestamp);
        responseTimes.push(diff);
      }
    }
    if (responseTimes.length > 0) {
      avgResponseTime = Math.round(responseTimes.reduce((a, b) => a + b) / responseTimes.length / 1000); // segundos
    }
  }

  // Engajamento (questões feitas por Sara)
  const questionsAsked = saraMessages.filter(m => m.content?.includes('?')).length;

  return {
    totalMessages: chatHistory.length,
    userMessages: userMessages.length,
    saraMessages: saraMessages.length,
    questionsAskedBySara: questionsAsked,
    avgResponseTimeSeconds: avgResponseTime,
    leadScore: leadData.leadScore || 0,
    conversationDepth: chatHistory.length > 0 ? Math.min(Math.round(chatHistory.length / 2), 5) : 0, // 0-5
    engagementLevel: questionsAsked > 0 ? 'active' : 'passive'
  };
}

/**
 * Formata contexto para inclusão no prompt
 */
export function formatContextForPrompt(context) {
  let formatted = '\n## CONTEXTO DA CONVERSA\n\n';

  // Estágio
  formatted += `**Estágio:** ${context.stage.name} (${context.stage.description})\n`;
  formatted += `**Prioridade:** ${context.stage.priority}\n\n`;

  // Perfil do Lead
  formatted += `**Perfil do Cliente:**\n`;
  if (context.lead.nome) formatted += `- Nome: ${context.lead.nome}\n`;
  if (context.lead.email) formatted += `- Email: ${context.lead.email}\n`;
  if (context.lead.tipoServico) formatted += `- Interesse: ${context.lead.tipoServico}\n`;
  if (context.lead.orcamento) formatted += `- Orçamento: ${context.lead.orcamento}\n`;
  if (context.lead.prazo) formatted += `- Prazo: ${context.lead.prazo}\n`;
  if (context.lead.negocio) formatted += `- Negócio: ${context.lead.negocio}\n`;
  formatted += `- Lead Score: ${context.lead.leadScore}/4 ${context.lead.classification.emoji}\n`;
  formatted += `- Completude: ${context.lead.completeness}%\n\n`;

  // Estratégia
  if (context.strategy.shouldAsk.length > 0) {
    formatted += `**Deve Perguntar:** ${context.strategy.shouldAsk.join(', ')}\n`;
  }
  if (context.strategy.opportunities.length > 0) {
    formatted += `**Oportunidades:** ${context.strategy.opportunities.join('; ')}\n`;
  }
  formatted += `**Metodologia Recomendada:** ${context.strategy.recommendedMethodology.toUpperCase()}\n\n`;

  // Histórico
  if (!context.history.isEmpty) {
    formatted += `**Histórico (últimas ${Math.min(context.history.count, 5)} mensagens):**\n`;
    const recentHistory = context.history.recent.slice(-5);
    recentHistory.forEach(msg => {
      formatted += `${msg.index}. ${msg.role}: ${msg.content.substring(0, 100)}${msg.content.length > 100 ? '...' : ''}\n`;
    });
  }

  return formatted;
}

/**
 * Sugere próxima pergunta baseada no contexto
 */
export function suggestNextQuestion(context, knowledgeBase) {
  const { lead, stage, strategy } = context;

  // Se deve fechar, pede dados
  if (stage.name === 'closing') {
    if (!lead.email) return "Qual seu email para eu enviar a proposta?";
    if (!lead.telefone) return "Qual seu WhatsApp para agendarmos uma call rápida?";
    return "Posso agendar uma call de 15min para detalharmos tudo?";
  }

  // Se precisa qualificar BANT
  if (stage.name === 'qualification') {
    const bant = knowledgeBase?.getBANTQuestions() || {};
    if (!lead.orcamento) return bant.budget;
    if (!lead.prazo) return bant.timeline;
    if (!lead.tipoServico) return bant.need;
    return null;
  }

  // Se está em discovery (SPIN)
  if (stage.name === 'discovery') {
    const spin = knowledgeBase?.getSPINQuestions() || {};
    if (context.history.userMessageCount === 1) return spin.situacao;
    if (context.history.userMessageCount === 2) return spin.problema;
    if (context.history.userMessageCount === 3) return spin.implicacao;
    return spin.necessidade_solucao;
  }

  return null;
}
