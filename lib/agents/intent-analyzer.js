/**
 * INTENT ANALYZER - Sistema de Análise de Intenção
 *
 * Classifica a intenção da mensagem do usuário ANTES do processamento principal,
 * permitindo que Sara escolha a melhor estratégia de resposta.
 *
 * Usa modelo rápido e econômico para análise preliminar.
 */

import { HumanMessage, SystemMessage } from "@langchain/core/messages";

/**
 * Tipos de intenção suportados
 */
export const INTENT_TYPES = {
  PERGUNTA_DIRETA_NEGOCIO: 'pergunta_direta_negocio',
  PEDIDO_ORCAMENTO: 'pedido_orcamento',
  EXPRESSA_INTERESSE: 'expressa_interesse',
  OBJECAO: 'objecao',
  FORNECE_INFO: 'fornece_info',
  SAUDACAO: 'saudacao',
  DUVIDA_TECNICA: 'duvida_tecnica',
  AGRADECIMENTO: 'agradecimento',
  DESPEDIDA: 'despedida'
};

/**
 * Metodologias recomendadas por intenção
 */
export const INTENT_TO_METHODOLOGY = {
  [INTENT_TYPES.PERGUNTA_DIRETA_NEGOCIO]: 'direta',
  [INTENT_TYPES.PEDIDO_ORCAMENTO]: 'bant',
  [INTENT_TYPES.EXPRESSA_INTERESSE]: 'spin',
  [INTENT_TYPES.OBJECAO]: 'value_first',
  [INTENT_TYPES.FORNECE_INFO]: 'spin',
  [INTENT_TYPES.SAUDACAO]: 'direta',
  [INTENT_TYPES.DUVIDA_TECNICA]: 'direta',
  [INTENT_TYPES.AGRADECIMENTO]: 'direta',
  [INTENT_TYPES.DESPEDIDA]: 'direta'
};

/**
 * Analisador de intenção baseado em regras (fallback rápido)
 */
export class RuleBasedIntentAnalyzer {
  analyze(userMessage, context = {}) {
    const lowerMsg = userMessage.toLowerCase().trim();

    // SAUDAÇÃO
    if (this.isSaudacao(lowerMsg)) {
      return {
        intent: INTENT_TYPES.SAUDACAO,
        methodology: 'direta',
        confidence: 90,
        reason: 'Detectado cumprimento inicial'
      };
    }

    // DESPEDIDA
    if (this.isDespedida(lowerMsg)) {
      return {
        intent: INTENT_TYPES.DESPEDIDA,
        methodology: 'direta',
        confidence: 95,
        reason: 'Detectada despedida'
      };
    }

    // AGRADECIMENTO
    if (this.isAgradecimento(lowerMsg)) {
      return {
        intent: INTENT_TYPES.AGRADECIMENTO,
        methodology: 'direta',
        confidence: 90,
        reason: 'Detectado agradecimento'
      };
    }

    // PEDIDO DE ORÇAMENTO
    if (this.isPedidoOrcamento(lowerMsg)) {
      return {
        intent: INTENT_TYPES.PEDIDO_ORCAMENTO,
        methodology: 'bant',
        confidence: 85,
        reason: 'Detectada pergunta sobre preço/prazo'
      };
    }

    // OBJEÇÃO
    if (this.isObjecao(lowerMsg)) {
      return {
        intent: INTENT_TYPES.OBJECAO,
        methodology: 'value_first',
        confidence: 80,
        reason: 'Detectada objeção ou preocupação'
      };
    }

    // DÚVIDA TÉCNICA
    if (this.isDuvidaTecnica(lowerMsg)) {
      return {
        intent: INTENT_TYPES.DUVIDA_TECNICA,
        methodology: 'direta',
        confidence: 75,
        reason: 'Detectada pergunta técnica'
      };
    }

    // PERGUNTA DIRETA SOBRE NEGÓCIO
    if (this.isPerguntaDiretaNegocio(lowerMsg)) {
      return {
        intent: INTENT_TYPES.PERGUNTA_DIRETA_NEGOCIO,
        methodology: 'direta',
        confidence: 80,
        reason: 'Detectada pergunta sobre serviços'
      };
    }

    // EXPRESSA INTERESSE
    if (this.isExpressaInteresse(lowerMsg)) {
      return {
        intent: INTENT_TYPES.EXPRESSA_INTERESSE,
        methodology: 'spin',
        confidence: 70,
        reason: 'Detectado interesse em serviço'
      };
    }

    // FORNECE INFO (contexto de conversa ativa)
    if (context.mensagens_trocadas > 0) {
      return {
        intent: INTENT_TYPES.FORNECE_INFO,
        methodology: 'spin',
        confidence: 60,
        reason: 'Cliente respondendo em conversa ativa'
      };
    }

    // DEFAULT
    return {
      intent: INTENT_TYPES.EXPRESSA_INTERESSE,
      methodology: 'spin',
      confidence: 50,
      reason: 'Intenção não clara, usando padrão'
    };
  }

  // Métodos de detecção

  isSaudacao(msg) {
    const saudacoes = ['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'e aí', 'eai', 'hey', 'hello'];
    return saudacoes.some(s => msg.startsWith(s) || msg === s);
  }

  isDespedida(msg) {
    const despedidas = ['tchau', 'até logo', 'até mais', 'obrigado, é só', 'valeu, tchau', 'flw'];
    return despedidas.some(d => msg.includes(d));
  }

  isAgradecimento(msg) {
    const agradecimentos = ['obrigado', 'obrigada', 'valeu', 'agradeço'];
    return agradecimentos.some(a => msg.includes(a)) && !msg.includes('?');
  }

  isPedidoOrcamento(msg) {
    const keywords = ['quanto cust', 'qual o preço', 'qual o valor', 'quanto é', 'quanto sai',
                      'quanto fic', 'preço', 'valor', 'orçamento', 'prazo', 'quanto tempo'];
    return keywords.some(k => msg.includes(k));
  }

  isObjecao(msg) {
    const objecoes = ['caro', 'cara', 'muito dinheiro', 'não tenho', 'preciso pensar',
                      'vou pensar', 'vou ver', 'vi mais barato', 'encontrei por'];
    return objecoes.some(o => msg.includes(o));
  }

  isDuvidaTecnica(msg) {
    const tecnicos = ['como funciona', 'integra', 'compatível', 'responsiv', 'mobile',
                      'whatsapp', 'instagram', 'facebook', 'seo', 'google', 'ssl', 'segur'];
    return tecnicos.some(t => msg.includes(t));
  }

  isPerguntaDiretaNegocio(msg) {
    const perguntas = ['vocês faz', 'vocês vend', 'vocês trabalh', 'vocês tem',
                       'você faz', 'tem como fazer', 'fazem'];
    return perguntas.some(p => msg.includes(p));
  }

  isExpressaInteresse(msg) {
    const interesse = ['quero', 'preciso', 'gostaria', 'queria', 'tenho interesse',
                       'me interessa', 'procuro'];
    return interesse.some(i => msg.includes(i));
  }
}

/**
 * Analisador de intenção baseado em LLM (mais preciso)
 */
export class LLMIntentAnalyzer {
  constructor(apiManager) {
    this.apiManager = apiManager;
    this.ruleBasedFallback = new RuleBasedIntentAnalyzer();
  }

  /**
   * Analisa intenção usando LLM rápido
   */
  async analyze(userMessage, context = {}) {
    try {
      // Tenta com LLM
      const model = this.apiManager.getFastModel();

      const systemPrompt = `Você é um classificador de intenção para chatbot de vendas.

TIPOS DE INTENÇÃO:
1. pergunta_direta_negocio - Cliente pergunta se fazemos/vendemos algo específico
2. pedido_orcamento - Cliente quer saber preço, prazo, custo
3. expressa_interesse - Cliente diz que quer/precisa de algo
4. objecao - Cliente expressa preocupação (preço alto, precisa pensar, etc)
5. fornece_info - Cliente está respondendo pergunta nossa
6. saudacao - Cumprimento inicial (oi, bom dia, etc)
7. duvida_tecnica - Pergunta sobre funcionamento técnico
8. agradecimento - Cliente agradece
9. despedida - Cliente se despede

CONTEXTO:
- Mensagens trocadas: ${context.mensagens_trocadas || 0}
- Lead score atual: ${context.score || 0}/4

MENSAGEM DO CLIENTE:
"${userMessage}"

Responda APENAS com JSON válido:
{
  "intent": "tipo_da_intencao",
  "methodology": "direta|spin|bant|value_first",
  "confidence": 0-100,
  "reason": "explicação breve"
}`;

      const messages = [
        new SystemMessage(systemPrompt),
        new HumanMessage("Classifique a intenção")
      ];

      const response = await model.invoke(messages);
      const result = this.parseJSON(response.content);

      // Valida resultado
      if (result.intent && result.methodology && result.confidence) {
        return result;
      }

      throw new Error('Resposta LLM inválida');

    } catch (error) {
      console.warn('⚠️ Falha na análise LLM, usando regras:', error.message);
      return this.ruleBasedFallback.analyze(userMessage, context);
    }
  }

  parseJSON(content) {
    try {
      const cleaned = content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      return JSON.parse(cleaned);
    } catch (e) {
      throw new Error('Falha ao parsear JSON');
    }
  }
}

/**
 * Analisador de intenção híbrido (combina regras + LLM)
 */
export class HybridIntentAnalyzer {
  constructor(apiManager) {
    this.ruleBased = new RuleBasedIntentAnalyzer();
    this.llmBased = new LLMIntentAnalyzer(apiManager);
  }

  /**
   * Analisa usando regras primeiro, LLM se necessário
   */
  async analyze(userMessage, context = {}) {
    // 1. Tenta com regras (instantâneo, grátis)
    const ruleResult = this.ruleBased.analyze(userMessage, context);

    // 2. Se confiança alta, usa resultado das regras
    if (ruleResult.confidence >= 80) {
      console.log(`🎯 Intenção detectada (regras): ${ruleResult.intent} (${ruleResult.confidence}%)`);
      return ruleResult;
    }

    // 3. Se confiança baixa, usa LLM para refinar
    console.log(`🤔 Confiança baixa (${ruleResult.confidence}%), consultando LLM...`);
    try {
      const llmResult = await this.llmBased.analyze(userMessage, context);
      console.log(`🎯 Intenção refinada (LLM): ${llmResult.intent} (${llmResult.confidence}%)`);
      return llmResult;
    } catch (error) {
      console.warn('⚠️ LLM falhou, usando resultado das regras');
      return ruleResult;
    }
  }
}

/**
 * Factory function para criar analisador
 */
export function createIntentAnalyzer(apiManager, mode = 'hybrid') {
  switch (mode) {
    case 'rules':
      return new RuleBasedIntentAnalyzer();
    case 'llm':
      return new LLMIntentAnalyzer(apiManager);
    case 'hybrid':
    default:
      return new HybridIntentAnalyzer(apiManager);
  }
}
