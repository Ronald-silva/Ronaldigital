/**
 * KNOWLEDGE BASE - Sistema de Gerenciamento de Conhecimento
 *
 * Centraliza e gerencia todas as configurações da Sara (JSONs),
 * tornando-as facilmente acessíveis para o sistema de IA.
 *
 * Carrega:
 * - maestro.json (orquestração, prioridades, conhecimento empresa)
 * - sara_personality.json (personalidade, tom, respostas)
 * - persona_*.json (metodologias de vendas)
 */

import fs from 'fs';
import path from 'path';

export class KnowledgeBase {
  constructor() {
    this.config = {};
    this.loadAllConfigurations();
  }

  /**
   * Carrega todas as configurações dos arquivos JSON
   */
  loadAllConfigurations() {
    try {
      const dataPath = path.join(process.cwd(), 'data');

      // Carrega configurações principais
      this.config.maestro = this.loadJSON(path.join(dataPath, 'maestro.json'));
      this.config.personality = this.loadJSON(path.join(dataPath, 'sara_personality.json'));

      // Carrega personas de vendas
      this.config.personas = {
        rackham: this.loadJSON(path.join(dataPath, 'persona_rackham.json')),
        konrath: this.loadJSON(path.join(dataPath, 'persona_konrath.json')),
        vaynerchuk: this.loadJSON(path.join(dataPath, 'persona_vaynerchuk.json'))
      };

      console.log('✅ Knowledge Base carregada com sucesso');
    } catch (error) {
      console.error('❌ Erro ao carregar Knowledge Base:', error.message);
      this.loadDefaults();
    }
  }

  /**
   * Carrega um arquivo JSON
   */
  loadJSON(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      console.warn(`⚠️ Erro ao carregar ${path.basename(filePath)}:`, error.message);
      return {};
    }
  }

  /**
   * Carrega configurações padrão se os JSONs não existirem
   */
  loadDefaults() {
    console.log('⚠️ Usando configurações padrão');

    this.config = {
      maestro: {
        conhecimento_empresa: {
          servicos_oferecidos: [
            "Landing Pages (R$ 500-1.000)",
            "Portfólios (R$ 400-800)",
            "Sites/Blogs (R$ 800-2.000)",
            "E-commerce (R$ 1.200-3.000)"
          ],
          nao_oferecemos: ["Hardware", "Computadores", "Consultoria em outras áreas"],
          diferenciais: ["IA integrada", "Suporte especializado", "Parcelamento 3x"]
        }
      },
      personality: {
        personalidade: {
          core_traits: ["Confiante", "Empática", "Natural"],
          tom_de_voz: { casual: 70, formal: 30, empatia: 95 }
        }
      },
      personas: {
        rackham: { role: "Consultor SPIN", methodology: "SPIN Selling" },
        konrath: { role: "Qualificador BANT", methodology: "BANT" },
        vaynerchuk: { role: "Especialista Value-First", methodology: "Value-First" }
      }
    };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // MÉTODOS DE ACESSO - CONHECIMENTO DA EMPRESA
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Retorna conhecimento formatado da empresa para o prompt
   */
  getCompanyKnowledge() {
    const maestro = this.config.maestro;

    if (!maestro.conhecimento_empresa) {
      return this.getDefaultCompanyKnowledge();
    }

    return `
## SERVIÇOS RONALD DIGITAL
${maestro.conhecimento_empresa.servicos_oferecidos?.map(s => `- ${s}`).join('\n') || ''}

## NÃO OFERECEMOS
${maestro.conhecimento_empresa.nao_oferecemos?.map(s => `- ${s}`).join('\n') || ''}

## DIFERENCIAIS
${maestro.conhecimento_empresa.diferenciais?.map(d => `- ${d}`).join('\n') || ''}
    `.trim();
  }

  getDefaultCompanyKnowledge() {
    return `
## SERVIÇOS RONALD DIGITAL
- Landing Pages: R$ 500-1.000 (captação de leads)
- Portfólios: R$ 400-800 (credibilidade profissional)
- Sites/Blogs: R$ 800-2.000 (autoridade e SEO)
- E-commerce: R$ 1.200-3.000 (vendas online)

## DIFERENCIAIS
- IA integrada para otimização
- Suporte especializado
- Parcelamento em 3x sem juros
    `.trim();
  }

  /**
   * Verifica se oferecemos um serviço específico
   */
  offeringService(serviceName) {
    const servicos = this.config.maestro.conhecimento_empresa?.servicos_oferecidos || [];
    return servicos.some(s => s.toLowerCase().includes(serviceName.toLowerCase()));
  }

  /**
   * Verifica se NÃO oferecemos algo
   */
  notOffering(serviceName) {
    const naoOferecemos = this.config.maestro.conhecimento_empresa?.nao_oferecemos || [];
    return naoOferecemos.some(s => s.toLowerCase().includes(serviceName.toLowerCase()));
  }

  // ═══════════════════════════════════════════════════════════════════════
  // MÉTODOS DE ACESSO - PERSONALIDADE
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Retorna informações de personalidade
   */
  getPersonality() {
    return this.config.personality.personalidade || {};
  }

  /**
   * Retorna tom de voz configurado
   */
  getToneOfVoice() {
    return this.config.personality.personalidade?.tom_de_voz || {
      casual: 70,
      formal: 30,
      entusiasmo: 80,
      profissionalismo: 90,
      empatia: 95
    };
  }

  /**
   * Retorna respostas inteligentes pré-configuradas
   */
  getSmartResponses() {
    return this.config.personality.respostas_inteligentes || {};
  }

  /**
   * Busca resposta pré-configurada para saudação baseada no horário
   */
  getGreetingResponse() {
    const smartResponses = this.getSmartResponses();
    const hour = new Date().getHours();

    const saudacoes = smartResponses.saudacoes || {};

    if (hour < 12 && saudacoes.manha) {
      return this.randomChoice(saudacoes.manha);
    } else if (hour < 18 && saudacoes.tarde) {
      return this.randomChoice(saudacoes.tarde);
    } else if (saudacoes.noite) {
      return this.randomChoice(saudacoes.noite);
    }

    return "Oi! Que bom te ver por aqui! 😊";
  }

  // ═══════════════════════════════════════════════════════════════════════
  // MÉTODOS DE ACESSO - REGRAS DE PRIORIDADE (MAESTRO)
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Verifica gatilhos de prioridade máxima
   */
  checkMaxPriorityTriggers(userMessage) {
    const regras = this.config.maestro.regras_de_prioridade?.prioridade_maxima;
    if (!regras) return null;

    const lowerMsg = userMessage.toLowerCase();
    for (const gatilho of regras.gatilhos || []) {
      if (lowerMsg.includes(gatilho)) {
        return {
          priority: 'max',
          action: regras.acao,
          description: regras.descricao,
          example: regras.exemplo_resposta
        };
      }
    }

    return null;
  }

  /**
   * Retorna regras de prioridade completas
   */
  getPriorityRules() {
    return this.config.maestro.regras_de_prioridade || {};
  }

  // ═══════════════════════════════════════════════════════════════════════
  // MÉTODOS DE ACESSO - AGENTES ESPECIALISTAS
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Seleciona agente especialista baseado na mensagem
   */
  selectSpecialistAgent(userMessage) {
    const agentes = this.config.maestro.agentes_especialistas;
    if (!agentes) return null;

    const lowerMsg = userMessage.toLowerCase();

    for (const [agentKey, agentConfig] of Object.entries(agentes)) {
      for (const gatilho of agentConfig.gatilhos || []) {
        if (lowerMsg.includes(gatilho)) {
          return {
            agent: agentKey,
            methodology: agentConfig.metodologia,
            when: agentConfig.quando_usar,
            persona: this.config.personas[agentKey] || {}
          };
        }
      }
    }

    return null;
  }

  /**
   * Retorna configuração de uma persona específica
   */
  getPersona(personaName) {
    return this.config.personas[personaName] || null;
  }

  /**
   * Retorna perguntas SPIN (Rackham)
   */
  getSPINQuestions() {
    const rackham = this.config.personas.rackham;
    return rackham?.perguntas_spin || {
      situacao: "Para que eu possa te ajudar, me conte um pouco sobre sua situação.",
      problema: "Quais são as dificuldades que você enfrenta?",
      implicacao: "Qual o impacto desses desafios no seu negócio?",
      necessidade_solucao: "Se pudesse resolver isso, o que isso significaria para você?"
    };
  }

  /**
   * Retorna perguntas BANT (Konrath)
   */
  getBANTQuestions() {
    const konrath = this.config.personas.konrath;
    return konrath?.perguntas_bant || {
      budget: "Qual é o seu orçamento aproximado para este projeto?",
      authority: "Você é a pessoa responsável pela decisão?",
      need: "Qual serviço você precisa exatamente?",
      timeline: "Qual a sua urgência para ter isso pronto?"
    };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // MÉTODOS DE ACESSO - TRATAMENTO DE OBJEÇÕES
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Retorna estratégias para tratamento de objeções
   */
  getObjectionHandling() {
    const personality = this.config.personality;
    return personality.estrategias_conversa?.tratamento_objecoes || {
      preco_alto: {
        tecnica: "ROI + Parcelamento + Garantia",
        resposta_modelo: "Entendo! Mas pensa: se trouxer 2 clientes novos, já pagou. Posso parcelar em 3x e dou garantia total!"
      },
      preciso_pensar: {
        tecnica: "Urgência + Garantia",
        resposta_modelo: "Claro! Mas tenho só 3 vagas este mês. Que tal garantir com consultoria gratuita?"
      }
    };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // UTILITÁRIOS
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Escolhe item aleatório de array
   */
  randomChoice(array) {
    if (!array || array.length === 0) return null;
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Retorna estatísticas da base de conhecimento
   */
  getStats() {
    return {
      maestroLoaded: !!this.config.maestro,
      personalityLoaded: !!this.config.personality,
      personasLoaded: Object.keys(this.config.personas || {}).length,
      servicesCount: this.config.maestro.conhecimento_empresa?.servicos_oferecidos?.length || 0,
      hasSmartResponses: !!this.config.personality.respostas_inteligentes
    };
  }

  /**
   * Valida se configurações essenciais estão carregadas
   */
  isValid() {
    return !!(this.config.maestro && this.config.personality);
  }

  /**
   * Recarrega configurações (útil para hot-reload)
   */
  reload() {
    console.log('🔄 Recarregando Knowledge Base...');
    this.loadAllConfigurations();
  }
}

/**
 * Singleton instance
 */
let instance = null;

export function getKnowledgeBase() {
  if (!instance) {
    instance = new KnowledgeBase();
  }
  return instance;
}
