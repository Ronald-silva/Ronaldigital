/**
 * Biblioteca de Few-Shot Examples para Sara AI 2.0 - DINÂMICOS
 *
 * Carrega exemplos do arquivo JSON para facilitar manutenção e expansão
 */

import fs from 'fs';
import path from 'path';

let cachedExamples = null;

/**
 * Carrega exemplos do JSON
 */
function loadExamplesFromJSON() {
  if (cachedExamples) {
    return cachedExamples;
  }

  try {
    const dataPath = path.join(process.cwd(), 'data', 'few-shot-examples.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    cachedExamples = data.few_shot_examples || [];
    console.log(`✅ ${cachedExamples.length} few-shot examples carregados`);
    return cachedExamples;
  } catch (error) {
    console.warn('⚠️ Erro ao carregar few-shot-examples.json:', error.message);
    console.warn('Usando fallback com exemplos básicos');
    return getFallbackExamples();
  }
}

/**
 * Fallback com exemplos básicos caso JSON não carregue
 */
function getFallbackExamples() {
  return [
    {
      scenario_id: 1,
      scenario_name: "Saudação",
      client_message: "Oi, boa tarde!",
      sara_ideal_response: "Oi! Boa tarde! Que bom te ver por aqui! 😊\n\nSou a Sara, especialista em criar sites que realmente vendem!\n\nComo posso te ajudar hoje?",
      why_this_works: { técnicas_usadas: ["Saudação natural", "Apresentação rápida", "Pergunta aberta"] }
    },
    {
      scenario_id: 2,
      scenario_name: "Pergunta sobre preço",
      client_message: "Quanto custa um site?",
      sara_ideal_response: "Depende bastante do tipo de site! Por exemplo, uma landing page simples sai por uns R$ 500-1.000. Já um e-commerce completo fica entre R$ 1.200-2.500.\n\nMe conta: é para qual tipo de negócio?",
      why_this_works: { técnicas_usadas: ["Responde a pergunta", "Contexto aliza", "Personaliza"] }
    }
  ];
}

/**
 * Retorna exemplos relevantes baseado na mensagem e contexto
 * FORMATO CORRETO para master-prompt.js
 */
export function getRelevantExamples(userMessage, context = {}) {
  const examples = loadExamplesFromJSON();
  const lowerMsg = userMessage.toLowerCase();
  const relevant = [];

  // Mapeia scenario_name para keywords de detecção
  const scenarioKeywords = {
    'saudação': ['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite'],
    'pergunta sobre preço': ['quanto', 'valor', 'preço', 'custa', 'custo'],
    'cliente quer agendamento': ['agendar', 'agendamento', 'horário', 'marcar', 'calendário'],
    'cliente não aparece no google': ['google', 'não aparece', 'busca', 'seo', 'ranquear'],
    'cliente quer vender produto': ['vender', 'curso', 'produto', 'lançamento', 'campanha'],
    'cliente com orçamento baixo': ['barato', 'mais em conta', 'econômico', 'menos de'],
    'objeção': ['wix', 'wordpress', 'fazer sozinho', 'caro', 'muito caro'],
    'cliente quer ia': ['ia', 'inteligência artificial', 'chatbot', 'atendimento automático', '24h'],
    'cliente freelancer': ['freelancer', 'autônomo', 'portfólio', 'emprego', 'currículo'],
    'cliente perde leads': ['madrugada', 'leads', 'perde cliente', 'resposta rápida'],
    'cliente quer app': ['aplicativo', 'app', 'mobile'],
    'cliente quer autoridade': ['blog', 'autoridade', 'artigos', 'escrever', 'conteúdo'],
    'indeciso entre lp e site': ['landing page ou site', 'diferença', 'qual preciso'],
    'cliente já tem site': ['já tenho site', 'conversão baixa', 'melhorar site'],
    'cliente quer combo': ['completo', 'tudo', 'pacote', 'site + ia'],
    'não preciso agora': ['não preciso agora', 'depois', 'ano que vem', 'talvez'],
    'tráfego pago': ['tráfego pago', 'anúncio', 'facebook ads', 'google ads'],
    'e-commerce': ['loja virtual', 'ecommerce', 'e-commerce', 'vender produtos'],
    'seo sem site': ['seo', 'aparecer no google'],
    'expectativa irreal': ['netflix', 'amazon', 'igual', 'tipo'],
    'cliente satisfeito': ['obrigado', 'ficou ótimo', 'adorei', 'perfeito']
  };

  // Detecta cenários relevantes
  for (const [scenarioType, keywords] of Object.entries(scenarioKeywords)) {
    if (keywords.some(keyword => lowerMsg.includes(keyword.toLowerCase()))) {
      const matchingExample = examples.find(ex =>
        ex.scenario_name?.toLowerCase().includes(scenarioType.toLowerCase())
      );
      if (matchingExample && !relevant.includes(matchingExample)) {
        relevant.push(matchingExample);
      }
    }
  }

  // Se é início de conversa, sempre inclui exemplo de saudação
  if (!context.mensagens_trocadas || context.mensagens_trocadas === 0) {
    const saudacaoEx = examples.find(ex => ex.scenario_name?.toLowerCase().includes('saudação'));
    if (saudacaoEx && !relevant.includes(saudacaoEx)) {
      relevant.unshift(saudacaoEx); // Adiciona no início
    }
  }

  // Se não encontrou nenhum relevante, retorna 3 exemplos principais
  if (relevant.length === 0) {
    const defaultExamples = examples.slice(0, 3);
    return defaultExamples.map(formatExampleForPrompt);
  }

  // Limita a 4 exemplos e FORMATA para master-prompt
  return relevant.slice(0, 4).map(formatExampleForPrompt);
}

/**
 * Formata exemplo para inclusão no prompt (formato master-prompt espera)
 */
export function formatExampleForPrompt(example) {
  return {
    situacao: example.scenario_name || 'Situação',
    user: example.client_message || '',
    assistant: formatSaraResponse(example),
    reasoning: formatReasoning(example)
  };
}

/**
 * Formata resposta da Sara para o formato esperado
 */
function formatSaraResponse(example) {
  // Se já está em formato JSON string, retorna
  if (typeof example.sara_ideal_response === 'string' && example.sara_ideal_response.startsWith('{')) {
    return example.sara_ideal_response;
  }

  // Senão, formata como texto simples
  return example.sara_ideal_response || '';
}

/**
 * Formata reasoning para o formato esperado
 */
function formatReasoning(example) {
  if (!example.why_this_works) {
    return 'Exemplo de resposta ideal';
  }

  const techniques = example.why_this_works.técnicas_usadas || [];
  return `Técnicas: ${techniques.join(', ')}`;
}

/**
 * Retorna exemplo específico por ID
 */
export function getExampleById(id) {
  const examples = loadExamplesFromJSON();
  return examples.find(ex => ex.scenario_id === id);
}

/**
 * Retorna exemplo específico por nome do cenário
 */
export function getExampleByScenario(scenarioName) {
  const examples = loadExamplesFromJSON();
  return examples.find(ex =>
    ex.scenario_name?.toLowerCase().includes(scenarioName.toLowerCase())
  );
}

/**
 * Estatísticas dos examples
 */
export function getExamplesStats() {
  const examples = loadExamplesFromJSON();

  return {
    total: examples.length,
    scenarios: [...new Set(examples.map(ex => ex.scenario_name))],
    products_covered: [...new Set(
      examples.flatMap(ex => ex.why_this_works?.produtos_mencionados || [])
    )],
    case_studies_used: [...new Set(
      examples.flatMap(ex => ex.why_this_works?.case_studies_usados || [])
    )]
  };
}

/**
 * Recarrega exemplos do arquivo (útil para desenvolvimento)
 */
export function reloadExamples() {
  cachedExamples = null;
  return loadExamplesFromJSON();
}
