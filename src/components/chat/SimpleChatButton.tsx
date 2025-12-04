import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, X, User } from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  time: string;
}

export function SimpleChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll quando novas mensagens chegam
  const scrollToBottom = () => {
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

  const addMessage = (type: 'user' | 'ai', content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;
    
    // Adiciona mensagem do usuário
    addMessage('user', currentMessage);
    
    // Gera resposta automática baseada na mensagem
    const userMsg = currentMessage.toLowerCase();
    let response = "";
    
    if (userMsg.includes('oi') || userMsg.includes('olá')) {
      response = "Oi! 👋 Sou o Ronald, especialista em sites. Como posso te ajudar?";
    } else if (userMsg.includes('preço') || userMsg.includes('valor') || userMsg.includes('custa')) {
      response = "Os valores variam:\n• Landing Page: R$ 500-1.000\n• Portfólio: R$ 400-800\n• Site completo: R$ 800-2.000\n\nQue tipo de projeto você precisa?";
    } else if (userMsg.includes('site') || userMsg.includes('preciso')) {
      response = "Perfeito! Posso te ajudar com seu site. 🚀\n\nQue tipo você precisa? Loja online, portfólio, institucional?";
    } else if (userMsg.includes('loja') || userMsg.includes('e-commerce')) {
      response = "E-commerce é uma excelente escolha! 🛒\n\nFica entre R$ 1.200-3.000 com tudo integrado. Quantos produtos você tem?";
    } else if (userMsg.includes('portfolio') || userMsg.includes('portfólio')) {
      response = "Portfólios são ótimos para mostrar seu trabalho! 🎨\n\nVocê é de que área? Design, fotografia, arquitetura?";
    } else {
      response = "Entendi! Posso te ajudar com isso. 😊\n\nPara dar a melhor sugestão, me conta mais sobre seu projeto!";
    }
    
    // Adiciona resposta do bot após um delay
    setTimeout(() => {
      addMessage('ai', response);
    }, 1000);
    
    setCurrentMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    // Mensagem de boas-vindas se for a primeira vez
    if (messages.length === 0) {
      setTimeout(() => {
        addMessage('ai', "👋 Oi! Sou o Ronald, especialista em sites.\n\nComo posso te ajudar hoje?");
      }, 500);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          <Button
            onClick={handleOpen}
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
      <div className="bg-white border border-gray-200 rounded-lg shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="font-bold text-lg">Ronald</h3>
                <p className="text-slate-300 text-xs">Especialista em Sites • Online</p>
              </div>
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-slate-900/50 h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
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

                <div className={`text-xs text-slate-500 mt-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                  {message.time}
                </div>
              </div>
            </div>
          ))}
          {/* Elemento para auto-scroll */}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        {messages.length <= 2 && (
          <div className="px-4 pb-2 bg-white border-t border-slate-100">
            <div className="flex flex-wrap gap-2 pt-2">
              {["Preciso de um site", "Quanto custa?", "Quero uma loja online", "Preciso de um portfólio"].map((reply, index) => (
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

        {/* Input */}
        <div className="border-t border-slate-200 p-4">
          <div className="flex items-center gap-2">
            <Input
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="flex-1 rounded-full border-slate-200 focus:border-cyan-500 focus:ring-cyan-500/20 text-slate-900 placeholder:text-slate-400"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!currentMessage.trim()}
              size="sm"
              className="rounded-full w-10 h-10 p-0 bg-gradient-to-br from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 shadow-sm disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
            <span>💬 Chat em tempo real</span>
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
  );
}