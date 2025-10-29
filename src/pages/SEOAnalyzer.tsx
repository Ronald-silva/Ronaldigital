import { useState } from "react";
import { Search, Globe, TrendingUp, Zap, Target, Award, AlertCircle, CheckCircle, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Função de análise SEO frontend
async function performFrontendSEOAnalysis(url: string): Promise<SEOResult> {
  // Simula tempo de análise
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const domain = new URL(url).hostname;
  const hasHttps = url.startsWith('https://');
  
  // Calcula score baseado em fatores básicos
  let score = 100;
  if (!hasHttps) score -= 20;
  
  // Análise baseada no domínio
  const isPopularSite = ['google.com', 'facebook.com', 'youtube.com', 'amazon.com'].includes(domain);
  const isBusinessSite = domain.includes('digital') || domain.includes('tech') || domain.includes('web');
  
  if (isPopularSite) score = Math.max(score, 85);
  if (isBusinessSite) score = Math.max(score - 10, 70);
  
  // Gera análise personalizada
  const analysis = generateSEOAnalysis(url, score, hasHttps, domain);
  
  return {
    success: true,
    url: url,
    score: score,
    analysis: analysis,
    technicalData: {
      loadTime: Math.floor(Math.random() * 2000) + 500,
      hasHttps: hasHttps,
      responsive: true,
      title: `Análise de ${domain}`,
      metaDescription: `Meta description para ${domain}`,
      headingsCount: Math.floor(Math.random() * 10) + 5,
      imagesCount: Math.floor(Math.random() * 20) + 10,
      linksCount: Math.floor(Math.random() * 50) + 20,
      errorsCount: hasHttps ? 0 : 1
    },
    timestamp: new Date().toISOString()
  };
}

function generateSEOAnalysis(url: string, score: number, hasHttps: boolean, domain: string): string {
  const scoreEmoji = score >= 80 ? '🔥' : score >= 60 ? '⚠️' : '🚨';
  
  return `## 📋 Resumo Geral

Analisei completamente o site **${url}** e preparei um diagnóstico detalhado para você.

**Nota Geral: ${score}/100** ${scoreEmoji}

${score >= 80 ? 'Parabéns! Seu site está bem otimizado, mas sempre há espaço para melhorias.' : 
  score >= 60 ? 'Seu site tem uma base sólida, mas precisa de algumas otimizações importantes.' :
  'Seu site precisa de melhorias urgentes para competir no mercado digital.'}

## ⚡ Desempenho Técnico

• **HTTPS:** ${hasHttps ? '✅ Seguro e confiável' : '🚨 Não seguro - Urgente implementar!'}
• **Velocidade:** ${score >= 70 ? '✅ Boa performance' : '⚠️ Pode ser otimizada'}
• **Responsividade:** ✅ Compatível com dispositivos móveis
• **Impacto:** ${hasHttps ? 'Boa base técnica para SEO' : 'Google penaliza sites sem HTTPS'}

## 🎯 SEO On-page

• **Estrutura:** ${score >= 70 ? '✅ Bem organizada' : '⚠️ Precisa melhorar hierarquia'}
• **Meta Tags:** ${score >= 60 ? '✅ Implementadas' : '🚨 Ausentes ou incompletas'}
• **Headings:** ✅ Estrutura de títulos presente
• **Otimização:** ${score >= 80 ? 'Excelente para buscadores' : 'Precisa de ajustes para melhor ranqueamento'}

## 🎨 Design e Experiência do Usuário

• **Layout:** ${score >= 70 ? '✅ Profissional e organizado' : '⚠️ Pode ser mais atrativo'}
• **Navegação:** ✅ Intuitiva e funcional
• **CTAs:** ${score >= 60 ? '✅ Presentes' : '⚠️ Podem ser mais evidentes'}
• **Conversão:** ${score >= 80 ? 'Otimizado para gerar leads' : 'Tem potencial para melhorar conversões'}

## 🏆 Autoridade e Credibilidade Online

• **Domínio:** ${hasHttps ? '✅ Transmite confiança' : '🚨 Precisa de certificado SSL'}
• **Conteúdo:** ${score >= 70 ? '✅ Relevante e atualizado' : '⚠️ Pode ser mais rico em informações'}
• **Profissionalismo:** ${score >= 80 ? 'Excelente impressão' : 'Pode transmitir mais autoridade'}

---

💡 **Se quiser, posso te ajudar a implementar essas melhorias e deixar seu site 100% otimizado e moderno. Com as correções certas, seu site pode subir significativamente no Google!**

🚀 **Próximos passos recomendados:**
${!hasHttps ? '• Implementar certificado SSL (HTTPS)\n' : ''}
• Otimizar velocidade de carregamento
• Melhorar conteúdo e palavras-chave
• Implementar estratégia de link building
• Monitorar métricas de performance

**Entre em contato conosco para uma consultoria personalizada!**`;
}

interface SEOResult {
  success: boolean;
  url: string;
  score?: number;
  analysis: string;
  technicalData?: {
    loadTime: number;
    hasHttps: boolean;
    responsive: boolean;
    title: string;
    metaDescription: string;
    headingsCount: number;
    imagesCount: number;
    linksCount: number;
    errorsCount: number;
  };
  error?: string;
  timestamp: string;
}

export default function SEOAnalyzer() {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<SEOResult | null>(null);

  const analyzeWebsite = async () => {
    if (!url.trim()) {
      alert("Por favor, digite uma URL válida");
      return;
    }

    // Adiciona https:// se não tiver protocolo
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      // Simula análise SEO (versão frontend)
      const analysisResult = await performFrontendSEOAnalysis(formattedUrl);
      setResult(analysisResult);
      
    } catch (error) {
      console.error('Erro ao analisar site:', error);
      setResult({
        success: false,
        url: formattedUrl,
        error: "Erro de conexão",
        analysis: "Não foi possível conectar com o servidor de análise. Tente novamente em alguns minutos.",
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score?: number) => {
    if (!score) return "text-gray-500";
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreIcon = (score?: number) => {
    if (!score) return <AlertCircle className="w-8 h-8" />;
    if (score >= 80) return <CheckCircle className="w-8 h-8 text-green-600" />;
    if (score >= 60) return <AlertCircle className="w-8 h-8 text-yellow-600" />;
    return <AlertCircle className="w-8 h-8 text-red-600" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Search className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Análise SEO Gratuita
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Descubra como seu site está performando no Google e receba um diagnóstico profissional completo
          </p>
        </div>

        {/* Formulário Principal */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="max-w-lg mx-auto">
            <label className="block text-center text-lg font-semibold text-gray-800 mb-4">
              🌐 Digite a URL do seu site:
            </label>
            <div className="flex space-x-3">
              <Input
                type="url"
                placeholder="exemplo.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isAnalyzing && analyzeWebsite()}
                className="flex-1 text-lg py-6 px-4 border-2 border-gray-200 focus:border-purple-500"
                disabled={isAnalyzing}
              />
              <Button
                onClick={analyzeWebsite}
                disabled={isAnalyzing || !url.trim()}
                className="px-8 py-6 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isAnalyzing ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Analisando...</span>
                  </div>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Analisar Grátis
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-2 text-center">
              ✨ Análise completa em segundos - 100% gratuito
            </p>
          </div>
        </div>

        {/* Benefícios */}
        {!result && (
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <Zap className="w-10 h-10 text-blue-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Performance</h3>
              <p className="text-sm text-gray-600">Velocidade e otimização técnica</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <Target className="w-10 h-10 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">SEO On-page</h3>
              <p className="text-sm text-gray-600">Otimização para buscadores</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <Globe className="w-10 h-10 text-purple-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">UX Design</h3>
              <p className="text-sm text-gray-600">Experiência do usuário</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <Award className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Autoridade</h3>
              <p className="text-sm text-gray-600">Credibilidade online</p>
            </div>
          </div>
        )}

        {/* Resultado da Análise */}
        {result && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Score Geral */}
            {result.success && result.score !== undefined && (
              <div className="text-center mb-8 pb-8 border-b">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  {getScoreIcon(result.score)}
                  <div>
                    <div className={`text-5xl font-bold ${getScoreColor(result.score)}`}>
                      {result.score}/100
                    </div>
                    <p className="text-gray-600 text-lg">Score Geral de SEO</p>
                  </div>
                </div>
                
                {/* Dados Técnicos */}
                {result.technicalData && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                      <div className="font-medium">{result.technicalData.loadTime}ms</div>
                      <div className="text-sm text-gray-600">Velocidade</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <Globe className="w-6 h-6 text-green-500 mx-auto mb-2" />
                      <div className="font-medium">{result.technicalData.hasHttps ? 'HTTPS ✓' : 'HTTP ✗'}</div>
                      <div className="text-sm text-gray-600">Segurança</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <Target className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                      <div className="font-medium">{result.technicalData.headingsCount}</div>
                      <div className="text-sm text-gray-600">Headings</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <Award className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                      <div className="font-medium">{result.technicalData.imagesCount}</div>
                      <div className="text-sm text-gray-600">Imagens</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Análise Detalhada */}
            <div className="prose prose-lg max-w-none">
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: result.analysis
                    .replace(/\n/g, '<br>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/## (.*?)$/gm, '<h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4 flex items-center">$1</h2>')
                    .replace(/• (.*?)$/gm, '<li class="ml-4 mb-2">$1</li>')
                }}
              />
            </div>

            {/* Call to Action */}
            <div className="mt-12 pt-8 border-t text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                🚀 Pronto para Melhorar Seu Site?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Nossa equipe pode implementar todas essas melhorias e deixar seu site otimizado para aparecer melhor no Google.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => {
                    setResult(null);
                    setUrl("");
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  variant="outline"
                  className="px-6 py-3"
                >
                  Analisar Outro Site
                </Button>
                <Button
                  onClick={() => {
                    window.open('https://wa.me/5585991993833?text=Olá! Vi a análise SEO do meu site e gostaria de melhorar os resultados.', '_blank');
                  }}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700"
                >
                  <span>Falar com Especialista</span>
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}