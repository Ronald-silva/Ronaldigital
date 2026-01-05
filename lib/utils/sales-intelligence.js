/**
 * Sales Intelligence - Sistema de Vendas de Classe Mundial
 *
 * Integra frameworks, personas, objeções e ROI calculators
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import roiCalculators from './roi-calculator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carrega bases de conhecimento de vendas
const salesFrameworks = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../data/sales-frameworks.json'), 'utf8')
);
const objectionHandling = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../data/objection-handling.json'), 'utf8')
);
const clientPersonas = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../data/client-personas.json'), 'utf8')
);

/**
 * Detecta persona do cliente baseado em sinais
 */
export function detectPersona(userMessage, chatHistory = [], userInfo = {}) {
  const fullText = (userMessage + ' ' + chatHistory.join(' ')).toLowerCase();
  const personas = clientPersonas.personas;

  // Score cada persona
  const personaScores = {};

  for (const [personaKey, persona] of Object.entries(personas)) {
    let score = 0;

    // Verifica sinais de identificação
    for (const sinal of persona.sinais_identificacao) {
      if (fullText.includes(sinal.toLowerCase())) {
        score += 2;
      }
    }

    // Boost se tipoServico bate
    if (userInfo.tipoServico) {
      const tipo = userInfo.tipoServico.toLowerCase();
      if (personaKey.includes(tipo) || persona.descricao.toLowerCase().includes(tipo)) {
        score += 3;
      }
    }

    personaScores[personaKey] = score;
  }

  // Pega persona com maior score
  const sortedPersonas = Object.entries(personaScores)
    .sort(([, a], [, b]) => b - a);

  const [topPersonaKey, topScore] = sortedPersonas[0];

  // Se score muito baixo, retorna genérico
  if (topScore < 2) {
    return {
      key: 'generic',
      confidence: 0,
      persona: null,
      playbook: null
    };
  }

  return {
    key: topPersonaKey,
    confidence: Math.min(topScore * 10, 100),
    persona: personas[topPersonaKey],
    playbook: personas[topPersonaKey].playbook
  };
}

/**
 * Detecta se mensagem contém objeção
 */
export function detectObjection(userMessage) {
  const lowerMsg = userMessage.toLowerCase();
  const objections = objectionHandling.objection_handling_guide.objection_types;

  for (const [categoryKey, category] of Object.entries(objections)) {
    for (const [objectionKey, objectionData] of Object.entries(category.objections)) {
      // Verifica se alguma frase da objeção está na mensagem
      for (const frase of objectionData.cliente_diz) {
        if (lowerMsg.includes(frase.toLowerCase())) {
          return {
            detected: true,
            category: categoryKey,
            objection_key: objectionKey,
            objection_data: objectionData,
            category_name: category.category
          };
        }
      }
    }
  }

  return {
    detected: false
  };
}

/**
 * Gera resposta para objeção
 */
export function generateObjectionResponse(objectionDetection, context = {}) {
  if (!objectionDetection.detected) {
    return null;
  }

  const { objection_data } = objectionDetection;
  const responses = objection_data.responses || [];

  if (responses.length === 0) {
    return null;
  }

  // Pega primeira resposta (ou poderia escolher baseado em contexto)
  const selectedResponse = responses[0];

  return {
    technique: selectedResponse.technique,
    response: selectedResponse.response,
    when_to_use: selectedResponse.when_to_use,
    qualifying_questions: objection_data.qualifying_questions || []
  };
}

/**
 * Calcula ROI baseado em produto e dados do cliente
 */
export function calculateROI(productKey, clientData = {}) {
  const ticket_medio = clientData.ticket_medio || clientData.orcamento || 150;
  const investimento = clientData.investimento || 1000;

  switch (productKey) {
    case 'landing_page':
      return roiCalculators.calculateLandingPageROI({
        investimento: investimento,
        ticket_medio: ticket_medio,
        visitantes_mes: clientData.visitantes_mes || 1000,
        ...clientData
      });

    case 'website':
    case 'site-blog':
      return roiCalculators.calculateWebsiteROI({
        investimento: investimento,
        ticket_medio: ticket_medio,
        clientes_novos_mes_sem_site: clientData.clientes_mes || 5,
        ...clientData
      });

    case 'ai_agent':
      return roiCalculators.calculateAIAgentROI({
        investimento_setup: investimento,
        ticket_medio: ticket_medio,
        mensagens_dia: clientData.mensagens_dia || 50,
        ...clientData
      });

    case 'seo':
      return roiCalculators.calculateSEOROI({
        investimento_mes: clientData.investimento_mes || 500,
        ticket_medio: ticket_medio,
        ...clientData
      });

    case 'portfolio':
      return roiCalculators.simpleROI(investimento, ticket_medio);

    default:
      return roiCalculators.simpleROI(investimento, ticket_medio);
  }
}

/**
 * Seleciona framework de qualificação baseado em persona
 */
export function selectQualificationFramework(personaPlaybook) {
  if (!personaPlaybook || !personaPlaybook.framework_primario) {
    return salesFrameworks.qualification_frameworks.bant; // Default
  }

  const frameworkName = personaPlaybook.framework_primario.toLowerCase();

  if (frameworkName.includes('meddic')) {
    return salesFrameworks.qualification_frameworks.meddic;
  } else if (frameworkName.includes('champ')) {
    return salesFrameworks.qualification_frameworks.champ;
  } else if (frameworkName.includes('gpct')) {
    return salesFrameworks.qualification_frameworks.gpct;
  } else {
    return salesFrameworks.qualification_frameworks.bant;
  }
}

/**
 * Gera dicas de negociação baseadas em metodologia
 */
export function getNegotiationTips(methodology = 'spin_selling') {
  const techniques = salesFrameworks.negotiation_techniques;

  if (techniques[methodology]) {
    return techniques[methodology];
  }

  return techniques.spin_selling; // Default
}

/**
 * Constrói contexto de vendas enriquecido
 */
export function buildSalesContext(userMessage, chatHistory, userInfo, productRecommendation) {
  // Detecta persona
  const personaDetection = detectPersona(userMessage, chatHistory, userInfo);

  // Detecta objeção
  const objectionDetection = detectObjection(userMessage);
  let objectionResponse = null;
  if (objectionDetection.detected) {
    objectionResponse = generateObjectionResponse(objectionDetection, userInfo);
  }

  // Seleciona framework
  const framework = selectQualificationFramework(personaDetection.playbook);

  // Calcula ROI se tem produto recomendado
  let roiCalculation = null;
  if (productRecommendation?.recommendation?.primary_product) {
    const productKey = productRecommendation.recommendation.primary_product.key;
    roiCalculation = calculateROI(productKey, userInfo);
  }

  return {
    persona: personaDetection,
    objection: {
      detected: objectionDetection.detected,
      ...objectionDetection,
      response: objectionResponse
    },
    framework,
    roi: roiCalculation,
    negotiation_tips: getNegotiationTips('spin_selling')
  };
}

/**
 * Gera insights de vendas para incluir no prompt
 */
export function generateSalesInsights(salesContext) {
  const insights = [];

  // Persona insights
  if (salesContext.persona.confidence > 50) {
    const { persona, playbook } = salesContext.persona;
    insights.push({
      type: 'persona',
      confidence: salesContext.persona.confidence,
      title: `Cliente identificado como: ${persona.descricao}`,
      details: {
        tom_recomendado: playbook.tom,
        abordagem: playbook.abordagem,
        argumentos_chave: playbook.argumentos_chave.slice(0, 3),
        produtos_ideais: playbook.produtos_ideais,
        value_proposition: playbook.value_proposition
      }
    });
  }

  // Objection insights
  if (salesContext.objection.detected && salesContext.objection.response) {
    insights.push({
      type: 'objection',
      title: `Objeção detectada: ${salesContext.objection.category_name}`,
      details: {
        tecnica_recomendada: salesContext.objection.response.technique,
        resposta_sugerida: salesContext.objection.response.response,
        perguntas_qualificadoras: salesContext.objection.response.qualifying_questions
      }
    });
  }

  // ROI insights
  if (salesContext.roi && salesContext.roi.pitch) {
    insights.push({
      type: 'roi',
      title: 'Cálculo de ROI disponível',
      details: {
        pitch: salesContext.roi.pitch,
        roi_meses: salesContext.roi.roi_meses,
        receita_nova_mes: salesContext.roi.receita_nova_mes
      }
    });
  }

  // Framework insights
  if (salesContext.framework) {
    insights.push({
      type: 'framework',
      title: `Framework de qualificação: ${salesContext.framework.name}`,
      details: {
        quando_usar: salesContext.framework.when_to_use,
        criterios: Object.keys(salesContext.framework.criteria || {})
      }
    });
  }

  return insights;
}

export default {
  detectPersona,
  detectObjection,
  generateObjectionResponse,
  calculateROI,
  selectQualificationFramework,
  getNegotiationTips,
  buildSalesContext,
  generateSalesInsights
};
