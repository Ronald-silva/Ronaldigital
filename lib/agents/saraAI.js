import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";
import { ChatAnthropic } from "@langchain/anthropic";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import fs from 'fs';
import path from 'path';
import { getCatalogForPrompt, SALES_TECHNIQUES } from './knowledgeBase.js';

// Sistema de múltiplas APIs com fallback automático via LangChain
class MultiAPIManager {
  constructor() {
    this.models = {};
    this.initializeModels();
  }

  initializeModels() {
    // Anthropic Context (Claude 3.5 Sonnet - O MELHOR para Humanização)
    if (process.env.ANTHROPIC_API_KEY) {
      try {
        this.models.anthropic = new ChatAnthropic({
          apiKey: process.env.ANTHROPIC_API_KEY,
          modelName: "claude-3-5-sonnet-20240620", // Versão mais recente e poderosa
          temperature: 0.7,
        });
        console.log("✅ Anthropic (Claude 3.5) inicializada - MODO ULTRA INTELIGENTE ATIVO");
      } catch (error) {
        console.warn("⚠️ Erro ao inicializar Anthropic:", error.message);
      }
    }

    // Grok (Backup rápido)
    if (process.env.GROK_API_KEY) {
      try {
        this.models.grok = new ChatGroq({
          apiKey: process.env.GROK_API_KEY,
          modelName: "mixtral-8x7b-32768",
          temperature: 0.7,
        });
        console.log("✅ Grok API inicializada");
      } catch (error) {
        console.warn("⚠️ Erro ao inicializar Grok:", error.message);
      }
    }

    // Gemini (Fallback econômico / rápido)
    const geminiApiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (geminiApiKey) {
      try {
        this.models.gemini = new ChatGoogleGenerativeAI({
          apiKey: geminiApiKey,
          model: "gemini-2.0-flash",
          temperature: 0.7,
          maxOutputTokens: 1024,
        });
        console.log("✅ Gemini 2.0 Flash inicializado");
      } catch (error) {
        console.warn("⚠️ Erro ao inicializar Gemini (v1):", error.message);
      }
    }
  }

  getModel() {
    // Prioridade Absoluta: Claude 3.5 Sonnet
    if (this.models.anthropic) return this.models.anthropic;
    if (this.models.grok) return this.models.grok;
    if (this.models.gemini) return this.models.gemini;
    
    // Mock para testes
    console.warn("⚠️ Nenhuma API configurada. Sara vai rodar em modo simulação.");
    return {
      invoke: async () => ({ content: "Erro: Nenhuma chave de API configurada (Anthropic, Grok ou Gemini)." })
    };
  }
}

// Classe principal do Mega Cérebro da Sara
export class SaraAI {
  constructor() {
    this.apiManager = new MultiAPIManager();
    this.loadPersonas();
    this.serviceKnowledge = getCatalogForPrompt(); 
  }

  loadPersonas() {
    try {
      const dataPath = path.join(process.cwd(), 'data');
      try {
        this.personas = {
          sara: JSON.parse(fs.readFileSync(path.join(dataPath, 'sara_personality.json'), 'utf8')),
          rackham: JSON.parse(fs.readFileSync(path.join(dataPath, 'persona_rackham.json'), 'utf8')),
          konrath: JSON.parse(fs.readFileSync(path.join(dataPath, 'persona_konrath.json'), 'utf8')),
          vaynerchuk: JSON.parse(fs.readFileSync(path.join(dataPath, 'persona_vaynerchuk.json'), 'utf8'))
        };
      } catch (e) {
        console.warn("⚠️ Arquivos de persona não encontrados, usando defaults.");
        this.personas = {
          sara: { role: "Assistente de Marketing", methodology: "Inbound Marketing" },
          rackham: { role: "Especialista SPIN", methodology: "SPIN Selling" }
        };
      }
    } catch (error) {
      console.error("❌ Erro ao carregar personas:", error);
    }
  }

  // Processa mensagem com LangChain e Memória
  async processMessage(userMessage, userInfo = {}, chatHistory = []) {
    try {
      const model = this.apiManager.getModel();
      
      // 1. Identificar o Especialista (Router)
      const expert = this.determineExpert(chatHistory, userMessage);
      
      // 2. Gerar Resposta Técnica do Especialista
      const expertResponse = await this.generateExpertResponse(model, expert, userMessage, userInfo, chatHistory);
      
      // 3. Humanização da Sara (Tone Filter)
      const finalResponse = await this.applySaraFilter(model, expertResponse, expert, userInfo);

      return {
        success: true,
        response: finalResponse.response, // Texto para o usuário
        conversationStage: expert,
        leadScore: this.calculateLeadScore(userInfo, chatHistory),
        nextAction: finalResponse.suggested_actions?.[0] || "continuar",
        activeAgent: expert,
        data: finalResponse // Objeto completo para o frontend
      };

    } catch (error) {
      console.error("Erro no processamento SaraAI:", error);
      return this.getFallbackResponse(userInfo);
    }
  }

  determineExpert(history, _message) {
    // Lógica simples baseada no tamanho do histórico
    const msgCount = history.length;
    if (msgCount < 2) return "neil_rackham"; // Início: Investigação (SPIN)
    if (msgCount < 6) return "jill_konrath"; // Meio: Consultoria e Recomendação (BANT)
    return "gary_vaynerchuk"; // Fim: Fechamento Inesquecível (Value)
  }

  async generateExpertResponse(model, expertKey, message, userInfo, history) {
    const expertPersona = this.personas[expertKey.split('_')[1]] || this.personas.rackham;
    
    // Formata histórico para o prompt
    const historyText = history.map(h => `${h.role === 'user' ? 'Cliente' : 'Sara'}: ${h.content}`).join('\n');

    const systemPromptBase = `
    ATUE COMO: ${expertPersona.role || "Especialista em Vendas Consultivas"}.
    SUA METODOLOGIA: ${expertPersona.methodology || "SPIN Selling"}.

    NOSSOS PRODUTOS E SERVIÇOS (Use isso para sugerir a solução ideal):
    ${this.serviceKnowledge}

    CONTEXTO DO CLIENTE:
    Nome: ${userInfo.nome || "Cliente (Nome não informado)"}
    Email: ${userInfo.email || "Não informado"}
    Negócio/Contexto: ${userInfo.tipoNegocio || userInfo.tipoServico || "Não informado"}
    
    HISTÓRICO DA CONVERSA:
    ${historyText}

    SUA MISSÃO TÉCNICA:
    1. Analise profundamente a entrada do usuário.
    2. Identifique dores ocultas e necessidades não ditas.
    3. Se houver informações suficientes, RECOMENDE um dos nossos serviços do catálogo que resolva a dor específica. Justifique tecnicamente.
    4. Se não houver info suficiente, faça as perguntas certas (Investigação) baseadas na sua metodologia.
    5. Não tente ser "simpático" demais aqui, foque na ESTRATÉGIA e na SOLUÇÃO CERTA. A Sara vai humanizar depois.
    `;

    try {
      const messages = [
        new SystemMessage(systemPromptBase),
        new HumanMessage(message)
      ];

      const response = await model.invoke(messages);
      return response.content;
    } catch (e) {
      console.error("Erro com modelo principal (Generate), tentando fallback:", e.message);
      return this.useFallbackModel(systemPromptBase, message);
    }
  }

  async applySaraFilter(model, draftResponse, _expertUsed, userInfo) {
    const emotionalConnectors = SALES_TECHNIQUES.emotional_connectors.join(', ');
    const urgencyTriggers = SALES_TECHNIQUES.urgency_triggers.join(', ');

    const systemPromptBase = `
    VOCÊ É A SARA: A IA Especialista em Vendas e Marketing da RonalDigital.
    Sua personalidade: Altamente empática, entusiasmada, inteligente e brasileira.
    
    SUA MISSÃO:
    Transformar a análise técnica fria abaixo em uma RESPOSTA INESQUECÍVEL que gere conexão emocional imediata.
    
    DADOS DO CLIENTE:
    Nome: ${userInfo.nome || "Cliente"}
    
    TÉCNICAS DE CONEXÃO (Use sutilmente):
    - Conectores Emocionais: "${emotionalConnectors}"
    - Gatilhos de Urgência (se apropriado): "${urgencyTriggers}"
    
    DIRETRIZES DE ESTILO:
    1. Comece sempre validando o sentimento ou ideia do cliente (Empatia Radical).
    2. Use emojis estrategicamente (✨, 🚀, 💡, 🤝) para dar vida ao texto.
    3. Seja consultiva: Não "empurre" venda, mostre que você encontrou a solução perfeita para a *dor* dele.
    4. Use o "Gancho Emocional" do produto se ele foi mencionado na análise técnica.
    5. Termine com uma pergunta clara ou um Call to Action convidativo (ex: "Bora tirar esse projeto do papel?").
    6. Fale como uma especialista humana e confiante, não como um robô de suporte.
    
    ANÁLISE TÉCNICA (Base para sua resposta):
    "${draftResponse}"
    
    FORMATO DE SAÍDA (JSON OBRIGATÓRIO):
    {
      "response": "Sua mensagem final humanizada e persuasiva aqui...",
      "sentiment": "positive/neutral/negative",
      "suggested_actions": ["Ação Sugerida 1 (ex: Ver Portfólio)", "Ação Sugerida 2 (ex: Agendar Reunião)"]
    }
    `;

    try {
      const messages = [
        new SystemMessage(systemPromptBase),
        new HumanMessage("Humanize e potencialize a resposta técnica agora. Retorne JSON.")
      ];

      const response = await model.invoke(messages);
      const resultStr = response.content;
      
      try {
        // Tenta limpar e parsear JSON
        const jsonStr = resultStr.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);
      } catch (jsonError) {
        console.warn("Retorno não foi um JSON puro, tentando recuperar...");
        // Se falhar o JSON, retorna um objeto básico com o texto bruto
        return {
          response: resultStr,
          sentiment: "neutral",
          suggested_actions: ["Continuar"]
        };
      }
    } catch (e) {
      console.error("Erro no filtro Sara:", e.message);
      // Tenta fallback com modelo secundário se o primário falhar
      const fallbackResponse = await this.useFallbackModel(systemPromptBase, "Humanize e potencialize a resposta técnica agora. Retorne JSON.");
      try {
          const jsonStr = fallbackResponse.replace(/```json/g, '').replace(/```/g, '').trim();
          return JSON.parse(jsonStr);
      } catch (err) {
          return {
              response: draftResponse,
              sentiment: "neutral",
              suggested_actions: ["Continuar Conversa"]
          };
      }
    }
  }

  // Fallback genérico para usar outro modelo se o principal falhar
  async useFallbackModel(systemPrompt, userMessage) {
    if (this.apiManager.models.grok) {
      try {
         const messages = [
          new SystemMessage(systemPrompt),
          new HumanMessage(userMessage)
        ];
        const res = await this.apiManager.models.grok.invoke(messages);
        return res.content;
      } catch(e) { console.error("Erro no Fallback Grok:", e.message); }
    }
    return "Estou analisando seu projeto...";
  }

  calculateLeadScore(userInfo, history) {
    let score = 0;
    const intentKeywords = ['preço', 'orçamento', 'comprar', 'contratar', 'valor', 'urgente'];
    const lastMsg = history[history.length - 1]?.content.toLowerCase() || '';
    
    if (intentKeywords.some(k => lastMsg.includes(k))) score += 2;
    if (userInfo.email) score += 1;
    if (userInfo.telefone) score += 1;
    if (history.length > 3) score += 1;
    
    return Math.min(score, 5); 
  }

  getFallbackResponse(userInfo) {
    return {
      success: true,
      response: `Oi ${userInfo.nome || ''}! Tive um pequeno lapso técnico, mas já voltei! 😅 Basicamente, quero dizer que sua ideia tem um potencial incrível e nós temos exatamente a tecnologia para fazer isso acontecer. Me conta: você tem preferência por começar rápido ou focar em algo mais robusto agora?`,
      conversationStage: "fallback",
      leadScore: 1,
      nextAction: "perguntar_preferencia",
      activeAgent: "sara_fallback",
      data: {
        response: `Oi ${userInfo.nome || ''}! Tive um pequeno lapso técnico, mas já voltei! 😅 Basicamente, quero dizer que sua ideia tem um potencial incrível e nós temos exatamente a tecnologia para fazer isso acontecer. Me conta: você tem preferência por começar rápido ou focar em algo mais robusto agora?`,
        sentiment: "positive",
        suggested_actions: ["Começar Rápido", "Projeto Robusto"]
      }
    };
  }
}