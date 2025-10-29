import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Globe, TrendingUp, Zap, Target, Award, AlertCircle, CheckCircle, Clock } from "lucide-react";

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

export function SEOAnalyzerWidget() {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<SEOResult | null>(null);
  const [showWidget, setShowWidget] = useState(false);

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
      const response = await fetch('/api/seo-analyzer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: formattedUrl }),
      });

      const data = await response.json();
      setResult(data);
      
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
    if (!score) return <AlertCircle className="w-5 h-5" />;
    if (score >= 80) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (score >= 60) return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    return <AlertCircle className="w-5 h-5 text-red-600" />;
  };

  return (
    <>
      {/* Botão Flutuante */}
      {!showWidget && (
        <div className="fixed bottom-6 left-6 z-50">
          <Button
            onClick={() => setShowWidget(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full p-4 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 group"
          >
            <Search className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="ml-2 font-semibold">Análise SEO Gratuita</span>
          </Button>
        </div>
      )}

      {/* Widget Principal */}
      {showWidget && (
        <div className="fixed bottom-6 left-6 z-50 w-96 max-w-[calc(100vw-2rem)]">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Search className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Análise SEO</h3>
                    <p className="text-purple-100 text-sm">Diagnóstico Profissional Gratuito</p>
                  </div>
                </div>
                <Button
                  onClick={() => setShowWidget(false)}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-purple-700 h-8 w-8 p-0"
                >
                  ×
                </Button>
              </div>
            </div>

            {/* Conteúdo */}
            <div className="p-4 max-h-96 overflow-y-auto">
              {!result ? (
                <>
                  {/* Formulário de Análise */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL do Site para Análise
                      </label>
                      <div className="flex space-x-2">
                        <Input
                          type="url"
                          placeholder="exemplo.com ou https://exemplo.com"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && !isAnalyzing && analyzeWebsite()}
                          className="flex-1"
                          disabled={isAnalyzing}
                        />
                        <Button
                          onClick={analyzeWebsite}
                          disabled={isAnalyzing || !url.trim()}
                          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        >
                          {isAnalyzing ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Analisando...</span>
                            </div>
                          ) : (
                            <Search className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Benefícios */}
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-3">
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-2 text-purple-600" />
                        O que você vai descobrir:
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li className="flex items-center">
                          <Zap className="w-3 h-3 mr-2 text-blue-500" />
                          Velocidade e performance técnica
                        </li>
                        <li className="flex items-center">
                          <Target className="w-3 h-3 mr-2 text-green-500" />
                          Otimização para Google (SEO)
                        </li>
                        <li className="flex items-center">
                          <Globe className="w-3 h-3 mr-2 text-purple-500" />
                          Experiência do usuário
                        </li>
                        <li className="flex items-center">
                          <Award className="w-3 h-3 mr-2 text-yellow-500" />
                          Autoridade e credibilidade
                        </li>
                      </ul>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Resultado da Análise */}
                  <div className="space-y-4">
                    {/* Score Geral */}
                    {result.success && result.score !== undefined && (
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                          {getScoreIcon(result.score)}
                          <span className={`text-2xl font-bold ${getScoreColor(result.score)}`}>
                            {result.score}/100
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">Score Geral de SEO</p>
                      </div>
                    )}

                    {/* Dados Técnicos Rápidos */}
                    {result.success && result.technicalData && (
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-gray-50 rounded p-2 flex items-center">
                          <Clock className="w-3 h-3 mr-1 text-blue-500" />
                          <span>{result.technicalData.loadTime}ms</span>
                        </div>
                        <div className="bg-gray-50 rounded p-2 flex items-center">
                          <Globe className="w-3 h-3 mr-1 text-green-500" />
                          <span>{result.technicalData.hasHttps ? 'HTTPS ✓' : 'HTTP ✗'}</span>
                        </div>
                      </div>
                    )}

                    {/* Análise Completa */}
                    <div className="bg-white border rounded-lg p-4 max-h-64 overflow-y-auto">
                      <div 
                        className="prose prose-sm max-w-none text-gray-700"
                        dangerouslySetInnerHTML={{ 
                          __html: result.analysis.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                        }}
                      />
                    </div>

                    {/* Ações */}
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => {
                          setResult(null);
                          setUrl("");
                        }}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        Nova Análise
                      </Button>
                      <Button
                        onClick={() => {
                          // Aqui você pode implementar ação para contato
                          window.open('https://wa.me/5585991993833?text=Olá! Vi a análise SEO do meu site e gostaria de melhorar os resultados.', '_blank');
                        }}
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        Melhorar Site
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}