/**
 * ANALYTICS TRACKER - Sistema de Métricas e Performance
 *
 * Rastreia todas as interações da Sara para gerar relatórios de performance,
 * calcular ROI e criar cases de sucesso.
 *
 * Métricas rastreadas:
 * - Taxa de conversão (lead → cliente)
 * - Qualidade de leads (score BANT)
 * - Tempo de resposta
 * - Engajamento (nº mensagens)
 * - Sentimento das conversas
 * - Metodologias mais efetivas
 * - ROI calculado
 */

import fs from 'fs';
import path from 'path';

export class AnalyticsTracker {
  constructor() {
    this.sessions = new Map();
    this.globalStats = this.loadGlobalStats();
    this.metricsFile = path.join(process.cwd(), 'analytics', 'metrics.json');
    this.conversationsFile = path.join(process.cwd(), 'analytics', 'conversations.json');

    // Garante que diretório existe
    this.ensureAnalyticsDir();
  }

  ensureAnalyticsDir() {
    const analyticsDir = path.join(process.cwd(), 'analytics');
    if (!fs.existsSync(analyticsDir)) {
      fs.mkdirSync(analyticsDir, { recursive: true });
    }
  }

  /**
   * Inicia uma nova sessão de conversa
   */
  startSession(sessionId, metadata = {}) {
    this.sessions.set(sessionId, {
      id: sessionId,
      startTime: new Date(),
      endTime: null,
      metadata,
      messages: [],
      leadData: {},
      leadScore: 0,
      intents: [],
      methodologies: [],
      conversationStage: 'initial',
      outcome: null, // 'converted', 'nurturing', 'lost'
      cost: 0
    });

    console.log(`📊 Analytics: Nova sessão iniciada - ${sessionId}`);
  }

  /**
   * Registra uma interação da Sara
   */
  trackInteraction(sessionId, interaction) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      console.warn(`⚠️ Sessão ${sessionId} não encontrada`);
      return;
    }

    // Registra mensagem
    session.messages.push({
      timestamp: new Date(),
      userMessage: interaction.userMessage,
      saraResponse: interaction.response,
      intent: interaction.intentAnalysis?.intent,
      methodology: interaction.methodology,
      leadScore: interaction.leadScore,
      stage: interaction.conversationStage,
      cost: interaction.cost || 0
    });

    // Atualiza dados da sessão
    session.leadScore = interaction.leadScore || 0;
    session.conversationStage = interaction.conversationStage || 'unknown';
    session.cost += interaction.cost || 0;

    if (interaction.intentAnalysis) {
      session.intents.push(interaction.intentAnalysis.intent);
    }

    if (interaction.methodology) {
      session.methodologies.push(interaction.methodology);
    }

    // Atualiza lead data
    if (interaction.extractedData) {
      session.leadData = { ...session.leadData, ...interaction.extractedData };
    }

    console.log(`📊 Interação registrada - Score: ${session.leadScore}/4 | Estágio: ${session.conversationStage}`);
  }

  /**
   * Finaliza uma sessão
   */
  endSession(sessionId, outcome = 'unknown') {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.endTime = new Date();
    session.outcome = outcome;

    // Calcula métricas da sessão
    const metrics = this.calculateSessionMetrics(session);

    // Salva conversação
    this.saveConversation(session, metrics);

    // Atualiza estatísticas globais
    this.updateGlobalStats(session, metrics);

    console.log(`✅ Sessão finalizada - ${sessionId} | Outcome: ${outcome} | Score: ${session.leadScore}/4`);

    // Remove da memória (mas já salvou)
    this.sessions.delete(sessionId);
  }

  /**
   * Calcula métricas de uma sessão
   */
  calculateSessionMetrics(session) {
    const duration = session.endTime
      ? (session.endTime - session.startTime) / 1000 / 60 // minutos
      : 0;

    const messageCount = session.messages.length;
    const avgResponseTime = 2; // Placeholder - seria calculado com timestamps reais

    // Identifica metodologia mais usada
    const methodologyCount = {};
    session.methodologies.forEach(m => {
      methodologyCount[m] = (methodologyCount[m] || 0) + 1;
    });
    const dominantMethodology = Object.keys(methodologyCount).reduce((a, b) =>
      methodologyCount[a] > methodologyCount[b] ? a : b, 'unknown'
    );

    // Classifica qualidade do lead
    const leadQuality = session.leadScore >= 3 ? 'hot' :
                       session.leadScore >= 2 ? 'warm' : 'cold';

    return {
      duration,
      messageCount,
      avgResponseTime,
      leadScore: session.leadScore,
      leadQuality,
      dominantMethodology,
      totalCost: session.cost,
      outcome: session.outcome,
      intentsDetected: [...new Set(session.intents)],
      hasEmail: !!session.leadData.email,
      hasPhone: !!session.leadData.telefone,
      projectType: session.leadData.tipo_projeto || 'unknown'
    };
  }

  /**
   * Salva conversação completa
   */
  saveConversation(session, metrics) {
    const conversations = this.loadConversations();

    conversations.push({
      id: session.id,
      date: session.startTime.toISOString(),
      duration: metrics.duration,
      messages: session.messages.map(m => ({
        timestamp: m.timestamp.toISOString(),
        user: m.userMessage,
        sara: m.saraResponse,
        intent: m.intent,
        score: m.leadScore
      })),
      leadData: session.leadData,
      metrics,
      outcome: session.outcome
    });

    // Mantém últimas 100 conversas
    if (conversations.length > 100) {
      conversations.shift();
    }

    this.saveToFile(this.conversationsFile, conversations);
  }

  /**
   * Atualiza estatísticas globais
   */
  updateGlobalStats(session, metrics) {
    const stats = this.globalStats;

    // Incrementa contadores
    stats.totalSessions += 1;
    stats.totalMessages += metrics.messageCount;
    stats.totalCost += metrics.totalCost;

    // Leads por qualidade
    stats.leadsByQuality[metrics.leadQuality] = (stats.leadsByQuality[metrics.leadQuality] || 0) + 1;

    // Outcomes
    stats.outcomes[metrics.outcome] = (stats.outcomes[metrics.outcome] || 0) + 1;

    // Metodologias
    stats.methodologies[metrics.dominantMethodology] = (stats.methodologies[metrics.dominantMethodology] || 0) + 1;

    // Tipos de projeto
    if (metrics.projectType !== 'unknown') {
      stats.projectTypes[metrics.projectType] = (stats.projectTypes[metrics.projectType] || 0) + 1;
    }

    // Calcula médias
    stats.avgLeadScore = ((stats.avgLeadScore * (stats.totalSessions - 1)) + session.leadScore) / stats.totalSessions;
    stats.avgMessagesPerSession = stats.totalMessages / stats.totalSessions;
    stats.avgDuration = ((stats.avgDuration * (stats.totalSessions - 1)) + metrics.duration) / stats.totalSessions;

    // Taxa de conversão
    if (stats.outcomes.converted && stats.totalSessions > 0) {
      stats.conversionRate = (stats.outcomes.converted / stats.totalSessions) * 100;
    }

    // Salva
    this.saveGlobalStats(stats);
  }

  /**
   * Carrega estatísticas globais
   */
  loadGlobalStats() {
    try {
      if (fs.existsSync(this.metricsFile)) {
        return JSON.parse(fs.readFileSync(this.metricsFile, 'utf8'));
      }
    } catch (error) {
      console.warn('⚠️ Erro ao carregar stats, usando defaults');
    }

    return {
      totalSessions: 0,
      totalMessages: 0,
      totalCost: 0,
      avgLeadScore: 0,
      avgMessagesPerSession: 0,
      avgDuration: 0,
      conversionRate: 0,
      leadsByQuality: { hot: 0, warm: 0, cold: 0 },
      outcomes: { converted: 0, nurturing: 0, lost: 0, unknown: 0 },
      methodologies: { spin: 0, bant: 0, value_first: 0, direta: 0 },
      projectTypes: {},
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Salva estatísticas globais
   */
  saveGlobalStats(stats) {
    stats.lastUpdated = new Date().toISOString();
    this.globalStats = stats;
    this.saveToFile(this.metricsFile, stats);
  }

  /**
   * Carrega conversações
   */
  loadConversations() {
    try {
      if (fs.existsSync(this.conversationsFile)) {
        return JSON.parse(fs.readFileSync(this.conversationsFile, 'utf8'));
      }
    } catch (error) {
      console.warn('⚠️ Erro ao carregar conversas');
    }
    return [];
  }

  /**
   * Salva em arquivo
   */
  saveToFile(filePath, data) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
      console.error('❌ Erro ao salvar:', error.message);
    }
  }

  /**
   * Retorna estatísticas atuais
   */
  getStats() {
    return this.globalStats;
  }

  /**
   * Retorna dashboard data para visualização
   */
  getDashboardData() {
    const stats = this.globalStats;

    return {
      overview: {
        totalConversations: stats.totalSessions,
        totalMessages: stats.totalMessages,
        conversionRate: stats.conversionRate.toFixed(1) + '%',
        avgLeadScore: stats.avgLeadScore.toFixed(1) + '/4'
      },
      performance: {
        avgMessagesPerSession: stats.avgMessagesPerSession.toFixed(1),
        avgDuration: stats.avgDuration.toFixed(1) + ' min',
        totalCost: '$' + stats.totalCost.toFixed(2),
        costPerLead: stats.totalSessions > 0
          ? '$' + (stats.totalCost / stats.totalSessions).toFixed(2)
          : '$0.00'
      },
      leadQuality: {
        hot: stats.leadsByQuality.hot || 0,
        warm: stats.leadsByQuality.warm || 0,
        cold: stats.leadsByQuality.cold || 0
      },
      outcomes: {
        converted: stats.outcomes.converted || 0,
        nurturing: stats.outcomes.nurturing || 0,
        lost: stats.outcomes.lost || 0
      },
      topMethodology: this.getTopItem(stats.methodologies),
      topProjectType: this.getTopItem(stats.projectTypes),
      roi: this.calculateROI(stats)
    };
  }

  /**
   * Retorna item com maior contagem
   */
  getTopItem(obj) {
    const entries = Object.entries(obj);
    if (entries.length === 0) return 'N/A';
    return entries.reduce((a, b) => b[1] > a[1] ? b : a)[0];
  }

  /**
   * Calcula ROI estimado
   */
  calculateROI(stats) {
    const conversions = stats.outcomes.converted || 0;
    const avgTicket = 800; // Ticket médio em R$
    const revenue = conversions * avgTicket;
    const cost = stats.totalCost * 5; // Converte de USD para BRL (aproximado)
    const roi = cost > 0 ? ((revenue - cost) / cost * 100) : 0;

    return {
      conversions,
      revenue: 'R$ ' + revenue.toLocaleString('pt-BR'),
      cost: 'R$ ' + cost.toFixed(2),
      roi: roi.toFixed(0) + '%',
      profit: 'R$ ' + (revenue - cost).toLocaleString('pt-BR')
    };
  }

  /**
   * Gera relatório de performance
   */
  generatePerformanceReport() {
    const stats = this.globalStats;
    const dashboard = this.getDashboardData();
    const conversations = this.loadConversations();

    // Top 5 melhores conversas (maior score)
    const topConversations = conversations
      .filter(c => c.metrics.leadScore >= 3)
      .sort((a, b) => b.metrics.leadScore - a.metrics.leadScore)
      .slice(0, 5);

    return {
      generatedAt: new Date().toISOString(),
      period: {
        start: conversations[0]?.date || 'N/A',
        end: conversations[conversations.length - 1]?.date || 'N/A'
      },
      summary: dashboard,
      highlights: {
        bestConversions: topConversations.length,
        hotLeadsPercentage: stats.totalSessions > 0
          ? ((stats.leadsByQuality.hot / stats.totalSessions) * 100).toFixed(1) + '%'
          : '0%',
        mostEffectiveMethodology: dashboard.topMethodology,
        avgCostPerConversion: stats.outcomes.converted > 0
          ? '$' + (stats.totalCost / stats.outcomes.converted).toFixed(2)
          : 'N/A'
      },
      topConversations: topConversations.map(c => ({
        id: c.id,
        date: c.date,
        leadScore: c.metrics.leadScore + '/4',
        duration: c.metrics.duration.toFixed(1) + ' min',
        outcome: c.metrics.outcome,
        projectType: c.metrics.projectType
      }))
    };
  }
}

// Singleton instance
let instance = null;

export function getAnalyticsTracker() {
  if (!instance) {
    instance = new AnalyticsTracker();
  }
  return instance;
}
