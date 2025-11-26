import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";
import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import fs from 'fs';
import path from 'path';

// Sistema de múltiplas APIs com fallback automático via LangChain
class MultiAPIManager {
  constructor() {
    this.models = {};
    this.initializeModels();
  }

  initializeModels() {
    // Grok (Principal - temporariamente)
    if (process.env.GROK_API_KEY) {
      try {
        this.models.grok = new ChatGroq({
          apiKey: process.env.GROK_API_KEY,
          modelName: "mixtral-8x7b-32768", // Modelo mais estável
          temperature: 0.7,
        });
        console.log("✅ Grok API inicializada");
      } catch (error) {
        console.warn("⚠️ Erro ao inicializar Grok:", error.message);
      }
    }

    // Gemini (Desabilitado temporariamente devido a problemas de modelo)
    // if (process.env.GEMINI_API_KEY) {
    //   try {
    //     this.models.gemini = new ChatGoogleGenerativeAI({
    //       apiKey: process.env.GEMINI_API_KEY,
    //       modelName: "gemini-1.5-pro-latest",
    //       maxOutputTokens: 2048,
    //       temperature: 0.7,
    //     });
    //     console.log("✅ Gemini API (LangChain) inicializada");
    //   } catch (error) {
    //     console.warn("⚠️ Erro ao inicializar Gemini:", error.message);
    //   }
    // }

    // OpenAI (Fallback)
    if (process.env.OPENAI_API_KEY) {
      try {
        this.models.openai = new ChatOpenAI({
          apiKey: process.env.OPENAI_API_KEY,
          modelName: "gpt-3.5-turbo",
          temperature: 0.7,
        });
        console.log("✅ OpenAI API inicializada");
      } catch (error) {
        console.warn("⚠️ Erro ao inicializar OpenAI:", error.message);
      }
    }
  }

  getModel() {
    if (this.models.grok) return this.models.grok;
    if (this.models.gemini) return this.models.gemini;
    if (this.models.openai) return this.models.openai;
    // Mock para testes se não houver chaves (evita crash imediato, mas falhará na chamada)
    console.warn("⚠️ Nenhuma API configurada. Usando mock para evitar crash.");
    return {
      invoke: async () => ({ content: "Erro: Nenhuma API de IA configurada." })
    };
  }
}

// Classe principal do Mega Cérebro da Sara
export class SaraAI {
  constructor() {
    this.apiManager = new MultiAPIManager();
    this.loadPersonas();
  }

  loadPersonas() {
    try {
      const dataPath = path.join(process.cwd(), 'data');
      // Tenta carregar, se falhar usa defaults
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

  determineExpert(history, message) {
    // Lógica simples baseada no tamanho do histórico (pode ser melhorada com LLM)
    const msgCount = history.length;
    if (msgCount < 2) return "neil_rackham"; // Início: Investigação (SPIN)
    if (msgCount < 5) return "jill_konrath"; // Meio: Qualificação (BANT)
    return "gary_vaynerchuk"; // Fim: Fechamento (Value)
  }

  async generateExpertResponse(model, expertKey, message, userInfo, history) {
    const expertPersona = this.personas[expertKey.split('_')[1]] || this.personas.rackham;
    
    // Formata histórico para o prompt
    const historyText = history.map(h => `${h.role === 'user' ? 'Cliente' : 'Sara'}: ${h.content}`).join('\n');

    const prompt = PromptTemplate.fromTemplate(`
      Você é {role}.
      Sua metodologia é: {methodology}.
      
      CONTEXTO DO CLIENTE:
      Nome: {name}
      Negócio: {business}
      Tipo Projeto: {project}
      
      HISTÓRICO DA CONVERSA:
      {history}
      
      CLIENTE DISSE: "{input}"
      
      Sua tarefa é gerar uma resposta técnica e estratégica seguindo sua metodologia.
      Não se preocupe com o tom final, apenas com o conteúdo estratégico.
      
      RESPOSTA TÉCNICA:
    `);

    // Tenta com o modelo principal, se falhar usa fallback
    try {
      const systemPrompt = `Você é ${expertPersona.role || "Especialista em Vendas"}.
Sua metodologia é: ${expertPersona.methodology || "SPIN Selling"}.

CONTEXTO DO CLIENTE:
Nome: ${userInfo.nome || "Cliente"}
Negócio: ${userInfo.tipoNegocio || "Não informado"}
Tipo Projeto: ${userInfo.tipoServico || "Site"}

HISTÓRICO DA CONVERSA:
${historyText}

Sua tarefa é gerar uma resposta técnica e estratégica seguindo sua metodologia.
Não se preocupe com o tom final, apenas com o conteúdo estratégico.`;

      const messages = [
        new SystemMessage(systemPrompt),
        new HumanMessage(message)
      ];

      const response = await model.invoke(messages);
      return response.content;
    } catch (e) {
      console.error("Erro com modelo principal, tentando fallback:", e.message);
      
      // Tenta com Grok se disponível
      if (this.apiManager.models.grok && model !== this.apiManager.models.grok) {
        try {
          const systemPrompt = `Você é ${expertPersona.role || "Especialista em Vendas"}.
Sua metodologia é: ${expertPersona.methodology || "SPIN Selling"}.

CONTEXTO DO CLIENTE:
Nome: ${userInfo.nome || "Cliente"}
Negócio: ${userInfo.tipoNegocio || "Não informado"}
Tipo Projeto: ${userInfo.tipoServico || "Site"}

HISTÓRICO DA CONVERSA:
${historyText}

Sua tarefa é gerar uma resposta técnica e estratégica seguindo sua metodologia.
Não se preocupe com o tom final, apenas com o conteúdo estratégico.`;

          const messages = [
            new SystemMessage(systemPrompt),
            new HumanMessage(message)
          ];

          const response = await this.apiManager.models.grok.invoke(messages);
          return response.content;
        } catch (fallbackError) {
          console.error("Erro também no fallback:", fallbackError.message);
        }
      }
      
      return "Desculpe, estou analisando seu caso.";
    }
  }

  async applySaraFilter(model, draftResponse, expertUsed, userInfo) {
    const parser = new StringOutputParser();
    
    const systemPrompt = `
      Você é a SARA, a IA especialista em marketing da Ronald Digital.
      Sua missão é traduzir a resposta técnica de um especialista ({expert}) para uma linguagem humana, brasileira, carismática e vendedora.
      
      DIRETRIZES DE TOM:
      - Use emojis pontuais (😊, 🚀, 💡).
      - Fale em primeira pessoa ("Eu acho...", "Nós podemos...").
      - Seja empática mas profissional.
      - NUNCA soe robótica ou corporativa demais.
      - Se o especialista sugeriu uma pergunta dura, suavize-a.
      
      DADOS DO CLIENTE:
      Nome: {name}
      
      RESPOSTA TÉCNICA ORIGINAL:
      "{draft}"
      
      SAÍDA ESPERADA (JSON):
      Retorne APENAS um JSON válido com esta estrutura:
      {{
        "response": "Sua resposta reescrita aqui...",
        "sentiment": "positive/neutral/negative",
        "suggested_actions": ["Ação 1", "Ação 2"]
      }}
    `;

    const prompt = PromptTemplate.fromTemplate(systemPrompt);

    // Tenta com o modelo principal, se falhar usa fallback
    try {
      const systemPrompt = `Você é a SARA, a IA especialista em marketing da Ronald Digital.
Sua missão é traduzir a resposta técnica de um especialista (${expertUsed}) para uma linguagem humana, brasileira, carismática e vendedora.

DIRETRIZES DE TOM:
- Use emojis pontuais (😊, 🚀, 💡).
- Fale em primeira pessoa ("Eu acho...", "Nós podemos...").
- Seja empática mas profissional.
- NUNCA soe robótica ou corporativa demais.
- Se o especialista sugeriu uma pergunta dura, suavize-a.

DADOS DO CLIENTE:
Nome: ${userInfo.nome || "Cliente"}

RESPOSTA TÉCNICA ORIGINAL:
"${draftResponse}"

SAÍDA ESPERADA (JSON):
Retorne APENAS um JSON válido com esta estrutura:
{
  "response": "Sua resposta reescrita aqui...",
  "sentiment": "positive/neutral/negative",
  "suggested_actions": ["Ação 1", "Ação 2"]
}`;

      const messages = [
        new SystemMessage(systemPrompt),
        new HumanMessage("Reescreva a resposta técnica seguindo as diretrizes.")
      ];

      const response = await model.invoke(messages);
      const resultStr = response.content;
      
      // Limpeza básica para garantir JSON válido (remove markdown ```json ... ```)
      const jsonStr = resultStr.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error("Erro com modelo principal no filtro Sara, tentando fallback:", e.message);
      
      // Tenta com Grok se disponível
      if (this.apiManager.models.grok && model !== this.apiManager.models.grok) {
        try {
          const systemPrompt = `Você é a SARA, a IA especialista em marketing da Ronald Digital.
Sua missão é traduzir a resposta técnica de um especialista (${expertUsed}) para uma linguagem humana, brasileira, carismática e vendedora.

DIRETRIZES DE TOM:
- Use emojis pontuais (😊, 🚀, 💡).
- Fale em primeira pessoa ("Eu acho...", "Nós podemos...").
- Seja empática mas profissional.
- NUNCA soe robótica ou corporativa demais.
- Se o especialista sugeriu uma pergunta dura, suavize-a.

DADOS DO CLIENTE:
Nome: ${userInfo.nome || "Cliente"}

RESPOSTA TÉCNICA ORIGINAL:
"${draftResponse}"

SAÍDA ESPERADA (JSON):
Retorne APENAS um JSON válido com esta estrutura:
{
  "response": "Sua resposta reescrita aqui...",
  "sentiment": "positive/neutral/negative",
  "suggested_actions": ["Ação 1", "Ação 2"]
}`;

          const messages = [
            new SystemMessage(systemPrompt),
            new HumanMessage("Reescreva a resposta técnica seguindo as diretrizes.")
          ];

          const response = await this.apiManager.models.grok.invoke(messages);
          const resultStr = response.content;
          
          const jsonStr = resultStr.replace(/```json/g, '').replace(/```/g, '').trim();
          return JSON.parse(jsonStr);
        } catch (fallbackError) {
          console.error("Erro também no fallback do filtro Sara:", fallbackError.message);
        }
      }
      
      return {
        response: draftResponse, // Fallback para o texto original
        sentiment: "neutral",
        suggested_actions: []
      };
    }
  }

  calculateLeadScore(userInfo, history) {
    // Implementação simplificada de score
    let score = 0;
    if (userInfo.email) score += 1;
    if (userInfo.telefone) score += 1;
    if (history.length > 4) score += 1;
    if (userInfo.orcamento) score += 1;
    return Math.min(score, 4);
  }

  getFallbackResponse(userInfo) {
    return {
      success: true,
      response: `Oi ${userInfo.nome || ''}! Tive um pequeno lapso aqui, mas já voltei! 😅 Como eu estava dizendo, podemos criar um projeto incrível para você. Me conta mais sobre o que você precisa?`,
      conversationStage: "fallback",
      leadScore: 0,
      nextAction: "continuar",
      activeAgent: "sara_fallback",
      data: {
        response: `Oi ${userInfo.nome || ''}! Tive um pequeno lapso aqui, mas já voltei! 😅 Como eu estava dizendo, podemos criar um projeto incrível para você. Me conta mais sobre o que você precisa?`,
        sentiment: "neutral",
        suggested_actions: ["Falar sobre Projeto", "Ver Portfólio"]
      }
    };
  }
}