import React from 'react';
import { ChatWidget } from '../components/chat/ChatWidget';
import { Brain, Zap, Target, Heart, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

export default function SaraAI() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-xl">
                <Brain className="h-10 w-10 text-purple-600" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-purple-50 animate-pulse"></div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Fale com a Sara
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Sua especialista digital pessoal. 
            <span className="block mt-2 text-base text-slate-500">
              Estou aqui para criar a estratégia perfeita para o seu negócio.
            </span>
          </p>
        </div>

        {/* Chat da Sara AI - Embedded */}
        <div className="mb-12">
          <ChatWidget embedded={true} />
        </div>



        {/* Footer informativo */}
        <div className="text-center mt-8 space-y-4">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Users className="h-5 w-5" />
            <span className="text-sm">
              Sistema desenvolvido pela RonalDigital usando LangChain + Grok API
            </span>
          </div>
          
          <div className="text-xs text-gray-500 max-w-2xl mx-auto">
            <p>
              A Sara AI combina décadas de conhecimento em vendas dos maiores especialistas mundiais 
              em uma única inteligência artificial. Cada conversa é personalizada e otimizada para 
              maximizar a conversão e satisfação do cliente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}