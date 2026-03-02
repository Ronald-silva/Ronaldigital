import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, X, User } from "lucide-react";
import saraAvatar from "@/assets/sara-avatar.png";
import { processarComAgente } from "@/services/aiAgent";

// Estilos CSS para animações neurociência-baseadas
const chatButtonStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
  
  @keyframes magneticPull {
    0%, 100% { transform: scale(1) rotate(0deg); }
    25% { transform: scale(1.05) rotate(1deg); }
    50% { transform: scale(1.1) rotate(0deg); }
    75% { transform: scale(1.05) rotate(-1deg); }
  }
  
  @keyframes breathe {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.02); }
  }
  
  .chat-button-magnetic:hover {
    animation: magneticPull 0.6s ease-in-out infinite;
  }
  
  .chat-button-breathe {
    animation: breathe 4s ease-in-out infinite;
  }
`;

interface Message {
  id: number;
  type: 'user' | 'bot';
  text: string;
  time: string;
}

interface ConversationContext {
  clientName?: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  businessType?: string;
  currentStep: number;
  topics: string[];
  lastIntent?: string;
  leadScore?: number;
  usingFallback?: boolean;
}

export function ChatWidget({ embedded = false }: { embedded?: boolean }) {
  const [isOpen, setIsOpen] = useState(embedded);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [context, setContext] = useState<ConversationContext>({
    currentStep: 0,
    topics: []
  });

  // Estados para efeitos psicológicos
  const [showUrgency, setShowUrgency] = useState(false);
  const [attentionPulse, setAttentionPulse] = useState(false);
  const [visitTime, setVisitTime] = useState(0);

  // Ref para auto-scroll
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Efeito de atenção baseado em tempo (Neurociência: Janela de atenção)
  useEffect(() => {
    const timer = setInterval(() => {
      setVisitTime(prev => prev + 1);
    }, 1000);

    // Após 10 segundos, ativa urgência sutil
    const urgencyTimer = setTimeout(() => {
      setShowUrgency(true);
    }, 10000);

    // Após 30 segundos, pulso de atenção (momento de decisão)
    const attentionTimer = setTimeout(() => {
      setAttentionPulse(true);
      // Remove após 5 segundos para não ser irritante
      setTimeout(() => setAttentionPulse(false), 5000);
    }, 30000);

    return () => {
      clearInterval(timer);
      clearTimeout(urgencyTimer);
      clearTimeout(attentionTimer);
    };
  }, []);

  // Auto-scroll quando novas mensagens chegam
  const scrollToBottom = () => {
    // Usa setTimeout para garantir que o scroll aconteça DEPOIS da renderização
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest"
      });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (embedded) {
      setIsOpen(true);
      if (messages.length === 0) {
        // Mostra "Sara está digitando..." e depois a mensagem
        const initChat = async () => {
          setIsTyping(true);
          await new Promise(resolve => setTimeout(resolve, 1500));
          setIsTyping(false);
          await addMultipleMessages('bot', "👋 Oi! Sou a Sara da RonalDigital! ✨\n\nComo posso te ajudar hoje?");
        };
        initChat();
      }
    }
  }, [embedded]);

  const addMessage = (type: 'user' | 'bot', text: string) => {
    const newMessage: Message = {
      id: Date.now(),
      type,
      text,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMessage]);
  };

  // Função para dividir mensagens longas em chunks naturais (CONSERVADORA)
  const splitMessageIntoChunks = (text: string): string[] => {
    // Regra: SÓ divide se for MUITO longo (>400 caracteres)
    // E no máximo em 2 mensagens
    if (text.length < 400) {
      return [text];
    }

    // Tenta encontrar um ponto de divisão natural no meio da mensagem
    const midpoint = Math.floor(text.length / 2);

    // Procura por quebra de linha dupla próxima ao meio
    const breakPoint = text.indexOf('\n\n', midpoint - 100);

    if (breakPoint !== -1 && breakPoint < midpoint + 100) {
      return [
        text.substring(0, breakPoint).trim(),
        text.substring(breakPoint).trim()
      ];
    }

    // Se não encontrou quebra natural, retorna mensagem inteira
    // (melhor uma mensagem longa que múltiplas mensagens spam)
    return [text];
  };

  // Envia múltiplas mensagens com delay (estilo WhatsApp)
  const addMultipleMessages = async (type: 'user' | 'bot', text: string) => {
    if (type === 'user') {
      // Mensagens do usuário sempre são únicas
      addMessage(type, text);
      return;
    }

    // Divide a resposta da Sara em chunks naturais
    const chunks = splitMessageIntoChunks(text);

    // Se for apenas 1 chunk, envia direto
    if (chunks.length === 1) {
      addMessage(type, text);
      return;
    }

    // Envia múltiplas mensagens com delay REALISTA (não spam!)
    for (let i = 0; i < chunks.length; i++) {
      // Mostra typing indicator antes da segunda mensagem (pausa natural)
      if (i > 0) {
        setIsTyping(true);
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2 segundos de "digitação"
        setIsTyping(false);
      }

      // Envia a mensagem
      addMessage(type, chunks[i]);

      // Pequeno delay após enviar
      if (i < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
  };

  // Extrai informações da mensagem do usuário
  const extractInfo = (message: string): Partial<ConversationContext> => {
    const lowerMsg = message.toLowerCase();
    const info: Partial<ConversationContext> = {};
    
    // Detecta nome
    const namePatterns = [
      /(?:sou|me chamo|meu nome é|eu sou)\s+([a-záàâãéèêíïóôõöúçñ]+)/i,
      /(?:^|\s)([A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ][a-záàâãéèêíïóôõöúçñ]+)(?:\s|$)/
    ];
    for (const pattern of namePatterns) {
      const match = message.match(pattern);
      if (match && match[1] && match[1].length > 2) {
        info.clientName = match[1];
        break;
      }
    }
    
    // Detecta tipo de projeto
    if (lowerMsg.includes('landing') || lowerMsg.includes('página de vendas')) {
      info.projectType = 'landing-page';
    } else if (lowerMsg.includes('portfólio') || lowerMsg.includes('portfolio')) {
      info.projectType = 'portfolio';
    } else if (lowerMsg.includes('loja') || lowerMsg.includes('e-commerce') || lowerMsg.includes('vender')) {
      info.projectType = 'e-commerce';
    } else if (lowerMsg.includes('blog')) {
      info.projectType = 'blog';
    } else if (lowerMsg.includes('site')) {
      info.projectType = 'website';
    }
    
    // Detecta tipo de negócio com mais variações
    const businessTypes = [
      { keywords: ['restaurante', 'bar', 'lanchonete', 'pizzaria', 'hamburgueria'], type: 'restaurante' },
      { keywords: ['loja', 'comércio', 'varejo', 'boutique', 'magazine'], type: 'loja' },
      { keywords: ['consultoria', 'consultor', 'advogado', 'contador'], type: 'consultoria' },
      { keywords: ['clínica', 'médico', 'dentista', 'fisioterapeuta'], type: 'clínica' },
      { keywords: ['academia', 'personal', 'fitness', 'ginástica'], type: 'academia' },
      { keywords: ['salão', 'barbearia', 'estética', 'beleza'], type: 'salão de beleza' },
      { keywords: ['oficina', 'mecânica', 'auto', 'carro'], type: 'oficina' },
      { keywords: ['escola', 'curso', 'educação', 'ensino'], type: 'educação' },
      { keywords: ['imobiliária', 'corretor', 'imóvel'], type: 'imobiliária' }
    ];
    
    for (const business of businessTypes) {
      for (const keyword of business.keywords) {
        if (lowerMsg.includes(keyword)) {
          info.businessType = business.type;
          break;
        }
      }
      if (info.businessType) break;
    }
    
    // Detecta orçamento
    if (lowerMsg.includes('500') || lowerMsg.includes('quinhentos')) {
      info.budget = 'até-500';
    } else if (lowerMsg.includes('1000') || lowerMsg.includes('mil')) {
      info.budget = '500-1000';
    } else if (lowerMsg.includes('2000') || lowerMsg.includes('dois mil')) {
      info.budget = '1000-2000';
    } else if (lowerMsg.includes('barato') || lowerMsg.includes('econômico')) {
      info.budget = 'baixo';
    }
    
    // Detecta prazo
    if (lowerMsg.includes('urgente') || lowerMsg.includes('rápido')) {
      info.timeline = 'urgente';
    } else if (lowerMsg.includes('semana')) {
      info.timeline = '1-semana';
    } else if (lowerMsg.includes('mês')) {
      info.timeline = '1-mes';
    }
    
    return info;
  };

  // Determina a intenção da mensagem
  const getIntent = (message: string): string => {
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('oi') || lowerMsg.includes('olá') || lowerMsg.includes('bom dia')) {
      return 'greeting';
    } else if (lowerMsg.includes('preço') || lowerMsg.includes('valor') || lowerMsg.includes('custa')) {
      return 'pricing';
    } else if (lowerMsg.includes('prazo') || lowerMsg.includes('tempo') || lowerMsg.includes('demora')) {
      return 'timeline';
    } else if (lowerMsg.includes('exemplo') || lowerMsg.includes('portfólio') || lowerMsg.includes('trabalho')) {
      return 'examples';
    } else if (lowerMsg.includes('contato') || lowerMsg.includes('telefone') || lowerMsg.includes('whatsapp')) {
      return 'contact';
    } else if (lowerMsg.includes('sim') || lowerMsg.includes('quero') || lowerMsg.includes('aceito')) {
      return 'positive';
    } else if (lowerMsg.includes('não') || lowerMsg.includes('nao')) {
      return 'negative';
    }
    return 'information';
  };

  // Sistema Multi-Especialista: Neil Patel + Jill Konrath + Gary Vaynerchuk
  const getActiveExpert = (step: number, context: ConversationContext): 'neil' | 'jill' | 'gary' => {
    if (step <= 2) return 'neil';  // Neil Patel - Captação e descoberta
    if (step <= 4) return 'jill';  // Jill Konrath - Qualificação BANT
    return 'gary';                 // Gary Vaynerchuk - Vendas e fechamento
  };

  // Sara com expertise de Neil Patel - Captação e Marketing
  const getSaraMarketingResponse = (message: string, context: ConversationContext): string => {
    const intent = getIntent(message);
    const step = context.currentStep;
    
    // Sara usa conhecimento de Neil para descobrir necessidades e educar sobre valor
    if (step === 0) {
      if (intent === 'greeting') {
        return "👋 Oi! Sou a Sara da RonalDigital! ✨\n\nComo especialista em marketing digital, sei que um site bem feito pode aumentar suas vendas em até 300%. Que tipo de projeto você tem em mente?";
      }
      return "Oi! 🚀 Vou te ajudar a criar algo que realmente converte visitantes em clientes.\n\nMe conta: qual seu objetivo principal? Vender mais, gerar leads, mostrar portfólio...?";
    }
    
    if (step === 1) {
      if (context.projectType) {
        const insights = getNeilInsights(context.projectType);
        return `${getProjectName(context.projectType)} ${insights}\n\n${context.clientName ? `${context.clientName}, ` : ''}Para maximizar os resultados, preciso entender seu negócio. Que tipo de empresa/atividade você tem?`;
      }
      return "Perfeito! Para criar uma estratégia que realmente funciona, me conta: é para que tipo de negócio?";
    }
    
    if (step === 2) {
      if (context.businessType) {
        const marketingAdvice = getNeilMarketingAdvice(context.businessType, context.projectType);
        return `Excelente! ${context.businessType} tem um potencial incrível online! 📈\n\n${marketingAdvice}\n\nAgora preciso entender seu investimento para criar a proposta perfeita. Qual faixa de orçamento você tem disponível?`;
      } else {
        // Se não detectou o tipo de negócio, pergunta diretamente
        return `Perfeito! Para criar a estratégia ideal, me conta: que tipo de negócio você tem? Restaurante, loja, consultoria, serviços...?\n\nIsso me ajuda a personalizar tudo para seu segmento! 🎯`;
      }
    }
    
    return "Vou te ajudar a encontrar a melhor solução para seu negócio!";
  };

  // Sara com expertise de Jill Konrath - Qualificação BANT
  const getSaraQualificationResponse = (message: string, context: ConversationContext): string => {
    const intent = getIntent(message);
    const step = context.currentStep;
    
    // Sara usa metodologia BANT para qualificar leads
    if (step === 3) {
      if (!context.budget) {
        return `Para criar a proposta perfeita para você, preciso entender seu investimento disponível. 💰\n\nQual faixa de orçamento você tem em mente?\n\n• Até R$ 1.000 (projetos essenciais)\n• R$ 1.000-2.500 (projetos completos)\n• Acima de R$ 2.500 (projetos premium)`;
      }
      
      const budgetAnalysis = getJillBudgetAnalysis(context.budget, context.projectType);
      return `${budgetAnalysis}\n\nAgora sobre o prazo: quando você precisa que o projeto esteja funcionando? Isso me ajuda a planejar a melhor estratégia de entrega. ⏰`;
    }
    
    if (step === 4) {
      const bantScore = calculateBANTScore(context);
      const qualification = getJillQualification(bantScore, context);
      
      return `${getTimelineResponse(context.timeline)}\n\n📊 **Análise completa do seu projeto:**\n${getSummary(context)}\n\n${qualification}\n\nAgora vou preparar uma proposta personalizada para você! 🚀`;
    }
    
    return "Deixe-me entender melhor suas necessidades para criar a proposta ideal!";
  };

  // Sara com expertise de Gary Vaynerchuk - Vendas e Fechamento
  const getSaraSalesResponse = (message: string, context: ConversationContext): string => {
    const intent = getIntent(message);
    const bantScore = calculateBANTScore(context);
    
    // Sara usa energia e técnicas de Gary para fechar vendas
    if (context.currentStep >= 5) {
      if (intent === 'positive') {
        return `ISSO AÍ! 🔥 Adoro essa energia!\n\nVou criar uma proposta que vai fazer seu negócio DECOLAR! Aqui está o que você vai receber:\n\n${getGaryProposal(context)}\n\n💰 **Investimento:** ${getGaryPricing(context)}\n\n🎁 **BÔNUS EXCLUSIVO:** Consultoria de marketing digital gratuita!\n\nMe passa seu WhatsApp que fechamos isso AGORA!`;
      }
      
      if (intent === 'negative' || message.toLowerCase().includes('caro')) {
        return getGaryObjectionHandling(message, context);
      }
      
      if (intent === 'contact') {
        return `PERFEITO! 🚀 Vamos fazer negócio!\n\nMe chama no WhatsApp: (85) 99157-5525\n\nOu me passa seu número que eu te chamo AGORA! Vou mandar a proposta completa e podemos começar hoje mesmo!`;
      }
    }
    
    // Primeira abordagem de vendas da Sara
    const energy = bantScore >= 3 ? "🔥 VOCÊ ESTÁ PRONTO PARA DECOLAR!" : "🚀 VAMOS FAZER SEU NEGÓCIO CRESCER!";
    
    return `${energy}\n\nVou ser DIRETA com você:\n\n${getGaryValueProp(context)}\n\n💰 **Investimento:** ${getGaryPricing(context)}\n\n🎁 **BÔNUS:** Se fechar hoje, incluo consultoria de marketing GRATUITA!\n\nTOPA FAZER NEGÓCIO?`;
  };

  // Gera resposta usando o especialista apropriado
  const generateIntelligentResponse = (message: string, currentContext: ConversationContext): string => {
    const activeExpert = getActiveExpert(currentContext.currentStep, currentContext);
    
    // Evita repetir tópicos já abordados
    const intent = getIntent(message);
    if (currentContext.topics.includes(intent) && intent !== 'information') {
      if (intent === 'pricing' && currentContext.projectType) {
        return `Como ${activeExpert === 'neil' ? 'mencionei' : activeExpert === 'jill' ? 'a Jill analisou' : 'calculamos'}, para ${getProjectName(currentContext.projectType)} fica entre R$ ${getPriceRange(currentContext.projectType)}.\n\n${getNextQuestion(currentContext)}`;
      }
    }
    
    // Sara usa a expertise apropriada para cada etapa
    switch (activeExpert) {
      case 'neil':
        return getSaraMarketingResponse(message, currentContext);
      case 'jill':
        return getSaraQualificationResponse(message, currentContext);
      case 'gary':
        return getSaraSalesResponse(message, currentContext);
      default:
        return "Vou te ajudar a encontrar a melhor solução!";
    }
  };

  // Funções auxiliares
  const getProjectName = (type: string): string => {
    const names: { [key: string]: string } = {
      'landing-page': 'Landing Page',
      'portfolio': 'Portfólio',
      'e-commerce': 'E-commerce',
      'blog': 'Blog',
      'website': 'Site institucional'
    };
    return names[type] || 'Site';
  };

  const getProjectBenefits = (type: string): string => {
    const benefits: { [key: string]: string } = {
      'landing-page': 'Ideal para converter visitantes em clientes! 🎯',
      'portfolio': 'Perfeito para mostrar seu trabalho e conquistar credibilidade! 🎨',
      'e-commerce': 'O futuro das vendas! Vender online 24/7! 🛒',
      'blog': 'Ótimo para compartilhar conhecimento e atrair clientes! ✍️',
      'website': 'Essencial para presença digital profissional! 🌐'
    };
    return benefits[type] || 'Excelente escolha!';
  };

  const getPriceRange = (type: string): string => {
    const prices: { [key: string]: string } = {
      'landing-page': '500-1.000',
      'portfolio': '400-800',
      'e-commerce': '1.200-3.000',
      'blog': '600-1.200',
      'website': '800-2.000'
    };
    return prices[type] || '500-2.000';
  };

  const getBusinessSpecificAdvice = (business: string, project?: string): string => {
    if (business === 'restaurante' && project === 'website') {
      return "Para restaurantes, recomendo incluir cardápio online e sistema de reservas!";
    } else if (business === 'loja' && project !== 'e-commerce') {
      return "Que tal considerar um e-commerce? Suas vendas podem aumentar muito online!";
    }
    return "Vou criar algo perfeito para seu segmento!";
  };

  const getBudgetResponse = (budget: string, project?: string): string => {
    if (budget === 'baixo') {
      return "Sem problemas! Posso criar algo incrível dentro do seu orçamento. Vamos encontrar a melhor solução!";
    } else if (budget === 'até-500') {
      return "Com esse orçamento, posso fazer uma landing page bem otimizada ou um portfólio profissional!";
    }
    return "Perfeito! Com esse orçamento posso criar algo realmente completo e profissional!";
  };

  const getTimelineResponse = (timeline?: string): string => {
    if (timeline === 'urgente') {
      return "Urgente? Sem problemas! Posso priorizar seu projeto e entregar em 3-5 dias!";
    } else if (timeline === '1-semana') {
      return "Uma semana é um prazo ótimo! Dá para fazer algo bem caprichado!";
    }
    return "Ótimo prazo! Vou poder caprichar em todos os detalhes!";
  };

  const getSummary = (ctx: ConversationContext): string => {
    return `• Cliente: ${ctx.clientName || 'Não informado'}\n• Projeto: ${getProjectName(ctx.projectType || 'website')}\n• Negócio: ${ctx.businessType || 'Não especificado'}\n• Orçamento: ${ctx.budget || 'A definir'}\n• Prazo: ${ctx.timeline || 'Flexível'}`;
  };

  const getContextualResponse = (message: string, ctx: ConversationContext): string => {
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('exemplo') || lowerMsg.includes('portfólio')) {
      return "Claro! Posso te mostrar alguns trabalhos. Acesse meu portfólio em ronalddigital.com/portfolio ou me chama no WhatsApp que envio exemplos específicos para seu segmento!";
    } else if (lowerMsg.includes('prazo')) {
      return `Normalmente entrego em 5-10 dias úteis. ${ctx.timeline === 'urgente' ? 'Mas como é urgente, posso priorizar!' : 'Se precisar mais rápido, posso acelerar!'}`;
    }
    
    return "Entendi! Tem mais alguma dúvida sobre o projeto? Estou aqui para te ajudar! 😊";
  };

  // Funções específicas do Neil Patel
  const getNeilInsights = (projectType: string): string => {
    const insights: { [key: string]: string } = {
      'landing-page': 'é PERFEITA para conversão! Pode aumentar suas vendas em até 400% com as estratégias certas! 🎯',
      'portfolio': 'é essencial para credibilidade! 94% dos clientes pesquisam online antes de contratar! 🎨',
      'e-commerce': 'é o FUTURO! E-commerce cresceu 300% nos últimos anos! 🛒',
      'blog': 'é uma máquina de leads! Empresas que blogam geram 67% mais leads! ✍️',
      'website': 'é fundamental! 75% dos consumidores julgam credibilidade pelo site! 🌐'
    };
    return insights[projectType] || 'tem potencial incrível para seu negócio!';
  };

  const getNeilMarketingAdvice = (business?: string, project?: string): string => {
    if (!business) return "Vou aplicar as melhores estratégias de marketing digital para seu segmento!";
    
    switch (business) {
      case 'restaurante':
        return "Restaurantes com presença digital forte vendem 23% mais! Vou incluir cardápio online, sistema de reservas e integração com delivery!";
      case 'loja':
        return project !== 'e-commerce' 
          ? "Lojas físicas que vendem online faturam 40% mais! Que tal considerarmos um e-commerce também?"
          : "Perfeito! E-commerce é essencial para lojas modernas! Vou criar algo que vende 24/7!";
      case 'consultoria':
        return "Consultores com sites profissionais cobram até 60% mais! Vou focar em autoridade e captação de leads!";
      case 'clínica':
        return "Clínicas com agendamento online têm 35% mais consultas! Vou incluir sistema de marcação e área do paciente!";
      case 'academia':
        return "Academias digitais retêm 50% mais alunos! Vou criar área de treinos e acompanhamento online!";
      case 'salão de beleza':
        return "Salões com agendamento online têm 40% menos cancelamentos! Vou incluir sistema de horários e galeria!";
      case 'educação':
        return "Escolas online crescem 200% mais rápido! Vou criar plataforma de cursos e área do aluno!";
      case 'imobiliária':
        return "Imobiliárias digitais vendem 60% mais rápido! Vou incluir busca avançada e tour virtual!";
      default:
        return `${business.charAt(0).toUpperCase() + business.slice(1)} tem grande potencial online! Vou criar estratégias específicas para seu segmento!`;
    }
  };

  // Funções específicas da Jill Konrath
  const getJillBudgetAnalysis = (budget?: string, project?: string): string => {
    if (budget === 'baixo' || budget === 'até-500') {
      return "Entendo! Vamos trabalhar com inteligência dentro do seu orçamento. Posso criar algo eficiente e que gere resultados!";
    } else if (budget === '500-1000') {
      return "Excelente! Com esse investimento posso incluir funcionalidades avançadas e um design realmente impactante!";
    } else if (budget === '1000-2000') {
      return "Perfeito! Esse orçamento permite criar algo premium com todas as funcionalidades que seu negócio precisa!";
    }
    return "Ótimo! Vamos criar algo que traga retorno muito superior ao investimento!";
  };

  const calculateBANTScore = (context: ConversationContext): number => {
    let score = 0;
    if (context.budget) score += 1;                    // Budget
    if (context.clientName) score += 1;               // Authority (assume que quem fala decide)
    if (context.projectType && context.businessType) score += 1; // Need
    if (context.timeline) score += 1;                 // Timeline
    return score;
  };

  const getJillQualification = (score: number, context: ConversationContext): string => {
    if (score >= 3) {
      return "🔥 **LEAD QUENTE!** Você tem tudo definido: projeto, orçamento e prazo. Vamos fazer acontecer!";
    } else if (score >= 2) {
      return "⭐ **LEAD QUALIFICADO!** Temos boas informações. Vou preparar uma proposta sob medida!";
    }
    return "💡 **LEAD PROMISSOR!** Vamos alinhar alguns detalhes para criar a proposta perfeita!";
  };

  // Funções específicas do Gary Vaynerchuk
  const getGaryInitialPitch = (context: ConversationContext, bantScore: number): string => {
    const energy = bantScore >= 3 ? "🔥 CARA, VOCÊ ESTÁ PRONTO PARA DECOLAR!" : "🚀 VAMOS FAZER SEU NEGÓCIO CRESCER!";
    
    return `**Sara:** Agora você está com o Gary Vaynerchuk! 🔥\n\n**Gary:** ${energy}\n\nSou o Gary, especialista em vendas, e vou ser DIRETO com você:\n\n${getGaryValueProp(context)}\n\n💰 **Investimento:** ${getGaryPricing(context)}\n\n🎁 **BÔNUS:** Se fechar hoje, incluo consultoria de marketing GRATUITA!\n\nTOPA FAZER NEGÓCIO?`;
  };

  const getGaryValueProp = (context: ConversationContext): string => {
    const project = getProjectName(context.projectType || '');
    const business = context.businessType || 'seu negócio';
    
    return `Seu ${project.toLowerCase()} vai ser uma MÁQUINA DE VENDAS para ${business}!\n\n✅ Design que CONVERTE\n✅ Otimizado para Google\n✅ Responsivo (funciona em qualquer dispositivo)\n✅ Entrega RÁPIDA\n✅ Suporte total`;
  };

  const getGaryPricing = (context: ConversationContext): string => {
    const basePrice = getPriceRange(context.projectType || '');
    const [min, max] = basePrice.split('-').map(p => parseInt(p.replace('.', '')));
    
    if (context.budget === 'baixo' || context.budget === 'até-500') {
      return `R$ ${min} (preço especial para você!)`;
    } else if (context.timeline === 'urgente') {
      return `R$ ${max} (entrega expressa incluída!)`;
    }
    
    return `R$ ${min}-${max} (parcelamos em até 3x!)`;
  };

  const getGaryProposal = (context: ConversationContext): string => {
    const project = getProjectName(context.projectType || '');
    return `🎯 ${project} COMPLETO\n🎨 Design profissional exclusivo\n📱 100% responsivo\n🚀 Otimizado para conversão\n📈 Integração com Google Analytics\n🔧 3 meses de suporte GRATUITO`;
  };

  const getGaryObjectionHandling = (message: string, context: ConversationContext): string => {
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('caro') || lowerMsg.includes('preço')) {
      return `Olha, eu ENTENDO sua preocupação com preço! 💰\n\nMas pensa comigo: se esse site trouxer apenas 2 clientes novos por mês, já PAGOU o investimento!\n\nE olha só: posso parcelar em 3x SEM JUROS! Fica só R$ ${Math.round(parseInt(getPriceRange(context.projectType || '').split('-')[0].replace('.', '')) / 3)} por mês!\n\nVale mais a pena investir em seu futuro ou continuar perdendo clientes? 🤔`;
    }
    
    if (lowerMsg.includes('pensar') || lowerMsg.includes('decidir')) {
      return `Claro, PENSAR é importante! 🤔\n\nMas olha: enquanto você pensa, seus concorrentes estão VENDENDO online!\n\nTenho apenas 2 vagas este mês. Se não for agora, só em março!\n\nQue tal garantir sua vaga com apenas R$ 200 de entrada? O resto você paga só quando aprovar o design! TOPA?`;
    }
    
    return `Entendo sua hesitação! Mas OPORTUNIDADES não esperam! 🚀\n\nVamos fazer assim: te dou 7 dias de GARANTIA TOTAL. Se não gostar, devolvemos 100% do dinheiro!\n\nRisco ZERO para você! BORA FAZER ACONTECER?`;
  };

  const getNextQuestion = (ctx: ConversationContext): string => {
    const expert = getActiveExpert(ctx.currentStep, ctx);
    
    if (expert === 'neil') {
      if (!ctx.projectType) return "Que tipo de projeto você precisa para alavancar seu negócio?";
      if (!ctx.businessType) return "Para que tipo de negócio vamos criar essa máquina de vendas?";
    } else if (expert === 'jill') {
      if (!ctx.budget) return "Qual investimento você tem disponível para esse projeto?";
      if (!ctx.timeline) return "Quando você precisa que esteja funcionando?";
    } else {
      return "BORA FECHAR ESSE NEGÓCIO?";
    }
    
    return "Como posso te ajudar mais?";
  };

  // 🧠 FALLBACK SARA 3.0 - CURTO E CONTEXTUAL
  const getIntelligentFallback = (message: string, ctx: ConversationContext): string => {
    const lowerMsg = message.toLowerCase().trim();

    console.log(`🔄 FALLBACK 3.0 para: "${message}"`);

    // 🔥 BARBEARIA + IA (COMBINAÇÃO ESPECÍFICA - ALTA PRIORIDADE)
    if ((lowerMsg.includes('barbearia') || lowerMsg.includes('barbeiro') || lowerMsg.includes('salão') || lowerMsg.includes('salao')) &&
        (lowerMsg.includes('ia') || lowerMsg.includes('inteligencia artificial') || lowerMsg.includes('agente') || lowerMsg.includes('chatbot'))) {
      return "Barbearia com IA é minha especialidade! 💈 Site + agendamento + IA que atende 24h. Fica entre R$ 1.800-2.500. Você já tem logo?";
    }

    // 💈 BARBEARIA (sem IA)
    if (lowerMsg.includes('barbearia') || lowerMsg.includes('barbeiro')) {
      return "Show! Faço site pra barbearia com agendamento online. Cliente marca sozinho 24h! Fica R$ 800-1.500. Quer com IA também?";
    }

    // 🤖 IA/AGENTE
    if (lowerMsg.includes('ia') || lowerMsg.includes('inteligencia artificial') || lowerMsg.includes('agente') || lowerMsg.includes('chatbot')) {
      return "IA é poderosa! 🤖 Atende 24h, qualifica leads e agenda. Setup: R$ 1.000-2.500 + R$ 150-300/mês. Pra qual negócio você precisa?";
    }

    // 👗 LOJA DE ROUPAS / E-COMMERCE
    if (lowerMsg.includes('loja') || lowerMsg.includes('roupas') || lowerMsg.includes('vender online') || lowerMsg.includes('e-commerce')) {
      return "E-commerce é minha praia! 👗 Catálogo, carrinho, pagamentos integrados. R$ 1.200-2.500. Qual seu orçamento?";
    }

    // 🍕 RESTAURANTE
    if (lowerMsg.includes('restaurante') || lowerMsg.includes('delivery') || lowerMsg.includes('cardápio')) {
      return "Restaurante vende muito online! 🍕 Cardápio digital + pedidos + WhatsApp. R$ 800-1.800. Qual seu orçamento?";
    }

    // 💰 PREÇO/VALOR
    if (lowerMsg.includes('preço') || lowerMsg.includes('valor') || lowerMsg.includes('custa') || lowerMsg.includes('quanto')) {
      return "Depende do projeto! Landing page R$ 500-1.000, site completo R$ 800-2.000, e-commerce R$ 1.200-2.500. Parcelo em 3x. Qual você precisa?";
    }

    // ⏰ PRAZO
    if (lowerMsg.includes('prazo') || lowerMsg.includes('tempo') || lowerMsg.includes('demora') || lowerMsg.includes('quando fica')) {
      return "Sou rápida! Landing page 3-5 dias, site completo 7-15 dias. Se for urgente, priorizo. Que tipo de projeto é?";
    }

    // 🎯 SITE GENÉRICO
    if (lowerMsg.includes('site') || lowerMsg.includes('página') || lowerMsg.includes('landing')) {
      return "Show! Pra te passar um valor certinho: é pra qual tipo de negócio? E precisa de algo específico (agendamento, loja, formulário)?";
    }

    // 👋 SAUDAÇÕES
    if (lowerMsg.includes('oi') || lowerMsg.includes('olá') || lowerMsg.includes('ola') ||
        lowerMsg.includes('bom dia') || lowerMsg.includes('boa tarde') || lowerMsg.includes('boa noite')) {
      return "Oi! Sou a Sara da Ronald Digital 😊 Crio sites, landing pages e agentes de IA. Como posso te ajudar?";
    }

    // ❓ QUEM É VOCÊ
    if (lowerMsg.includes('quem é você') || lowerMsg.includes('seu nome') || lowerMsg.includes('como se chama')) {
      return "Sou a Sara! 😊 Especialista em marketing digital da Ronald Digital. Crio sites que vendem de verdade. E você, qual seu nome?";
    }

    // 🤖 É ROBÔ?
    if (lowerMsg.includes('robô') || lowerMsg.includes('é ia') || lowerMsg.includes('é bot')) {
      return "Sou IA sim, mas converso como gente! 😊 Entendo contexto e realmente quero te ajudar. Me conta o que você precisa?";
    }

    // 📞 CONTATO
    if (lowerMsg.includes('contato') || lowerMsg.includes('whatsapp') || lowerMsg.includes('telefone')) {
      return "WhatsApp: (85) 99157-5525. Mas pode falar comigo aqui também! Que tipo de projeto você precisa?";
    }

    // 🤔 DÚVIDA
    if (lowerMsg.includes('dúvida') || lowerMsg.includes('pergunta') || lowerMsg.includes('ajuda')) {
      return "Claro! Pode perguntar 😊 Qual sua dúvida?";
    }

    // 💭 PENSAR/DECIDIR
    if (lowerMsg.includes('pensar') || lowerMsg.includes('decidir') || lowerMsg.includes('vou ver')) {
      return "Tranquilo! Se quiser, manda no WhatsApp (85) 99157-5525 quando decidir. Fico aqui se surgir alguma dúvida!";
    }

    // 💸 CARO
    if (lowerMsg.includes('caro') || lowerMsg.includes('muito dinheiro')) {
      return "Entendo! Parcelo em 3x sem juros. E pensa: se o site trouxer 2 clientes, já se pagou. Quer que eu faça uma proposta?";
    }

    // 🔄 RESPOSTA PADRÃO - CURTA
    return "Me conta mais sobre o que você precisa - qual seu negócio e o que quer alcançar? 😊";
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    addMessage('user', inputText);
    const userMsg = inputText;
    setInputText("");

    // Ativa o indicador "Sara está digitando..."
    setIsTyping(true);

    // Chama o serviço do agente diretamente
    try {
      const result = await processarComAgente({
        nome: context.clientName || 'Cliente Chat',
        email: 'cliente@chat.com',
        mensagem: userMsg,
        tipoServico: context.projectType || '',
        telefone: '', // Opcional
        orcamento: context.budget || '',
        prazo: context.timeline || '',
        chatHistory: messages.map(m => ({
          role: m.type === 'user' ? 'user' : 'assistant',
          content: m.text
        }))
      });

      if (result.success) {
        // Atualiza contexto com informações da Sara AI
        setContext(prev => ({
          ...prev,
          currentStep: prev.currentStep + 1,
          lastIntent: getIntent(userMsg),
          leadScore: result.leadScore || prev.leadScore || 0
        }));

        // Desativa o typing e mostra a resposta (com múltiplas mensagens se necessário)
        setIsTyping(false);
        await addMultipleMessages('bot', result.resposta);

        // Log para debug
        console.log('✅ AI Service funcionou:', {
          leadScore: result.leadScore,
          classificacao: result.classificacao,
          acao: result.proximaAcao
        });
      } else {
        console.warn('⚠️ AI Service retornou erro:', result);
        // Fallback inteligente quando API falha
        const fallbackResponse = getIntelligentFallback(userMsg, context);
        setIsTyping(false);
        await addMultipleMessages('bot', fallbackResponse);
      }
    } catch (error) {
      console.error('❌ Erro ao chamar AI Service:', error);
      console.log('🔄 Ativando fallback inteligente para:', userMsg);

      // Fallback inteligente quando há erro de conexão
      const fallbackResponse = getIntelligentFallback(userMsg, context);
      setIsTyping(false);
      await addMultipleMessages('bot', fallbackResponse);

      // Atualiza contexto mesmo no fallback
      setContext(prev => ({
        ...prev,
        currentStep: prev.currentStep + 1,
        lastIntent: getIntent(userMsg),
        usingFallback: true
      }));
    }
  };

  const openChat = async () => {
    setIsOpen(true);
    // Sempre limpa mensagens antigas e reseta contexto
    setMessages([]);
    setContext({ currentStep: 0, topics: [] });

    // Mostra "Sara está digitando..." e depois a mensagem
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsTyping(false);
    await addMultipleMessages('bot', "👋 Oi! Sou a Sara da RonalDigital! ✨\n\nComo posso te ajudar hoje?");
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: chatButtonStyles }} />
      
      {/* Chat Button - Neurociência & Psicologia Comportamental */}
      {/* Chat Button - Neurociência & Psicologia Comportamental */}
      {!isOpen && !embedded && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="relative group">
            {/* Tooltip Animado com Urgência */}
            <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none transform translate-y-2 group-hover:translate-y-0">
              <div className="bg-slate-800 text-white px-4 py-3 rounded-xl text-sm whitespace-nowrap shadow-2xl border border-slate-700 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="font-medium">💬 Sara está online agora!</span>
                </div>
                <div className="text-xs text-slate-300 mt-1">
                  ✨ Resposta em menos de 30 segundos
                </div>
                {/* Arrow */}
                <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-800"></div>
              </div>
            </div>
            
            {/* Efeitos de Fundo - Dopamina Visual */}
            <div className="absolute inset-0 rounded-full">
              {/* Anel de energia rotativo */}
              <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-cyan-500 to-cyan-600 animate-spin opacity-50"
                   style={{ animationDuration: '3s' }}></div>

              {/* Pulsos concêntricos - Efeito hipnótico */}
              <div className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-20"></div>
              <div className="absolute inset-0 rounded-full bg-cyan-500 animate-ping opacity-15"
                   style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-10"
                   style={{ animationDelay: '1s' }}></div>
            </div>
            
            {/* Button Principal - Gatilho de Ação */}
            <Button
              onClick={openChat}
              className="chat-button-magnetic chat-button-breathe rounded-full w-16 h-16 bg-gradient-to-br from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 relative overflow-hidden transform hover:scale-110 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
                boxShadow: '0 20px 40px rgba(8, 145, 178, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
              }}
            >
              {/* Avatar da Sara - Conexão Emocional */}
              <div className="relative z-10 w-8 h-8 rounded-full overflow-hidden border-2 border-white/30">
                <img 
                  src={saraAvatar} 
                  alt="Sara"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs">S</div>';
                  }}
                />
                {/* Indicador de status online */}
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              
              {/* Efeito de brilho interno */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Partículas flutuantes - Efeito mágico */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <div className="absolute top-2 left-2 w-1 h-1 bg-white rounded-full animate-ping opacity-60" style={{ animationDelay: '0s' }}></div>
                <div className="absolute top-4 right-3 w-1 h-1 bg-yellow-300 rounded-full animate-ping opacity-60" style={{ animationDelay: '0.7s' }}></div>
                <div className="absolute bottom-3 left-4 w-1 h-1 bg-pink-300 rounded-full animate-ping opacity-60" style={{ animationDelay: '1.4s' }}></div>
                <div className="absolute bottom-2 right-2 w-1 h-1 bg-blue-300 rounded-full animate-ping opacity-60" style={{ animationDelay: '2.1s' }}></div>
              </div>
            </Button>
            
            {/* Contador de urgência - FOMO (Fear of Missing Out) */}
            {showUrgency && (
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce shadow-lg">
                <span className="animate-pulse">🔥</span>
              </div>
            )}
            
            {/* Pulso de atenção após 30 segundos */}
            {attentionPulse && (
              <div className="absolute inset-0 rounded-full border-4 border-yellow-400 animate-ping"></div>
            )}
            
            {/* Texto motivacional que aparece após 3 segundos */}

          </div>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={embedded 
          ? "w-full max-w-5xl mx-auto h-[700px] flex flex-col relative animate-in fade-in duration-300"
          : "fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)]"
        }>
          <div className={`${
            embedded 
              ? "flex flex-col h-full bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden" 
              : "bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden"
          }`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center overflow-hidden backdrop-blur-sm">
                      <img 
                        src={saraAvatar} 
                        alt="Sara - Coordenadora de Projetos"
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => {
                          // Fallback para o avatar com letra se a imagem não carregar
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.innerHTML = '<div class="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">S</div>';
                        }}
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Sara</h3>
                    <p className="text-slate-300 text-xs">Coordenadora de Projetos • Online</p>
                  </div>
                </div>
                {!embedded && (
                  <Button
                    onClick={() => setIsOpen(false)}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-slate-900/50 h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50 to-white">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-2 ${
                    message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0 overflow-hidden ${
                      message.type === 'user' ? 'bg-gradient-to-br from-cyan-600 to-cyan-700 shadow-sm' : 'bg-slate-100'
                    }`}
                  >
                    {message.type === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <img
                        src={saraAvatar}
                        alt="Sara"
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.innerHTML = '<div class="w-6 h-6 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xs">S</div>';
                        }}
                      />
                    )}
                  </div>

                  {/* Message */}
                  <div className={`max-w-[75%] ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                    <div
                      className={`px-4 py-2 rounded-2xl shadow-sm ${
                        message.type === 'user'
                          ? 'bg-gradient-to-br from-cyan-600 to-cyan-700 text-white rounded-br-sm'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-bl-sm'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                    </div>
                    <p className={`text-xs text-slate-500 mt-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}

              {/* Typing Indicator - Sara está digitando */}
              {isTyping && (
                <div className="flex items-start space-x-2 animate-in fade-in duration-300">
                  {/* Avatar da Sara */}
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden bg-slate-100">
                    <img
                      src={saraAvatar}
                      alt="Sara"
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = '<div class="w-6 h-6 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xs">S</div>';
                      }}
                    />
                  </div>

                  {/* Bubble de digitação */}
                  <div className="max-w-[75%]">
                    <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white border border-slate-200 shadow-sm">
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-slate-600 mr-2">Sara está digitando</span>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Elemento para auto-scroll */}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {(() => {
              const getQuickReplies = (): string[] => {
                if (context.currentStep === 0) {
                  return ["Preciso de um site", "Quanto custa?", "Quero uma loja online", "Fazer portfólio"];
                } else if (context.currentStep === 1 && !context.projectType) {
                  return ["Site institucional", "E-commerce", "Landing Page", "Portfólio"];
                } else if (context.currentStep === 2 && !context.businessType) {
                  return ["Restaurante", "Loja física", "Consultoria", "Serviços"];
                } else if (context.currentStep === 3 && !context.budget) {
                  return ["Até R$ 1.000", "R$ 1.000-2.000", "Acima de R$ 2.000", "Vamos conversar"];
                } else if (context.currentStep >= 4) {
                  return ["Sim, quero proposta!", "Ver exemplos", "Chamar no WhatsApp", "Tenho dúvidas"];
                }
                return [];
              };

              const quickReplies = getQuickReplies();
              
              return quickReplies.length > 0 && (
                <div className="px-4 py-2 bg-white border-t border-slate-100">
                  <div className="flex flex-wrap gap-2">
                    {quickReplies.map((text) => (
                      <Button
                        key={text}
                        onClick={() => {
                          setInputText(text);
                          setTimeout(sendMessage, 100);
                        }}
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 px-3 rounded-full border-cyan-200 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-300 transition-colors"
                      >
                        {text}
                      </Button>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-200">
              <div className="flex items-center space-x-2">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 rounded-full border-slate-200 focus:border-cyan-500 focus:ring-cyan-500/20 text-slate-900 placeholder:text-slate-400"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!inputText.trim()}
                  size="sm"
                  className="rounded-full w-10 h-10 p-0 bg-gradient-to-br from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 shadow-sm disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
                <span className="flex items-center space-x-1">
                  <span>💬</span>
                  <span>Chat em tempo real</span>
                </span>
                <button
                  onClick={() => window.open('https://wa.me/5585991575525', '_blank')}
                  className="hover:text-emerald-600 transition-colors"
                >
                  WhatsApp: (85) 99157-5525
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}