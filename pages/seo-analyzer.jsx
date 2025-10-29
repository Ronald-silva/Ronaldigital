import { useState } from "react";
import Head from "next/head";
import { Search, Globe, TrendingUp, Zap, Target, Award, AlertCircle, CheckCircle, Clock, ExternalLink } from "lucide-react";

export default function SEOAnalyzerPage() {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

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

  const getScoreColor = (score) => {
    if (!score) return "text-gray-500";
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreIcon = (score) => {
    if (!score) return <AlertCircle className="w-8 h-8" />;
    if (score >= 80) return <CheckCircle className="w-8 h-8 text-green-600" />;
    if (score >= 60) return <AlertCircle className="w-8 h-8 text-yellow-600" />;
    return <AlertCircle className="w-8 h-8 text-red-600" />;
  };

  return (
    <>
      <Head>
        <title>Análise SEO Gratuita - Ronald Digital</title>
        <meta name="description" content="Análise SEO profissional gratuita. Descubra como melhorar seu site para aparecer melhor no Google e aumentar suas vendas." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Análise SEO Profissional</h1>
                  <p className="text-sm text-gray-600">Ronald Digital</p>
                </div>
              </div>
              <a 
                href="/"
                className="text-purple-600 hover:text-purple-700 font-medium flex items-center space-x-1"
              >
                <span>Voltar ao Site</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Descubra Como Seu Site Está Performando
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Análise SEO completa e gratuita. Identifique problemas e oportunidades para melhorar seu ranqueamento no Google.
            </p>
            
            {/* Formulário de Análise */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="max-w-md mx-auto">
                <label className="block text-left text-sm font-medium text-gray-700 mb-3">
                  Digite a URL do seu site:
                </label>
                <div className="flex space-x-3">
                  <input
                    type="url"
                    placeholder="exemplo.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isAnalyzing && analyzeWebsite()}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={isAnalyzing}
                  />
                  <button
                    onClick={analyzeWebsite}
                    disabled={isAnalyzing || !url.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-200"
                  >
                    {isAnalyzing ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Analisando...</span>
                      </div>
                    ) : (
                      'Analisar Grátis'
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Benefícios */}
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <Zap className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">Performance</h3>
                <p className="text-sm text-gray-600">Velocidade e otimização técnica</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <Target className="w-8 h-8 text-green-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">SEO On-page</h3>
                <p className="text-sm text-gray-600">Otimização para buscadores</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <Globe className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">UX Design</h3>
                <p className="text-sm text-gray-600">Experiência do usuário</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <Award className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">Autoridade</h3>
                <p className="text-sm text-gray-600">Credibilidade online</p>
              </div>
            </div>
          </div>

          {/* Resultado da Análise */}
          {result && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {/* Score Geral */}
              {result.success && result.score !== undefined && (
                <div className="text-center mb-8 pb-8 border-b">
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    {getScoreIcon(result.score)}
                    <div>
                      <div className={`text-4xl font-bold ${getScoreColor(result.score)}`}>
                        {result.score}/100
                      </div>
                      <p className="text-gray-600">Score Geral de SEO</p>
                    </div>
                  </div>
                  
                  {/* Dados Técnicos */}
                  {result.technicalData && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <Clock className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                        <div className="text-sm font-medium">{result.technicalData.loadTime}ms</div>
                        <div className="text-xs text-gray-600">Velocidade</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <Globe className="w-5 h-5 text-green-500 mx-auto mb-1" />
                        <div className="text-sm font-medium">{result.technicalData.hasHttps ? 'HTTPS ✓' : 'HTTP ✗'}</div>
                        <div className="text-xs text-gray-600">Segurança</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <Target className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                        <div className="text-sm font-medium">{result.technicalData.headingsCount}</div>
                        <div className="text-xs text-gray-600">Headings</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <Award className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
                        <div className="text-sm font-medium">{result.technicalData.imagesCount}</div>
                        <div className="text-xs text-gray-600">Imagens</div>
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
                      .replace(/• (.*?)$/gm, '<li class="ml-4">$1</li>')
                  }}
                />
              </div>

              {/* Call to Action */}
              <div className="mt-12 pt-8 border-t text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Pronto para Melhorar Seu Site?
                </h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Nossa equipe especializada pode implementar todas essas melhorias e deixar seu site otimizado para aparecer melhor no Google.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => {
                      setResult(null);
                      setUrl("");
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Analisar Outro Site
                  </button>
                  <a
                    href="https://wa.me/5585991993833?text=Olá! Vi a análise SEO do meu site e gostaria de melhorar os resultados."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium inline-flex items-center justify-center space-x-2"
                  >
                    <span>Falar com Especialista</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center mt-12 text-gray-600">
            <p>© 2024 Ronald Digital - Análise SEO Profissional</p>
          </div>
        </div>
      </div>
    </>
  );
}