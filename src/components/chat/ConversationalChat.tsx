import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Bot, Send, Loader2, X, User, Sparkles } from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface LeadData {
  nome?: string;
  email?: string;
  telefone?: string;
  tipoServico?: string;
  orcamento?: string;
  prazo?: string;
}

export function ConversationalChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [leadData, setLeadData] = useState<LeadData>({});
  const [conversationStep, setConversationStep] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        addMessage('ai', "👋 Oi! Sou o Ronald, especialista em sites.\n\nComo posso te ajudar hoje?");
      }, 500);
    }
  }, [isOpen]);

  const addMessage = (type: 'user' | 'ai', content: string) => {
    const newMessage: Message = {
      id: Date.now().toString() + Math.random(),
      type,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addTypingMessage = () => {
    const typingMessage: Message = {
      id: 'typing',
      type: 'ai',
      content: '',
      timestamp: new Date(),
      isTyping: true
    };
    setMessages(prev => [...prev, typingMessage]);
  };

  const removeTypingMessage = () => {
    setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
  };

  const extractInfoFromMessage = (message: string): Partial<LeadData> => {
    const info: Partial<LeadData> = {};
    const lowerMessage = message.toLowerCase();
    
    // Detecta tipo de projeto
    if (lowerMessage.includes('landing') || lowerMessage.includes('página de vendas')) {
      info.tipoServico = 'landing-page';
    } else if (lowerMessage.includes('portfólio') || lowerMessage.includes('portfolio')) {
      info.tipoServico = 'portfolio';
    } else if (lowerMessage.includes('loja') || lowerMessage.includes('e-commerce') || lowerMessage.includes('vender')) {
      info.tipoServico = 'e-commerce';
    } else if (lowerMessage.includes('blog') || lowerMessage.includes('site')) {
      info.tipoServico = 'site-blog';
    }
    
    // Detecta nome (quando se apresenta)
    const nomeMatch = message.match(/(?:sou|me chamo|meu nome é|eu sou)\s+([a-záàâãéèêíïóôõöúçñ]+)/i);
    if (nomeMatch) {
      info.nome = nomeMatch[1];
    }
    
    return info;
  };

  const generateContextualResponse = (userMessage: string, currentData: LeadData): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Respostas baseadas no contexto
    if (lowerMessage.includes('preço') || lowerMessage.includes('valor') || lowerMessage.includes('custa')) {
      if (currentData.tipoServico === 'landing-page') {
        return "Landing pages ficam entre R$ 500-1.000, dependendo das funcionalidades.\n\nQue tipo de negócio você tem? Isso me ajuda a dar um valor mais preciso! 😊";
      } else if (currentData.tipoServico === 'e-commerce') {
        return "E-commerce completo fica entre R$ 1.200-3.000, com pagamento integrado.\n\nQuantos produtos você pretende vender? E qual seu nome?";
      } else {
        return "Os valores variam:\n• Landing Page: R$ 500-1.000\n• Portfólio: R$ 400-800\n• Site completo: R$ 800-2.000\n\nQue tipo de projeto você tem em mente?";
      }
    }
    
    if (lowerMessage.includes('prazo') || lowerMessage.includes('tempo') || lowerMessage.includes('demora')) {
      return "Normalmente entrego em 5-10 dias úteis, dependendo da complexidade.\n\nSe for urgente, posso priorizar! Qual seu prazo ideal?";
    }
    
    if (lowerMessage.includes('portfolio') || lowerMessage.includes('portfólio')) {
      return "Portfólios são ótimos para mostrar credibilidade! 🎨\n\nVocê é de que área? Fotografia, design, arquitetura...?";
    }
    
    if (lowerMessage.includes('loja') || lowerMessage.includes('vender') || lowerMessage.includes('produto')) {
      return "Perfeito! E-commerce é o futuro das vendas! 🛒\n\nQue tipo de produtos você quer vender?";
    }
    
    if (lowerMessage.includes('oi') || lowerMessage.includes('olá') || lowerMessage.includes('preciso')) {
      return "Oi! Que bom te conhecer! 😊\n\nQue tipo de projeto você tem em mente? Site, loja online, portfólio...?";
    }
    
    // Se mencionou nome, responde pessoalmente
    if (currentData.nome) {
      return `Legal, ${currentData.nome}! Vou te ajudar com isso.\n\nPara dar a melhor sugestão, me conta mais detalhes sobre seu projeto!`;
    }
    
    // Resposta padrão
    return "Entendi! Posso te ajudar com isso sim.\n\nQual seu nome e que tipo de projeto você tem em mente?";
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;
    
    const userMessage = currentMessage.trim();
    setCurrentMessage("");
    
    // Adiciona mensagem do usuário
    addMessage('user', userMessage);
    
    // Extrai informações
    const newInfo = extractInfoFromMessage(userMessage);
    const updatedLeadData = { ...leadData, ...newInfo };
    setLeadData(updatedLeadData);
    
    // Adiciona indicador de digitação
    addTypingMessage();
    setIsLoading(true);
    
    try {
      // Simula tempo de digitação humana
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));
      
      removeTypingMessage();
      
      // Gera resposta contextual
      const response = generateContextualResponse(userMessage, updatedLeadData);
      addMessage('ai', response);
      
      setConversationStep(prev => prev + 1);
      
      // Se coletou informações suficientes, oferece contato
      if (updatedLeadData.tipoServico && conversationStep >= 3) {
        setTimeout(() => {
          addMessage('ai', `\n🎯 Perfeito! Já entendi seu projeto.\n\nQuer que eu prepare uma proposta personalizada? Me passa seu WhatsApp ou email que te envio hoje mesmo!`);
        }, 2000);
      }
      
    } catch (error) {
      removeTypingMessage();
      addMessage('ai', "Ops, tive um probleminha. Mas estou aqui! Continue falando comigo 😊");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetChat = () => {
    setMessages([]);
    setLeadData({});
    setConversationStep(0);
    setCurrentMessage("");
  };

  const getQuickReplies = () => {
    if (conversationStep <= 1) {
      return [
        "Preciso de um site",
        "Quanto custa?",
        "Quero uma loja online",
        "Preciso de um portfólio"
      ];
    }
    return [];
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          <Button
            onClick={() => setIsOpen(true)}
            className="rounded-full w-16 h-16 bg-gradient-to-br from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Bot className="w-7 h-7" />
          </Button>

          {/* Pulse animation */}
          <div className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-20"></div>

          {/* Tooltip */}
          <div className="absolute -top-14 -left-20 bg-slate-800 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap opacity-95 shadow-lg backdrop-blur-sm">
            💬 Oi! Precisa de um site?
            <div className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-slate-800"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)]">
      <Card className="shadow-2xl border-gray-200 bg-white">
        <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">Ronald</CardTitle>
                <p className="text-slate-300 text-xs">Especialista em Sites • Online</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-slate-900/50 h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50 to-white">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-2 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                  message.type === 'user' ? 'bg-gradient-to-br from-cyan-600 to-cyan-700 shadow-sm' : 'bg-slate-600'
                }`}>
                  {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message */}
                <div className={`max-w-[75%] ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                  {message.isTyping ? (
                    <div className="bg-slate-100 p-3 rounded-2xl">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`p-3 rounded-2xl shadow-sm ${
                        message.type === 'user'
                          ? 'bg-gradient-to-br from-cyan-600 to-cyan-700 text-white rounded-br-md'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-bl-md'
                      }`}
                    >
                      <div className="text-sm whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </div>
                    </div>
                  )}

                  <div className={`text-xs text-slate-500 mt-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {getQuickReplies().length > 0 && (
            <div className="px-4 pb-2 bg-white border-t border-slate-100">
              <div className="flex flex-wrap gap-2 pt-2">
                {getQuickReplies().map((reply, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentMessage(reply);
                      setTimeout(() => handleSendMessage(), 100);
                    }}
                    className="text-xs h-7 px-3 rounded-full border-cyan-200 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-300 transition-colors"
                  >
                    {reply}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-slate-200 bg-white p-4">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua mensagem..."
                  disabled={isLoading}
                  className="border-slate-200 focus:border-cyan-500 focus:ring-cyan-500/20 rounded-full px-4 py-2 text-slate-900 placeholder:text-slate-400"
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !currentMessage.trim()}
                size="sm"
                className="rounded-full w-10 h-10 p-0 bg-gradient-to-br from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 shadow-sm disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-cyan-600" />
                <span>Powered by IA</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={resetChat}
                  className="hover:text-cyan-600 transition-colors"
                >
                  Nova conversa
                </button>
                <button
                  onClick={() => window.open('https://wa.me/5585991575525', '_blank')}
                  className="hover:text-emerald-600 transition-colors"
                >
                  WhatsApp
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}