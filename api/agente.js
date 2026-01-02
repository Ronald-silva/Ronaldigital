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
// Usa o Catálogo Oficial para manter consistência
function getIntelligentFallback(message, userInfo) {
  const lowerMsg = message.toLowerCase().trim();
  const nome = userInfo.nome || 'Cliente';
  
  console.log(`🔄 FALLBACK API ativo para: "${message}"`);
  
  // 🎯 E-COMMERCE / LOJA
  if ((lowerMsg.includes('quero') || lowerMsg.includes('preciso')) && (lowerMsg.includes('loja') || lowerMsg.includes('roupas') || lowerMsg.includes('vender online'))) {
    const p = SERVICE_CATALOG.ecommerce;
    return `Perfeito, ${nome}! ${p.emotional_hook} 👗✨

Para sua loja, o ideal é o nosso **${p.name}**:
${p.description}

🛍️ **Vantagens para você:**
${p.benefits.map(b => `• ${b}`).join('\n')}

💰 **Investimento:** ${p.price_range}
⏰ **Prazo:** ${p.avg_delivery}

Qual seu orçamento disponível hoje para começarmos?`;
  }

  // 🍕 RESTAURANTE / CARDÁPIO (Pode usar lógica de E-commerce ou criar um novo no catálogo depois)
  if (lowerMsg.includes('restaurante') || lowerMsg.includes('delivery')) {
    const p = SERVICE_CATALOG.ecommerce; // Reusa ecommerce por enquanto ou adapta
    return `Que ótimo, ${nome}! Restaurante é um segmento que vende muito online! 🍕

Recomendo nosso sistema de **${p.name}** adaptado para Delivery:
• Cardápio digital interativo
• Integração com WhatsApp
• Sem taxas por pedido (você lucra mais!)

💰 **Investimento:** ${p.price_range}
⏰ **Prazo:** ${p.avg_delivery}

Isso faz sentido para o seu momento atual?`;
  }

  // 👋 QUEM É VOCÊ?
  if (lowerMsg.includes('qual seu nome') || lowerMsg.includes('quem é você')) {
    return `Oi ${nome}! Eu sou a Sara! 😊

Sou a especialista em inteligência de vendas da Ronald Digital. Minha missão é entender seu negócio e te mostrar exatamente como a tecnologia pode colocar mais dinheiro no seu bolso.

Como posso te ajudar hoje?`;
  }

  // 💰 PREÇO / VALOR
  if (lowerMsg.includes('preço') || lowerMsg.includes('valor') || lowerMsg.includes('custa')) {
    return `Oi! Fico feliz em te ajudar! 😊

Depende bastante do tipo de site. Por exemplo, uma landing page simples sai por uns R$ 500-1.000. Agora se for uma loja online completa, aí já vai pra casa dos R$ 1.200-2.500.

Me conta: é para qual tipo de negócio? Assim consigo te dar um valor mais certinho.`;
  }

  // 🎯 INTERESSE GERAL
  if (lowerMsg.includes('quero') || lowerMsg.includes('preciso') || lowerMsg.includes('site')) {
    return `Legal! Posso te ajudar com isso sim! 🚀

Me conta um pouquinho: que tipo de negócio você tem? É pra vender produtos, captar leads ou mais pra mostrar seu trabalho?

Com isso consigo te indicar a melhor opção e um orçamento bacana!`;
  }

  // 👋 SAUDAÇÕES
  if (lowerMsg.includes('oi') || lowerMsg.includes('olá') || lowerMsg.includes('ola') || lowerMsg.includes('boa tarde') || lowerMsg.includes('bom dia')) {
    return `Oi! Que bom te ver por aqui! 😊

Sou a Sara, ajudo pessoas a transformarem seus negócios na internet.

Como posso te ajudar hoje?`;
  }

  // 🔄 RESPOSTA PADRÃO
  return `Oi! 😊

Me conta: o que você precisa? Tô aqui pra te ajudar!`;
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