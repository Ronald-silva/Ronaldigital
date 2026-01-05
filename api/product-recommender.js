/**
 * Product Recommender - Lógica Consultiva para Sara AI
 *
 * Este módulo analisa o contexto do cliente e recomenda o produto/serviço CERTO
 * baseado em sinais de necessidade, orçamento, urgência e objetivos.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Pega __dirname em ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carrega base de conhecimento
const products = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/products.json'), 'utf8')).products;
const caseStudies = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/case-studies.json'), 'utf8')).case_studies;

/**
 * Sinais de necessidade - Palavras/frases que indicam cada produto
 */
const PRODUCT_SIGNALS = {
  landing_page: {
    keywords: [
      'vender produto', 'vender curso', 'captar leads', 'landing page', 'lp',
      'conversão', 'campanha', 'lançamento', 'tráfego pago', 'anúncio',
      'página de vendas', 'validar ideia', 'produto único', 'webinar', 'evento'
    ],
    questions: [
      'vai rodar anúncio', 'vai fazer campanha', 'precisa de algo rápido',
      'orçamento limitado', 'menos de 1000', 'objetivo único'
    ],
    budget_range: [500, 1200],
    delivery_fast: true,
    score_boost: 0
  },

  website: {
    keywords: [
      'site', 'website', 'site institucional', 'site corporativo', 'presença online',
      'credibilidade', 'autoridade', 'profissional liberal', 'advogado', 'médico',
      'dentista', 'contador', 'consultoria', 'agência', 'empresa', 'vários serviços',
      'portfólio de serviços', 'aparecer no google', 'seo', 'múltiplas páginas'
    ],
    questions: [
      'cliente precisa confiar', 'mostrar vários serviços', 'quer credibilidade',
      'profissional', 'empresa', 'negócio b2b'
    ],
    budget_range: [800, 2500],
    delivery_fast: false,
    score_boost: 0
  },

  ai_agent: {
    keywords: [
      'ia', 'inteligência artificial', 'chatbot', 'atendimento automático',
      'atender 24h', 'atendimento 24 horas', 'resposta automática', 'qualificar leads',
      'perguntas repetitivas', 'muitas mensagens', 'perder leads de madrugada',
      'resposta rápida', 'escalar sem contratar', 'agendamento automático',
      'automação', 'filtrar leads', 'leads quentes', 'economizar tempo'
    ],
    questions: [
      'quantas mensagens recebe', 'perde leads de madrugada', 'demorar pra responder',
      'muito atendimento manual', 'quer escalar vendas', 'perguntas repetitivas'
    ],
    budget_range: [1000, 3000],
    delivery_fast: false,
    score_boost: 0
  },

  portfolio: {
    keywords: [
      'portfólio', 'portfolio', 'currículo digital', 'cv digital', 'currículo online',
      'freelancer', 'autônomo', 'buscar emprego', 'buscar cliente', 'mostrar trabalhos',
      'fotógrafo', 'designer', 'arquiteto', 'criativo', 'apresentar projetos'
    ],
    questions: [
      'é freelancer', 'trabalha sozinho', 'busca emprego', 'precisa mostrar trabalhos'
    ],
    budget_range: [400, 800],
    delivery_fast: true,
    score_boost: 0
  },

  blog: {
    keywords: [
      'blog', 'artigos', 'conteúdo', 'escrever', 'autoridade', 'educar mercado',
      'tráfego orgânico', 'marketing de conteúdo', 'ranquear', 'palavras-chave',
      'ser referência', 'thought leader', 'newsletter', 'publicar'
    ],
    questions: [
      'quer autoridade', 'educar cliente', 'tráfego gratuito', 'crescimento orgânico',
      'produz conteúdo'
    ],
    budget_range: [600, 1200],
    delivery_fast: false,
    score_boost: 0
  },

  seo: {
    keywords: [
      'seo', 'aparecer no google', 'não aparece no google', 'primeiro no google',
      'ranqueamento', 'otimização', 'busca orgânica', 'google search',
      'palavras-chave', 'tráfego orgânico', 'posição no google'
    ],
    questions: [
      'não aparece no google', 'concorrente aparece', 'quer tráfego orgânico',
      'crescimento sustentável', 'parar de depender de anúncio'
    ],
    budget_range: [500, 1500],
    delivery_fast: false,
    score_boost: 0
  }
};

/**
 * Detectores de contexto específico
 */
const CONTEXT_DETECTORS = {
  // Budget signals
  baixo_orcamento: ['barato', 'mais em conta', 'econômico', 'menos de 500', 'até 500', 'pouco dinheiro'],
  medio_orcamento: ['mil reais', '1000', 'investir', 'quanto custa'],
  alto_orcamento: ['completo', 'melhor', 'premium', 'sem limite', 'investimento alto'],

  // Urgência
  urgente: ['urgente', 'rápido', 'já', 'amanhã', 'essa semana', 'prazo apertado', 'pra ontem'],
  medio_prazo: ['próximo mês', 'algumas semanas', 'não é urgente'],
  longo_prazo: ['eventualmente', 'futuro', 'ano que vem', 'quando der'],

  // Objeções comuns
  comparando_wix: ['wix', 'wordpress', 'fazer sozinho', 'plataforma'],
  sem_urgencia: ['não preciso agora', 'talvez depois', 'vou pensar'],
  muito_caro: ['caro', 'muito caro', 'não tenho', 'orçamento apertado'],

  // Tipo de negócio
  profissional_liberal: ['advogado', 'médico', 'dentista', 'contador', 'consultor'],
  ecommerce: ['loja virtual', 'vender produtos', 'e-commerce', 'ecommerce', 'catálogo'],
  servicos_locais: ['barbearia', 'salão', 'clínica', 'restaurante', 'local'],
  b2b: ['empresas', 'b2b', 'corporativo', 'outras empresas']
};

/**
 * Mapeamento produto → case studies relevantes
 */
const PRODUCT_TO_CASES = {
  landing_page: ['salesnet'],
  website: ['auditprime', 'hs_forge_luxury'],
  ai_agent: ['medeiros_veiculos', 'hs_forge_luxury', 'barberflow'],
  portfolio: ['curriculo_julia'],
  blog: ['major_heribaldo'],
  seo: ['auditprime', 'major_heribaldo']
};

/**
 * Analisa mensagem do cliente e retorna sinais detectados
 */
function analyzeClientMessage(message, conversationHistory = []) {
  const fullText = (message + ' ' + conversationHistory.join(' ')).toLowerCase();

  const analysis = {
    products_scores: {},
    budget_signal: 'unknown',
    urgency_signal: 'medium',
    objections: [],
    business_type: 'unknown',
    keywords_found: []
  };

  // Score cada produto baseado em keywords
  for (const [productKey, signals] of Object.entries(PRODUCT_SIGNALS)) {
    let score = 0;
    const foundKeywords = [];

    // Busca keywords
    for (const keyword of signals.keywords) {
      if (fullText.includes(keyword.toLowerCase())) {
        score += 1;
        foundKeywords.push(keyword);
      }
    }

    // Busca perguntas/contextos
    for (const question of signals.questions) {
      if (fullText.includes(question.toLowerCase())) {
        score += 1.5; // Perguntas valem mais
        foundKeywords.push(question);
      }
    }

    analysis.products_scores[productKey] = {
      score,
      keywords: foundKeywords,
      product_data: products[productKey]
    };
  }

  // Detecta orçamento
  if (CONTEXT_DETECTORS.baixo_orcamento.some(k => fullText.includes(k))) {
    analysis.budget_signal = 'low';
  } else if (CONTEXT_DETECTORS.alto_orcamento.some(k => fullText.includes(k))) {
    analysis.budget_signal = 'high';
  } else if (CONTEXT_DETECTORS.medio_orcamento.some(k => fullText.includes(k))) {
    analysis.budget_signal = 'medium';
  }

  // Detecta urgência
  if (CONTEXT_DETECTORS.urgente.some(k => fullText.includes(k))) {
    analysis.urgency_signal = 'high';
  } else if (CONTEXT_DETECTORS.longo_prazo.some(k => fullText.includes(k))) {
    analysis.urgency_signal = 'low';
  }

  // Detecta objeções
  if (CONTEXT_DETECTORS.comparando_wix.some(k => fullText.includes(k))) {
    analysis.objections.push('comparing_with_diy_platforms');
  }
  if (CONTEXT_DETECTORS.sem_urgencia.some(k => fullText.includes(k))) {
    analysis.objections.push('no_urgency');
  }
  if (CONTEXT_DETECTORS.muito_caro.some(k => fullText.includes(k))) {
    analysis.objections.push('price_concern');
  }

  // Detecta tipo de negócio
  if (CONTEXT_DETECTORS.profissional_liberal.some(k => fullText.includes(k))) {
    analysis.business_type = 'professional_services';
  } else if (CONTEXT_DETECTORS.ecommerce.some(k => fullText.includes(k))) {
    analysis.business_type = 'ecommerce';
  } else if (CONTEXT_DETECTORS.servicos_locais.some(k => fullText.includes(k))) {
    analysis.business_type = 'local_services';
  } else if (CONTEXT_DETECTORS.b2b.some(k => fullText.includes(k))) {
    analysis.business_type = 'b2b';
  }

  return analysis;
}

/**
 * Ajusta scores baseado em contexto
 */
function adjustScoresWithContext(analysis) {
  const { products_scores, budget_signal, urgency_signal, business_type } = analysis;

  // Se orçamento baixo, boost produtos mais baratos
  if (budget_signal === 'low') {
    if (products_scores.portfolio) products_scores.portfolio.score += 2;
    if (products_scores.landing_page) products_scores.landing_page.score += 1.5;
  }

  // Se orçamento alto, boost produtos premium
  if (budget_signal === 'high') {
    if (products_scores.ai_agent) products_scores.ai_agent.score += 2;
    if (products_scores.website) products_scores.website.score += 1.5;
  }

  // Se urgência alta, boost produtos rápidos
  if (urgency_signal === 'high') {
    if (products_scores.landing_page) products_scores.landing_page.score += 2;
    if (products_scores.portfolio) products_scores.portfolio.score += 1;
  }

  // Ajustes baseados em tipo de negócio
  if (business_type === 'professional_services') {
    if (products_scores.website) products_scores.website.score += 2;
    if (products_scores.seo) products_scores.seo.score += 1.5;
  }

  if (business_type === 'local_services') {
    if (products_scores.ai_agent) products_scores.ai_agent.score += 2;
    if (products_scores.website) products_scores.website.score += 1;
  }

  if (business_type === 'ecommerce') {
    // E-commerce está fora do escopo, mas se detectar, não recomenda nada
    Object.keys(products_scores).forEach(key => {
      products_scores[key].score = 0;
    });
    analysis.out_of_scope = 'ecommerce';
  }

  return analysis;
}

/**
 * Recomenda produto(s) baseado na análise
 */
function recommendProducts(message, conversationHistory = []) {
  let analysis = analyzeClientMessage(message, conversationHistory);
  analysis = adjustScoresWithContext(analysis);

  // Ordena produtos por score
  const rankedProducts = Object.entries(analysis.products_scores)
    .sort(([, a], [, b]) => b.score - a.score)
    .filter(([, data]) => data.score > 0);

  if (analysis.out_of_scope) {
    return {
      recommendation_type: 'out_of_scope',
      reason: analysis.out_of_scope,
      analysis
    };
  }

  if (rankedProducts.length === 0) {
    return {
      recommendation_type: 'need_qualification',
      message: 'Precisa fazer perguntas qualificadoras',
      suggested_questions: [
        'O que você quer que seu site/sistema faça?',
        'Você vende um produto específico ou vários serviços?',
        'Vai rodar tráfego pago/anúncios?',
        'Seu cliente precisa confiar em você antes de comprar?'
      ],
      analysis
    };
  }

  const topProduct = rankedProducts[0];
  const [productKey, productData] = topProduct;

  // Se score é muito baixo, precisa qualificar melhor
  if (productData.score < 2) {
    return {
      recommendation_type: 'need_qualification',
      tentative_product: productKey,
      suggested_questions: products[productKey].when_to_recommend?.questions_to_ask || [],
      analysis
    };
  }

  // Recomendação principal
  const recommendation = {
    recommendation_type: 'confident',
    primary_product: {
      key: productKey,
      name: productData.product_data.name,
      price_range: productData.product_data.price_range,
      delivery_time: productData.product_data.delivery_time,
      why_recommended: `Score: ${productData.score} baseado em: ${productData.keywords.join(', ')}`,
      variants: productData.product_data.variants
    },
    relevant_case_studies: PRODUCT_TO_CASES[productKey]?.map(caseKey => ({
      key: caseKey,
      name: caseStudies[caseKey]?.name,
      url: caseStudies[caseKey]?.url,
      how_to_pitch: caseStudies[caseKey]?.when_to_mention?.how_to_pitch
    })) || [],
    analysis
  };

  // Se houver segundo produto com score razoável, sugere combo/alternativa
  if (rankedProducts.length > 1 && rankedProducts[1][1].score >= 2) {
    const [secondProductKey, secondProductData] = rankedProducts[1];
    recommendation.alternative_product = {
      key: secondProductKey,
      name: secondProductData.product_data.name,
      price_range: secondProductData.product_data.price_range,
      why_alternative: `Também relevante (score: ${secondProductData.score})`
    };
  }

  // Detecta upsells
  const upsells = [];
  if (productKey === 'landing_page' && analysis.products_scores.ai_agent?.score > 0) {
    upsells.push({
      product: 'ai_agent',
      pitch: products.landing_page.upsells?.find(u => u.addon.includes('IA'))
    });
  }
  if (productKey === 'website' && analysis.products_scores.seo?.score > 0) {
    upsells.push({
      product: 'seo',
      pitch: 'Website sem SEO não aparece no Google. Combo Site + SEO é mais inteligente!'
    });
  }
  if (upsells.length > 0) {
    recommendation.upsell_opportunities = upsells;
  }

  // Detecta objeções e prepara respostas
  if (analysis.objections.length > 0) {
    recommendation.objections_to_address = analysis.objections.map(objection => {
      if (objection === 'comparing_with_diy_platforms') {
        return {
          objection: 'comparing_with_diy_platforms',
          response: products[productKey].competitive_advantages?.vs_wix ||
                    'Plataformas DIY cobram mensalidade eterna e têm limitações. Nosso trabalho você paga uma vez e é 100% seu.'
        };
      }
      if (objection === 'price_concern') {
        return {
          objection: 'price_concern',
          response: products[productKey].common_objections?.muito_caro ||
                    'Entendo! Mas pense no ROI: se 1 cliente novo vier disso, já se pagou. Posso parcelar em 2-3x se ajudar!'
        };
      }
      if (objection === 'no_urgency') {
        return {
          objection: 'no_urgency',
          response: products[productKey].common_objections?.nao_preciso_agora ||
                    'Tranquilo! Mas cada mês esperando é faturamento perdido. Quer que eu te mande um exemplo pra você ver o potencial?'
        };
      }
      return { objection, response: 'Sem resposta pré-definida' };
    });
  }

  return recommendation;
}

/**
 * Gera resposta estruturada para Sara usar
 */
function generateSaraResponse(recommendation) {
  if (recommendation.recommendation_type === 'out_of_scope') {
    if (recommendation.reason === 'ecommerce') {
      return {
        message: "Olha, vou ser honesta: e-commerce completo não é minha especialidade. Posso te indicar parceiros experts nisso! Ou se você tá começando pequeno, posso criar uma Landing Page de Produto pra você validar vendas antes de investir em e-commerce completo. O que acha?",
        next_action: 'qualify_or_refer'
      };
    }
  }

  if (recommendation.recommendation_type === 'need_qualification') {
    return {
      message: `Entendi! Pra te recomendar a melhor solução, preciso saber mais. ${recommendation.suggested_questions?.slice(0, 2).join(' ')}`,
      questions: recommendation.suggested_questions,
      next_action: 'await_client_response'
    };
  }

  if (recommendation.recommendation_type === 'confident') {
    const product = recommendation.primary_product;
    const caseStudy = recommendation.relevant_case_studies?.[0];

    let message = '';

    // Usa case study se disponível
    if (caseStudy && caseStudy.how_to_pitch) {
      message += `${caseStudy.how_to_pitch}\n\n`;
    }

    message += `**Pro seu caso, recomendo: ${product.name}**\n\n`;
    message += `💰 Investimento: ${product.price_range}\n`;
    message += `⏱️ Entrega: ${product.delivery_time}\n\n`;

    // Menciona variantes se existirem
    if (product.variants) {
      const variants = Object.values(product.variants);
      if (variants.length > 1) {
        message += `Tenho ${variants.length} opções pra você:\n`;
        variants.forEach((variant, i) => {
          message += `${i + 1}️⃣ **${variant.name}** - ${variant.price}\n`;
        });
        message += '\n';
      }
    }

    // Menciona alternativa se houver
    if (recommendation.alternative_product) {
      message += `**Alternativa:** ${recommendation.alternative_product.name} (${recommendation.alternative_product.price_range}) - ${recommendation.alternative_product.why_alternative}\n\n`;
    }

    // Endereça objeções se detectadas
    if (recommendation.objections_to_address?.length > 0) {
      const objection = recommendation.objections_to_address[0];
      message += `${objection.response}\n\n`;
    }

    // Sugere upsell se apropriado
    if (recommendation.upsell_opportunities?.length > 0) {
      const upsell = recommendation.upsell_opportunities[0];
      message += `💡 **Dica:** ${upsell.pitch}\n\n`;
    }

    message += 'Me conta: isso faz sentido pro seu momento?';

    return {
      message,
      product_recommended: product.key,
      case_study_used: caseStudy?.key,
      next_action: 'await_confirmation_or_questions'
    };
  }

  return {
    message: 'Preciso entender melhor sua necessidade. Me conta mais sobre seu negócio?',
    next_action: 'general_qualification'
  };
}

/**
 * Função principal exportada
 */
function getRecommendation(clientMessage, conversationHistory = []) {
  const recommendation = recommendProducts(clientMessage, conversationHistory);
  const response = generateSaraResponse(recommendation);

  return {
    recommendation,
    suggested_response: response,
    debug: {
      analysis: recommendation.analysis,
      products_ranked: Object.entries(recommendation.analysis?.products_scores || {})
        .sort(([, a], [, b]) => b.score - a.score)
        .map(([key, data]) => ({ product: key, score: data.score, keywords: data.keywords }))
    }
  };
}

// Exporta funções (ES modules)
export {
  getRecommendation,
  analyzeClientMessage,
  recommendProducts,
  generateSaraResponse
};
