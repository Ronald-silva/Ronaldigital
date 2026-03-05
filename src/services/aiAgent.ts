// Serviço do Agente de IA - Implementação SEGURA
// ⚠️ CRÍTICO: API keys NUNCA devem estar no frontend!
// Todas as chamadas DEVEM passar pelo backend (/api/agente)

// URL do backend — Railway em produção, relativo em dev/fallback
const API_BASE = import.meta.env.VITE_API_URL || '';

export interface AgentRequest {
  nome: string;
  email: string;
  mensagem: string;
  tipoServico?: string;
  telefone?: string;
  orcamento?: string;
  prazo?: string;
  chatHistory?: { role: string; content: string }[];
}

export interface AgentResponse {
  success: boolean;
  resposta: string;
  leadScore: number;
  classificacao: 'QUENTE' | 'MORNO' | 'FRIO';
  proximaAcao: string;
  error?: string;
}

/**
 * Processa mensagem com o agente de IA
 *
 * 🔒 SEGURANÇA:
 * - Todas as chamadas passam pelo backend
 * - API keys ficam APENAS no servidor (Vercel)
 * - Nenhuma chave exposta no código do navegador
 *
 * @param data - Dados da requisição
 * @returns Resposta do agente
 */
export const processarComAgente = async (data: AgentRequest): Promise<AgentResponse> => {
  console.log('🚀 Processando mensagem via backend seguro');
  console.log('📝 Mensagem:', data.mensagem);

  try {
    // SEMPRE chama o backend - onde as API keys estão protegidas
    const response = await fetch(`${API_BASE}/api/agente`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nome: data.nome,
        email: data.email,
        mensagem: data.mensagem,
        tipoServico: data.tipoServico,
        telefone: data.telefone,
        orcamento: data.orcamento,
        prazo: data.prazo,
        chatHistory: data.chatHistory || []
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Backend respondeu com sucesso!');

      if (result.success) {
        return {
          success: true,
          resposta: result.response || result.resposta,
          leadScore: result.leadScore || 0,
          classificacao: getClassificacao(result.leadScore || 0),
          proximaAcao: result.nextAction || result.proximaAcao || 'continuar'
        };
      }
    }

    // Se backend retornou erro, loga mas não expõe detalhes
    console.warn('⚠️ Backend retornou erro:', response.status);

    // Retorna fallback
    return {
      success: false,
      resposta: "",
      leadScore: 0,
      classificacao: 'FRIO',
      proximaAcao: 'fallback_necessario',
      error: 'backend_error'
    };

  } catch (error) {
    console.error('❌ Erro ao conectar com backend:', error);

    // Retorna fallback (ChatWidget tem fallback inteligente)
    return {
      success: false,
      resposta: "",
      leadScore: 0,
      classificacao: 'FRIO',
      proximaAcao: 'fallback_necessario',
      error: 'connection_error'
    };
  }
};

/**
 * Classifica o lead baseado no score BANT
 * @param score - Score de 0 a 4
 */
const getClassificacao = (score: number): 'QUENTE' | 'MORNO' | 'FRIO' => {
  if (score >= 3) return 'QUENTE';
  if (score >= 2) return 'MORNO';
  return 'FRIO';
};

/**
 * Verifica se o backend está configurado
 * (Verifica se a rota /api/agente existe)
 */
export const isAgentConfigured = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/api/agente`, {
      method: 'HEAD'
    });
    return response.ok || response.status === 405; // 405 = método não permitido, mas rota existe
  } catch {
    return false;
  }
};

/**
 * Retorna status do backend
 */
export const getAgentConfig = async () => {
  const isConfigured = await isAgentConfigured();
  return {
    isConfigured,
    backendAvailable: isConfigured,
    secureMode: true // Sempre true - não expomos API keys
  };
};
