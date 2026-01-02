/**
 * SARA AI 2.0 - Sistema Completo
 *
 * Assistente de vendas inteligente com:
 * - Modelos state-of-the-art (Claude 3.5 Sonnet, GPT-4o, Gemini 2.0)
 * - Prompts estruturados de classe mundial
 * - Few-shot learning
 * - Gestão de contexto avançada
 * - Metodologias de vendas adaptativas
 */

import { MultiAPIManagerV2 } from './api-manager-v2.js';
import { buildMasterPrompt, extractJSON } from '../prompts/master-prompt.js';
import { createIntentAnalyzer } from './intent-analyzer.js';
import { getKnowledgeBase } from '../utils/knowledge-base.js';
import { buildDynamicContext, formatContextForPrompt } from '../utils/context-builder.js';
import { getAnalyticsTracker } from '../utils/analytics-tracker.js';

export class SaraAIv2 {
  constructor() {
    this.apiManager = new MultiAPIManagerV2();
    this.intentAnalyzer = createIntentAnalyzer(this.apiManager, 'hybrid');
    this.knowledgeBase = getKnowledgeBase();
    this.analytics = getAnalyticsTracker();

    // Valida se tem pelo menos um modelo moderno
    if (!this.apiManager.hasModernModels()) {
      console.warn('⚠️ AVISO: Nenhum modelo moderno configurado!');
      console.warn('Sara 2.0 funciona melhor com Claude 3.5 Sonnet, GPT-4o ou Gemini 2.0');
      console.warn('Configure ANTHROPIC_API_KEY, OPENAI_API_KEY ou GOOGLE_API_KEY');
    }

    console.log('✅ Sara AI 2.0 inicializada');
    console.log('📊 API Manager:', this.apiManager.getStats());
    console.log('📚 Knowledge Base:', this.knowledgeBase.getStats());
    console.log('📈 Analytics Tracker: Ativo');
  }

  /**
   * Processa mensagem do usuário
   *
   * @param {string} userMessage - Mensagem do usuário
   * @param {Object} userInfo - Informações do usuário { nome, email, tipoServico, etc }
   * @param {Array} chatHistory - Histórico da conversa [{ role: 'user'|'assistant', content: '...' }]
   * @returns {Object} - Resultado { success, response, leadScore, nextAction, etc }
   */
  async processMessage(userMessage, userInfo = {}, chatHistory = []) {
    try {
      console.log(`\n🔵 Nova mensagem: "${userMessage.substring(0, 50)}..."`);

      // 1. Analisa intenção da mensagem (híbrido: regras + LLM se necessário)
      const intentAnalysis = await this.intentAnalyzer.analyze(userMessage, {
        mensagens_trocadas: chatHistory.length,
        score: userInfo.leadScore || 0
      });

      console.log(`🎯 Intenção: ${intentAnalysis.intent} | Metodologia: ${intentAnalysis.methodology} | Confiança: ${intentAnalysis.confidence}%`);

      // 2. Constrói contexto dinâmico estruturado
      const dynamicContext = buildDynamicContext({
        userMessage,
        chatHistory,
        leadData: userInfo,
        intentAnalysis,
        knowledgeBase: this.knowledgeBase
      });

      console.log(`📊 Estágio: ${dynamicContext.stage.name} | Lead Score: ${dynamicContext.lead.leadScore}/4 ${dynamicContext.lead.classification.emoji}`);

      // 3. Verifica regras de prioridade máxima (respostas diretas)
      const maxPriority = this.knowledgeBase.checkMaxPriorityTriggers(userMessage);
      if (maxPriority) {
        console.log(`⚡ Prioridade máxima detectada: ${maxPriority.description}`);
      }

      // 4. Constrói prompt mestre com contexto enriquecido
      const messages = buildMasterPrompt({
        userMessage,
        chatHistory,
        leadData: userInfo,
        context: dynamicContext
      });

      // 5. Invoca LLM de alta performance com fallback automático
      const result = await this.apiManager.invokeWithFallback(messages, {
        preferredModel: null, // Usa ordem de prioridade padrão
        fastMode: false, // Modo conversação completa
        maxRetries: 3
      });

      console.log(`✅ Resposta obtida com ${result.modelUsed} (custo estimado: $${result.cost.toFixed(4)})`);

      // 6. Extrai e valida JSON
      const parsed = extractJSON(result.content);

      // 7. Calcula lead score (merge dados extraídos com dados existentes)
      const leadScore = this.calculateLeadScore(parsed.dados_extraidos, chatHistory);

      // 8. Determina próxima ação (override se necessário)
      const nextAction = this.determineNextAction(leadScore, parsed.proxima_acao);

      // 9. Prepara resultado estruturado
      const resultData = {
        success: true,
        response: parsed.resposta,
        leadScore: leadScore,
        nextAction: nextAction,
        methodology: parsed.metodologia_aplicada,
        extractedData: parsed.dados_extraidos || {},
        conversationStage: dynamicContext.stage.name,
        modelUsed: result.modelUsed,
        cost: result.cost,
        intentAnalysis: intentAnalysis,
        contextMetrics: dynamicContext.metrics,
        data: {
          response: parsed.resposta,
          sentiment: this.analyzeSentiment(parsed.resposta),
          suggested_actions: this.generateSuggestedActions(leadScore, nextAction)
        }
      };

      // 10. Registra interação no Analytics (para relatórios e ROI)
      const sessionId = userInfo.sessionId || userInfo.email || userInfo.nome || 'anonymous';
      this.trackInteraction(sessionId, userMessage, resultData, userInfo);

      return resultData;

    } catch (error) {
      console.error('❌ Erro no processamento Sara v2:', error);

      // Fallback inteligente
      return this.getIntelligentFallback(userMessage, userInfo);
    }
  }

  /**
   * Calcula lead score baseado em critérios BANT
   */
  calculateLeadScore(extractedData, chatHistory) {
    let score = 0;

    // Budget (Orçamento)
    if (extractedData.orcamento) {
      score += 1;
    }

    // Authority (Autoridade - assume que quem preenche tem)
    if (extractedData.nome && extractedData.email) {
      score += 1;
    }

    // Need (Necessidade)
    if (extractedData.tipo_projeto || extractedData.negocio) {
      score += 1;
    }

    // Timeline (Prazo)
    if (extractedData.prazo) {
      score += 1;
    }

    return Math.min(score, 4);
  }

  /**
   * Determina próxima ação baseada no lead score
   */
  determineNextAction(leadScore, suggestedAction) {
    // Se IA sugeriu ação específica e faz sentido, usa
    const validActions = ['descobrir_necessidade', 'qualificar', 'apresentar_solucao', 'nutrir', 'fechar', 'agendar'];
    if (validActions.includes(suggestedAction)) {
      return suggestedAction;
    }

    // Fallback baseado em score
    if (leadScore >= 3) return 'fechar';
    if (leadScore >= 2) return 'qualificar';
    return 'descobrir_necessidade';
  }

  /**
   * Determina estágio da conversa
   */
  determineStage(leadScore, messageCount) {
    if (leadScore >= 3) return 'qualified_hot';
    if (leadScore >= 2) return 'qualified_warm';
    if (messageCount > 5) return 'nurturing';
    if (messageCount > 2) return 'discovery';
    return 'initial';
  }

  /**
   * Análise de sentimento básica
   */
  analyzeSentiment(response) {
    const lowerResponse = response.toLowerCase();

    // Positivo: emojis, palavras positivas
    if (lowerResponse.match(/😊|🚀|✨|💡|perfeito|ótimo|excelente|incrível/)) {
      return 'positive';
    }

    // Neutro: informativo
    if (lowerResponse.includes('?') || lowerResponse.match(/me conta|poderia|gostaria/)) {
      return 'neutral';
    }

    return 'positive'; // Default positivo
  }

  /**
   * Gera ações sugeridas para o frontend
   */
  generateSuggestedActions(leadScore, nextAction) {
    const actions = [];

    if (leadScore >= 3) {
      actions.push('Solicitar Proposta');
      actions.push('Agendar Call');
      actions.push('Falar no WhatsApp');
    } else if (leadScore >= 2) {
      actions.push('Ver Portfólio');
      actions.push('Conhecer Serviços');
      actions.push('Tirar Dúvidas');
    } else {
      actions.push('Ver Exemplos');
      actions.push('Saber Mais');
      actions.push('Falar com Sara');
    }

    return actions.slice(0, 2); // Retorna no máximo 2
  }

  /**
   * Registra interação no Analytics para relatórios e ROI
   */
  trackInteraction(sessionId, userMessage, result, userInfo) {
    try {
      // Verifica se sessão existe, senão cria
      if (!this.analytics.sessions.has(sessionId)) {
        this.analytics.startSession(sessionId, {
          userAgent: 'web',
          source: 'chat_widget',
          initialLeadData: userInfo
        });
      }

      // Registra a interação
      this.analytics.trackInteraction(sessionId, {
        userMessage,
        response: result.response,
        leadScore: result.leadScore,
        conversationStage: result.conversationStage,
        methodology: result.methodology,
        intentAnalysis: result.intentAnalysis,
        extractedData: result.extractedData,
        cost: result.cost
      });

      console.log(`📈 Interação registrada para analytics`);
    } catch (error) {
      console.warn('⚠️ Erro ao registrar analytics:', error.message);
    }
  }

  /**
   * Finaliza sessão e registra outcome
   */
  finishSession(sessionId, outcome = 'unknown') {
    try {
      this.analytics.endSession(sessionId, outcome);
      console.log(`✅ Sessão finalizada: ${sessionId} | Outcome: ${outcome}`);
    } catch (error) {
      console.warn('⚠️ Erro ao finalizar sessão:', error.message);
    }
  }

  /**
   * Retorna métricas de performance
   */
  getPerformanceMetrics() {
    return this.analytics.getDashboardData();
  }

  /**
   * Gera relatório completo
   */
  generateReport() {
    return this.analytics.generatePerformanceReport();
  }

  /**
   * Fallback inteligente quando IA não está disponível
   */
  getIntelligentFallback(userMessage, userInfo) {
    const lowerMsg = userMessage.toLowerCase();
    const nome = userInfo.nome || 'Cliente';

    let resposta = '';

    // Respostas NATURAIS e CONVERSACIONAIS (não listas formatadas!)
    if (lowerMsg.includes('preço') || lowerMsg.includes('valor') || lowerMsg.includes('custa')) {
      resposta = `Oi! Fico feliz em te ajudar! 😊\n\n` +
        `Depende bastante do tipo de site. Por exemplo, uma landing page simples sai por uns R$ 500-1.000. ` +
        `Agora se for uma loja online completa, aí já vai pra casa dos R$ 1.200-2.500.\n\n` +
        `Me conta: é para qual tipo de negócio? Assim consigo te dar um valor mais certinho.`;
    } else if (lowerMsg.includes('site') || lowerMsg.includes('landing') || lowerMsg.includes('loja')) {
      resposta = `Legal! Posso te ajudar com isso sim! 🚀\n\n` +
        `Me conta um pouquinho: que tipo de negócio você tem? ` +
        `É pra vender produtos, captar leads ou mais pra mostrar seu trabalho?\n\n` +
        `Com isso consigo te indicar a melhor opção e um orçamento bacana!`;
    } else if (lowerMsg.includes('oi') || lowerMsg.includes('olá') || lowerMsg.includes('ola') || lowerMsg.includes('boa')) {
      resposta = `Oi! Que bom te ver por aqui! 😊\n\n` +
        `Sou a Sara, ajudo pessoas a transformarem seus negócios na internet.\n\n` +
        `Como posso te ajudar hoje?`;
    } else {
      resposta = `Oi! 😊\n\n` +
        `Me conta: o que você precisa? Tô aqui pra te ajudar!`;
    }

    return {
      success: true,
      response: resposta,
      leadScore: 0,
      nextAction: 'descobrir_necessidade',
      methodology: 'fallback',
      extractedData: {},
      conversationStage: 'initial',
      modelUsed: 'fallback',
      cost: 0,
      data: {
        response: resposta,
        sentiment: 'neutral',
        suggested_actions: ['Ver Serviços', 'Falar com Sara']
      },
      isFallback: true
    };
  }

  /**
   * Estatísticas da Sara 2.0
   */
  getStats() {
    return this.apiManager.getStats();
  }

  /**
   * Valida se Sara está pronta para uso
   */
  isReady() {
    const stats = this.getStats();
    return stats.totalModels > 0;
  }

  /**
   * Valida se está usando modelos modernos
   */
  isUsingModernModels() {
    return this.apiManager.hasModernModels();
  }
}

// Exporta também para compatibilidade
export { MultiAPIManagerV2 };
