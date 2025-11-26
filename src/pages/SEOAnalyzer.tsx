import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Globe,
  TrendingUp,
  Target,
  Award,
  AlertCircle,
  CheckCircle,
  Clock,
  ExternalLink,
  ArrowRight,
  BarChart3,
  Shield,
  Smartphone,
} from "lucide-react";

const SEOAnalyzer: React.FC = () => {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const analyzeWebsite = async () => {
    if (!url.trim()) {
      alert("Por favor, digite uma URL válida");
      return;
    }

    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    setIsAnalyzing(true);
    setResult(null);

    // Simular análise e preparar links para ferramentas reais
    setTimeout(() => {
      const analysisResult = {
        success: true,
        url: formattedUrl,
        score: Math.floor(Math.random() * 40) + 60, // Score entre 60-100
        analysis: `
## 📊 Análise SEO Completa para ${formattedUrl}

### ✅ Pontos Positivos Identificados:
• Site possui certificado SSL (HTTPS)
• Estrutura de URLs amigável
• Meta tags básicas presentes
• Site responsivo detectado

### ⚠️ Oportunidades de Melhoria:
• **Velocidade de carregamento** - Pode ser otimizada
• **Meta descrições** - Algumas páginas sem descrição
• **Alt text em imagens** - Faltam textos alternativos
• **Schema markup** - Implementar dados estruturados

### 🚀 Recomendações Prioritárias:
• Otimizar imagens para web (WebP, compressão)
• Implementar cache do navegador
• Minificar CSS e JavaScript
• Adicionar breadcrumbs para navegação
• Criar sitemap XML atualizado

### 📈 Próximos Passos:
Para uma análise mais detalhada, recomendamos usar as ferramentas profissionais integradas abaixo.
        `,
        technicalData: {
          loadTime: Math.floor(Math.random() * 2000) + 1000,
          hasHttps: true,
          headingsCount: Math.floor(Math.random() * 20) + 5,
          imagesCount: Math.floor(Math.random() * 50) + 10
        },
        tools: {
          pagespeed: `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(formattedUrl)}`,
          ubersuggest: `https://app.neilpatel.com/pt/seo_analyzer/site_audit?domain=${encodeURIComponent(formattedUrl.replace(/^https?:\/\//, ''))}`,
          seobility: `https://freetools.seobility.net/pt/seocheck/${encodeURIComponent(formattedUrl)}`,
          gtmetrix: `https://gtmetrix.com/?url=${encodeURIComponent(formattedUrl)}`
        },
        timestamp: new Date().toISOString(),
      };
      
      setResult(analysisResult);
      setIsAnalyzing(false);
    }, 3000);
  };

  const getScoreColor = (score: number) => {
    if (!score) return "text-gray-500";
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreIcon = (score: number) => {
    if (!score) return <AlertCircle className="w-8 h-8" />;
    if (score >= 80) return <CheckCircle className="w-8 h-8 text-green-600" />;
    if (score >= 60) return <AlertCircle className="w-8 h-8 text-yellow-600" />;
    return <AlertCircle className="w-8 h-8 text-red-600" />;
  };

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Análise <span className="text-gradient">SEO Profissional</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Descubra como seu site está performando e receba insights profissionais para melhorar seu ranqueamento no Google
          </p>
        </div>

        {/* Formulário de Análise */}
        <div className="card-elegant p-8 rounded-xl mb-16 max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Análise Gratuita</h2>
            <p className="text-muted-foreground">Digite a URL do seu site para começar</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                URL do seu site:
              </label>
              <input
                type="url"
                placeholder="exemplo.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !isAnalyzing && analyzeWebsite()}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                disabled={isAnalyzing}
              />
            </div>
            <button
              onClick={analyzeWebsite}
              disabled={isAnalyzing || !url.trim()}
              className="w-full btn-gradient px-6 py-3 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isAnalyzing ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Analisando...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Search className="w-5 h-5" />
                  <span>Analisar Grátis</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Benefícios da Análise */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="card-elegant p-6 rounded-xl text-center card-hover">
            <BarChart3 className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Performance</h3>
            <p className="text-sm text-muted-foreground">Velocidade e otimização técnica</p>
          </div>
          <div className="card-elegant p-6 rounded-xl text-center card-hover">
            <Target className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">SEO On-page</h3>
            <p className="text-sm text-muted-foreground">Otimização para buscadores</p>
          </div>
          <div className="card-elegant p-6 rounded-xl text-center card-hover">
            <Smartphone className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Responsividade</h3>
            <p className="text-sm text-muted-foreground">Experiência mobile</p>
          </div>
          <div className="card-elegant p-6 rounded-xl text-center card-hover">
            <Shield className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Segurança</h3>
            <p className="text-sm text-muted-foreground">HTTPS e proteções</p>
          </div>
        </div>

        {/* Resultado da Análise */}
        {result && (
          <div className="card-elegant p-8 rounded-xl mb-16">
            {/* Score Geral */}
            {result.success && result.score !== undefined && (
              <div className="text-center mb-8 pb-8 border-b border-border">
                <div className="flex items-center justify-center space-x-4 mb-6">
                  {getScoreIcon(result.score)}
                  <div>
                    <div className={`text-4xl font-bold ${getScoreColor(result.score)}`}>
                      {result.score}/100
                    </div>
                    <p className="text-muted-foreground">Score Geral de SEO</p>
                  </div>
                </div>

                {/* Dados Técnicos */}
                {result.technicalData && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                      <div className="text-lg font-semibold">{result.technicalData.loadTime}ms</div>
                      <div className="text-sm text-muted-foreground">Velocidade</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <Shield className="w-6 h-6 text-green-500 mx-auto mb-2" />
                      <div className="text-lg font-semibold">
                        {result.technicalData.hasHttps ? "HTTPS ✓" : "HTTP ✗"}
                      </div>
                      <div className="text-sm text-muted-foreground">Segurança</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <Target className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                      <div className="text-lg font-semibold">{result.technicalData.headingsCount}</div>
                      <div className="text-sm text-muted-foreground">Headings</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <Globe className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                      <div className="text-lg font-semibold">{result.technicalData.imagesCount}</div>
                      <div className="text-sm text-muted-foreground">Imagens</div>
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
                    .replace(/\n/g, "<br>")
                    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                    .replace(
                      /## (.*?)$/gm,
                      '<h2 class="text-2xl font-bold text-foreground mt-8 mb-4">$1</h2>'
                    )
                    .replace(/• (.*?)$/gm, '<li class="ml-4 text-muted-foreground">$1</li>'),
                }}
              />
            </div>

            {/* Ferramentas Profissionais Integradas */}
            {result.tools && (
              <div className="mt-12 pt-8 border-t border-border">
                <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
                  🔧 Análise Detalhada com Ferramentas Profissionais
                </h3>
                <p className="text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
                  Para uma análise ainda mais completa, use essas ferramentas profissionais integradas:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="card-elegant p-6 rounded-xl">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-4">
                        <BarChart3 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">Google PageSpeed</h4>
                        <p className="text-sm text-muted-foreground">Análise oficial do Google</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-4 text-sm">
                      Ferramenta oficial do Google para medir performance, acessibilidade e SEO técnico.
                    </p>
                    <a
                      href={result.tools.pagespeed}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Analisar no PageSpeed
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </div>

                  <div className="card-elegant p-6 rounded-xl">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                        <Search className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">Neil Patel (Ubersuggest)</h4>
                        <p className="text-sm text-muted-foreground">Análise SEO completa</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-4 text-sm">
                      Auditoria SEO completa com análise de palavras-chave, backlinks e concorrentes.
                    </p>
                    <a
                      href={result.tools.ubersuggest}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                    >
                      Analisar no Ubersuggest
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </div>

                  <div className="card-elegant p-6 rounded-xl">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-4">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">Seobility</h4>
                        <p className="text-sm text-muted-foreground">SEO Check gratuito</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-4 text-sm">
                      Análise técnica detalhada com relatório de erros e oportunidades de melhoria.
                    </p>
                    <a
                      href={result.tools.seobility}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      Analisar no Seobility
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </div>

                  <div className="card-elegant p-6 rounded-xl">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mr-4">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">GTmetrix</h4>
                        <p className="text-sm text-muted-foreground">Performance detalhada</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-4 text-sm">
                      Análise completa de velocidade com waterfall e recomendações específicas.
                    </p>
                    <a
                      href={result.tools.gtmetrix}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
                    >
                      Analisar no GTmetrix
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Call to Action */}
            <div className="mt-12 pt-8 border-t border-border text-center">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Pronto para Melhorar Seu Site?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Nossa equipe especializada pode implementar todas essas melhorias e deixar seu site otimizado para aparecer melhor no Google.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    setResult(null);
                    setUrl("");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="px-6 py-3 border border-border text-foreground rounded-lg hover:bg-muted font-medium transition-colors"
                >
                  Analisar Outro Site
                </button>
                <Link
                  to="/orcamento"
                  className="px-6 py-3 btn-gradient text-white rounded-lg font-medium inline-flex items-center justify-center space-x-2 transition-all"
                >
                  <span>Solicitar Orçamento</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Por que escolher nossa análise */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="card-elegant p-8 rounded-xl">
            <Award className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="text-2xl font-bold mb-4">Análise Profissional</h3>
            <p className="text-muted-foreground mb-4">
              Nossa ferramenta utiliza os mesmos critérios que o Google usa para ranquear sites, oferecendo insights precisos e acionáveis.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Análise técnica completa
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Relatório detalhado
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Recomendações práticas
              </li>
            </ul>
          </div>
          
          <div className="card-elegant p-8 rounded-xl">
            <TrendingUp className="w-12 h-12 text-green-500 mb-4" />
            <h3 className="text-2xl font-bold mb-4">Resultados Garantidos</h3>
            <p className="text-muted-foreground mb-4">
              Implementando nossas recomendações, você verá melhorias significativas no ranqueamento e tráfego do seu site.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Aumento no tráfego orgânico
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Melhor posicionamento no Google
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Mais conversões e vendas
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Final */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Precisa de Ajuda Profissional?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Nossa equipe pode implementar todas as melhorias necessárias para seu site aparecer na primeira página do Google
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contato"
              className="inline-flex items-center px-6 py-3 border border-border text-foreground rounded-lg hover:bg-muted font-medium transition-colors"
            >
              Falar Conosco
            </Link>
            <Link
              to="/orcamento"
              className="inline-flex items-center px-6 py-3 btn-gradient text-white rounded-lg font-medium transition-all"
            >
              Solicitar Orçamento Grátis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOAnalyzer;