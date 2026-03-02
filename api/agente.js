import { SaraAI } from "../lib/agents/saraAI.js";
import { SaraAIv2 } from "../lib/agents/saraAI-v2.js";
import { SERVICE_CATALOG } from "../lib/agents/knowledgeBase.js";
import cors from "cors";

// 🚀 FEATURE FLAG: Sara 2.0
// Set SARA_V2=true para ativar Sara 2.0 (recomendado)
// Set SARA_V2=false ou não setar para usar versão anterior
const USE_SARA_V2 = process.env.SARA_V2 === 'true' || process.env.SARA_V2 === '1';

// Configuração CORS
const corsOptions = {
  origin: process.env.VERCEL_URL || "*",
  methods: ["POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

// Middleware CORS
function runCors(req, res) {
  return new Promise((resolve, reject) => {
    cors(corsOptions)(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  // Aplica CORS
  await runCors(req, res);

  // Só aceita POST
  if (req.method !== "POST") {
    return res.status(405).json({ 
      error: "Método não permitido",
      message: "Use POST para enviar dados do formulário" 
    });
  }

  try {
    // Valida dados do formulário
    const { nome, email, mensagem, tipoServico, chatHistory } = req.body;
    
    if (!nome || !email || !mensagem) {
      return res.status(400).json({
        error: "Dados obrigatórios ausentes",
        message: "Nome, email e mensagem são obrigatórios"
      });
    }

    // Valida email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Email inválido",
        message: "Forneça um email válido"
      });
    }

    // Log para debug (remover em produção)
    console.log("\n🔥 === NOVA REQUISIÇÃO ===");
    console.log("📧 Lead:", { nome, email, tipoServico });
    console.log(`🤖 Sara: ${USE_SARA_V2 ? 'v2.0 (Moderna)' : 'v1.0 (Legada)'}`);
    console.log(`📝 Mensagem: "${mensagem.substring(0, 50)}..."`);

    // Inicializa a Sara AI (v2 ou v1 baseado na feature flag)
    const sara = USE_SARA_V2 ? new SaraAIv2() : new SaraAI();
    console.log("✅ Sara AI inicializada");

    // Processa a mensagem
    const resultado = await sara.processMessage(mensagem, {
      nome,
      email,
      tipoServico
    }, chatHistory || []);

    // Log do resultado (remover em produção)
    console.log("Resultado do agente:", resultado);

    // Retorna resposta da Sara AI
    if (resultado.success) {
      // Sara AI v2 usa 'response', mas frontend espera 'resposta'
      const respostaTexto = resultado.response || resultado.resposta || "Desculpe, não consegui processar sua mensagem.";

      console.log("✅ Sara respondeu:", respostaTexto.substring(0, 50) + "...");

      return res.status(200).json({
        success: true,
        resposta: respostaTexto,
        etapa: resultado.conversationStage || 'descoberta',
        leadScore: resultado.leadScore || 0,
        proximaAcao: resultado.nextAction || 'continuar',
        agenteAtivo: resultado.activeAgent || 'sara',
        timestamp: new Date().toISOString(),
        data: resultado.data || {} // Dados estruturados extras
      });
    } else {
      console.error("❌ Sara retornou erro:", resultado.error);
      return res.status(500).json({
        success: false,
        error: resultado.error,
        resposta: resultado.response || resultado.resposta || "Erro interno do sistema"
      });
    }

  } catch (error) {
    console.error("Erro na API do agente:", error);
    
    // 🔄 FALLBACK INTELIGENTE QUANDO SARA AI FALHA
    const { nome, email, tipoServico, mensagem } = req.body;
    const fallbackResponse = getIntelligentFallback(mensagem || "", { nome, email, tipoServico });
    
    return res.status(200).json({
      success: true,
      resposta: fallbackResponse,
      etapa: "fallback",
      leadScore: calculateFallbackLeadScore(mensagem || ""),
      proximaAcao: "continuar_qualificacao",
      agenteAtivo: "sara_fallback",
      timestamp: new Date().toISOString(),
      fallback: true
    });
  }
}

// 🧠 FALLBACK INTELIGENTE DA API
// Processa contexto específico antes de respostas genéricas
function getIntelligentFallback(message, userInfo) {
  const lowerMsg = message.toLowerCase().trim();
  const nome = userInfo.nome || '';
  const saudacao = nome ? `${nome}, ` : '';

  console.log(`🔄 FALLBACK API ativo para: "${message}"`);

  // 🔥 BARBEARIA + IA (COMBINAÇÃO ESPECÍFICA - ALTA PRIORIDADE)
  if ((lowerMsg.includes('barbearia') || lowerMsg.includes('barbeiro') || lowerMsg.includes('salão') || lowerMsg.includes('salao')) &&
      (lowerMsg.includes('ia') || lowerMsg.includes('inteligencia artificial') || lowerMsg.includes('agente') || lowerMsg.includes('atendimento') || lowerMsg.includes('chatbot'))) {
    return `Perfeito, ${saudacao}barbearia com IA é exatamente minha especialidade! 💈🤖

Desenvolvi um sistema completo de agendamento com IA integrada. Você pode ver no meu portfólio (BarberFlow).

**O que inclui:**
• Site profissional pra barbearia
• Sistema de agendamento online 24h
• IA que atende e agenda automaticamente

💰 **Investimento:** R$ 1.800-2.500 (site + IA)
📅 **Prazo:** 10-14 dias

Você já tem identidade visual (logo, cores) ou precisa criar também?`;
  }

  // 💈 BARBEARIA (sem mencionar IA)
  if (lowerMsg.includes('barbearia') || lowerMsg.includes('barbeiro')) {
    return `Show! Barbearia é um segmento que domino! 💈

Posso criar um site profissional com sistema de agendamento online. Cliente agenda sozinho 24h, você só atende!

💰 **Investimento:** R$ 800-1.500 (site com agenda)
📅 **Prazo:** 7-10 dias

Você também se interessaria por uma IA para atender clientes automaticamente?`;
  }

  // 🤖 INTERESSE EM IA/AGENTE
  if (lowerMsg.includes('ia') || lowerMsg.includes('inteligencia artificial') || lowerMsg.includes('agente de ia') || lowerMsg.includes('chatbot')) {
    return `Legal! IA para atendimento é poderosa! 🤖

Desenvolvi projetos de IA que atendem 24h, qualificam leads e agendam automaticamente.

**Como funciona:**
• IA responde instantaneamente
• Qualifica o cliente automaticamente
• Agenda ou transfere pra você quando necessário

💰 **Investimento:** R$ 1.000-2.500 (setup) + R$ 150-300/mês

Pra qual tipo de negócio você precisa?`;
  }

  // 🍕 RESTAURANTE / CARDÁPIO
  if (lowerMsg.includes('restaurante') || lowerMsg.includes('delivery')) {
    return `Que ótimo! Restaurante é um segmento que vende muito online! 🍕

• Cardápio digital interativo
• Sistema de pedidos online
• Integração com WhatsApp

💰 **Investimento:** R$ 800-1.800
📅 **Prazo:** 7-12 dias

Isso faz sentido pra você?`;
  }

  // 👋 QUEM É VOCÊ?
  if (lowerMsg.includes('qual seu nome') || lowerMsg.includes('quem é você')) {
    return `Oi! Eu sou a Sara! 😊

Sou especialista em marketing digital da Ronald Digital. Minha missão é te ajudar a crescer na internet com sites que realmente funcionam.

Como posso te ajudar hoje?`;
  }

  // 💰 PREÇO / VALOR
  if (lowerMsg.includes('preço') || lowerMsg.includes('valor') || lowerMsg.includes('custa')) {
    return `Oi! Fico feliz em te ajudar! 😊

Depende do tipo de projeto:
• Landing page: R$ 500-1.000
• Portfólio: R$ 400-800
• Site institucional: R$ 800-2.000
• Agente de IA: sob consulta

É pra qual tipo de negócio? Assim dou um valor mais certinho.`;
  }

  // 🎯 INTERESSE EM SITE (genérico)
  if (lowerMsg.includes('site') && (lowerMsg.includes('quero') || lowerMsg.includes('preciso'))) {
    return `Show! Pra te dar o melhor orçamento:

Qual tipo de negócio você tem? E precisa de alguma funcionalidade específica (agendamento, loja online, chat)?`;
  }

  // 👋 SAUDAÇÕES
  if (lowerMsg.includes('oi') || lowerMsg.includes('olá') || lowerMsg.includes('ola') || lowerMsg.includes('boa tarde') || lowerMsg.includes('bom dia')) {
    return `Oi! Que bom te ver por aqui! 😊

Sou a Sara, especialista em criar sites que vendem!

Como posso te ajudar hoje?`;
  }

  // 🔄 RESPOSTA PADRÃO - mais contextual
  return `Oi! 😊

Me conta mais sobre o que você precisa - qual seu negócio e o que quer alcançar?`;
}

// 📊 CALCULA LEAD SCORE NO FALLBACK
function calculateFallbackLeadScore(message) {
  const lowerMsg = message.toLowerCase();
  let score = 0;
  if (lowerMsg.includes('quero') || lowerMsg.includes('preciso')) score += 1;
  if (lowerMsg.includes('loja') || lowerMsg.includes('site') || lowerMsg.includes('landing')) score += 1;
  if (lowerMsg.includes('roupas') || lowerMsg.includes('restaurante')) score += 1;
  if (lowerMsg.includes('urgente') || lowerMsg.includes('rápido')) score += 1;
  return Math.min(score, 4);
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb"
    },
    responseLimit: "8mb"
  }
};