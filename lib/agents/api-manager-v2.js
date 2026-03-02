// Sistema de Gerenciamento de Múltiplas APIs - Versão 2.0
// Suporte para Gemini 2.0 Flash, Claude 3 Haiku e Grok/Mixtral

import { ChatAnthropic } from "@langchain/anthropic";
import { ChatGroq } from "@langchain/groq";
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Gerenciador moderno de APIs com modelos state-of-the-art
 *
 * Prioridade:
 * 1. Gemini 2.0 Flash - Rápido e econômico (principal)
 * 2. Claude 3 Haiku - Melhor qualidade (fallback)
 * 3. Grok (Mixtral) - Último recurso
 */
export class MultiAPIManagerV2 {
  constructor() {
    this.models = {};
    this.modelPriority = [];
    this.initializeModels();
  }

  /**
   * Inicializa todos os modelos disponíveis baseado nas variáveis de ambiente
   */
  initializeModels() {
    // 🥇 PRIORIDADE 1: Gemini 2.0 Flash (Google)
    // Melhor para: Respostas rápidas, custo-benefício (principal)
    const geminiApiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (geminiApiKey) {
      try {
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const model = genAI.getGenerativeModel({
          model: "gemini-2.0-flash",
        });

        // Wrapper para manter interface .invoke(messages)
        this.models.gemini = {
          /**
           * Invoca o Gemini usando systemInstruction + histórico via startChat
           * @param {Array} messages - Array de mensagens LangChain (SystemMessage/HumanMessage/AIMessage)
           */
          async invoke(messages) {
            if (!messages || messages.length === 0) {
              throw new Error("Nenhuma mensagem fornecida para o Gemini");
            }

            const systemMsg = messages[0];
            const otherMessages = messages.slice(1);

            const systemInstruction =
              typeof systemMsg?.content === "string" ? systemMsg.content : "";

            const history = otherMessages.slice(0, -1).map((msg) => {
              const role = msg?._getType?.() === "human" || msg?.role === "user"
                ? "user"
                : "model";
              const text =
                typeof msg?.content === "string"
                  ? msg.content
                  : Array.isArray(msg?.content)
                  ? msg.content.map((c) => c?.text || "").join(" ")
                  : "";
              return {
                role,
                parts: [{ text }],
              };
            });

            const lastMsg = otherMessages[otherMessages.length - 1] || systemMsg;
            const lastText =
              typeof lastMsg?.content === "string"
                ? lastMsg.content
                : Array.isArray(lastMsg?.content)
                ? lastMsg.content.map((c) => c?.text || "").join(" ")
                : "";

            const chat = model.startChat({
              systemInstruction,
              history,
            });

            const result = await chat.sendMessage(lastText);
            const text = result.response.text();

            return { content: text };
          },
        };

        this.modelPriority.push('gemini');
        console.log("✅ Gemini 2.0 Flash inicializado (Prioridade 1)");
      } catch (error) {
        console.warn("⚠️ Erro ao inicializar Gemini 2.0 Flash:", error.message);
      }
    }

    // 🥈 PRIORIDADE 2: Claude 3 Haiku (Anthropic)
    // Melhor para: Conversação natural, humanização, empatia (fallback de qualidade)
    if (process.env.ANTHROPIC_API_KEY) {
      try {
        this.models.claude = new ChatAnthropic({
          anthropicApiKey: process.env.ANTHROPIC_API_KEY,
          modelName: "claude-3-haiku-20240307",
          temperature: 0.7,
          maxTokens: 1024,
        });
        this.modelPriority.push('claude');
        console.log("✅ Claude 3 Haiku inicializado (Prioridade 2)");
      } catch (error) {
        console.warn("⚠️ Erro ao inicializar Claude:", error.message);
      }
    }

    // 🔄 FALLBACK: Grok (Groq)
    // Mantido como último recurso para compatibilidade
    if (process.env.GROK_API_KEY) {
      try {
        this.models.grok = new ChatGroq({
          apiKey: process.env.GROK_API_KEY,
          modelName: "mixtral-8x7b-32768",
          temperature: 0.7,
        });
        this.modelPriority.push('grok');
        console.log("✅ Grok (Mixtral) inicializado (Fallback)");
      } catch (error) {
        console.warn("⚠️ Erro ao inicializar Grok:", error.message);
      }
    }

    // Validação
    if (this.modelPriority.length === 0) {
      console.error("❌ CRÍTICO: Nenhum modelo de IA foi inicializado!");
      console.error("Configure pelo menos uma das seguintes variáveis:");
      console.error("  - ANTHROPIC_API_KEY (Claude 3 - Recomendado)");
      console.error("  - GEMINI_API_KEY ou VITE_GEMINI_API_KEY (Gemini 2.0 Flash)");
      console.error("  - GROK_API_KEY (Mixtral - Fallback)");
    } else {
      console.log(`\n🎯 Modelos disponíveis: ${this.modelPriority.join(', ')}`);
      console.log(`🏆 Modelo principal: ${this.modelPriority[0]}\n`);
    }
  }

  /**
   * Retorna o melhor modelo disponível para conversação geral
   * Prioriza Claude > GPT-4o > Gemini > Grok
   */
  getBestModel() {
    if (this.modelPriority.length === 0) {
      throw new Error("Nenhum modelo de IA disponível. Configure as variáveis de ambiente.");
    }

    const modelKey = this.modelPriority[0];
    return this.models[modelKey];
  }

  /**
   * Retorna um modelo rápido para tarefas simples (classificação, análise de intenção)
   * Prioriza velocidade e custo
   */
  getFastModel() {
    // Prefere Gemini Flash para tarefas rápidas
    if (this.models.gemini) return this.models.gemini;

    // Depois GPT-4o (também rápido)
    if (this.models.gpt4) return this.models.gpt4;

    // Fallback para Grok
    if (this.models.grok) return this.models.grok;

    // Último recurso: Claude (mais caro para tarefas simples)
    if (this.models.claude) return this.models.claude;

    throw new Error("Nenhum modelo disponível");
  }

  /**
   * Retorna modelo específico por nome
   * @param {string} modelName - 'claude' | 'gpt4' | 'gemini' | 'grok'
   */
  getSpecificModel(modelName) {
    if (!this.models[modelName]) {
      console.warn(`⚠️ Modelo ${modelName} não disponível. Usando fallback.`);
      return this.getBestModel();
    }
    return this.models[modelName];
  }

  /**
   * Tenta invocar o modelo com fallback automático em caso de erro
   * @param {Array} messages - Array de mensagens no formato LangChain
   * @param {Object} options - Opções adicionais
   */
  async invokeWithFallback(messages, options = {}) {
    const {
      preferredModel = null,
      maxRetries = 3,
      fastMode = false
    } = options;

    // Determina ordem de tentativa
    let modelsToTry;
    if (preferredModel && this.models[preferredModel]) {
      modelsToTry = [preferredModel, ...this.modelPriority.filter(m => m !== preferredModel)];
    } else if (fastMode) {
      modelsToTry = ['gemini', 'gpt4', 'grok', 'claude'].filter(m => this.models[m]);
    } else {
      modelsToTry = [...this.modelPriority];
    }

    let lastError = null;

    for (const modelKey of modelsToTry) {
      try {
        console.log(`🔄 Tentando com ${modelKey}...`);
        const model = this.models[modelKey];
        const response = await model.invoke(messages);
        console.log(`✅ Resposta obtida com ${modelKey}`);

        return {
          success: true,
          content: response.content,
          modelUsed: modelKey,
          cost: this.estimateCost(modelKey, response.content)
        };
      } catch (error) {
        lastError = error;
        console.warn(`⚠️ Falha com ${modelKey}: ${error.message}`);

        // Se é erro de rate limit, aguarda antes de tentar próximo
        if (error.message.includes('rate') || error.message.includes('429')) {
          await this.sleep(2000);
        }
      }
    }

    // Se chegou aqui, todos os modelos falharam
    throw new Error(`Todos os modelos falharam. Último erro: ${lastError?.message}`);
  }

  /**
   * Estima custo aproximado da chamada
   * @param {string} modelKey - Chave do modelo
   * @param {string} content - Conteúdo da resposta
   */
  estimateCost(modelKey, content) {
    const outputTokens = Math.ceil(content.length / 4); // Estimativa aproximada

    const costs = {
      claude: outputTokens * 0.00000125, // $1.25 / 1M tokens (Haiku)
      gpt4: outputTokens * 0.00001,     // $10 / 1M tokens
      gemini: outputTokens * 0.0000002, // $0.20 / 1M tokens
      grok: outputTokens * 0.000001     // $1 / 1M tokens (estimado)
    };

    return costs[modelKey] || 0;
  }

  /**
   * Utilitário para aguardar (rate limiting)
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Retorna estatísticas dos modelos disponíveis
   */
  getStats() {
    return {
      totalModels: Object.keys(this.models).length,
      availableModels: this.modelPriority,
      primaryModel: this.modelPriority[0] || 'none',
      hasModernModel: !!(this.models.claude || this.models.gpt4 || this.models.gemini)
    };
  }

  /**
   * Valida se pelo menos um modelo moderno está configurado
   */
  hasModernModels() {
    return !!(this.models.claude || this.models.gpt4 || this.models.gemini);
  }
}

// Mock para testes sem API keys
export class MockAPIManager {
  getBestModel() {
    return {
      invoke: async () => ({
        content: JSON.stringify({
          resposta: "Sistema em modo de teste. Configure as APIs para funcionamento completo.",
          dados_extraidos: {},
          lead_score: 0,
          proxima_acao: "configurar_apis",
          metodologia_aplicada: "mock"
        })
      })
    };
  }

  getFastModel() {
    return this.getBestModel();
  }

  async invokeWithFallback() {
    return {
      success: true,
      content: "Modo mock ativo",
      modelUsed: "mock",
      cost: 0
    };
  }

  hasModernModels() {
    return false;
  }
}
