import { GoogleGenerativeAI } from "@google/generative-ai";
import { OpenAI } from "@langchain/openai";
import axios from 'axios';
import * as cheerio from 'cheerio';

// Sistema de Análise SEO Profissional
export class SEOAnalyzer {
  constructor() {
    this.initializeAI();
  }

  initializeAI() {
    // Inicializa APIs de IA disponíveis
    this.aiModels = {};
    
    if (process.env.GEMINI_API_KEY) {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      this.aiModels.gemini = genAI.getGenerativeModel({ 
        model: "gemini-pro",
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
        }
      });
      console.log("✅ Gemini API inicializada para análise SEO");
    }

    if (process.env.GROK_API_KEY) {
      this.aiModels.grok = new OpenAI({
        openAIApiKey: process.env.GROK_API_KEY,
        modelName: "grok-beta",
        temperature: 0.7,
        maxTokens: 2000,
        configuration: { 
          basePath: "https://api.x.ai/v1" 
        }
      });
      console.log("✅ Grok API inicializada para análise SEO");
    }

    if (process.env.OPENAI_API_KEY) {
      this.aiModels.openai = new OpenAI({
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName: "gpt-4",
        temperature: 0.7,
        maxTokens: 2000
      });
      console.log("✅ OpenAI API inicializada para análise SEO");
    }
  }

  // 🔍 ANÁLISE COMPLETA DO SITE
  async analyzeSite(url) {
    try {
      console.log(`🔍 Iniciando análise SEO de: ${url}`);
      
      // 1. Coleta dados técnicos do site
      const siteData = await this.collectSiteData(url);
      
      // 2. Gera análise com IA
      const analysis = await this.generateAIAnalysis(url, siteData);
      
      // 3. Calcula score geral
      const overallScore = this.calculateOverallScore(siteData);
      
      return {
        success: true,
        url: url,
        overallScore: overallScore,
        analysis: analysis,
        technicalData: siteData,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('❌ Erro na análise SEO:', error);
      return {
        success: false,
        error: error.message,
        fallbackAnalysis: this.generateFallbackAnalysis(url)
      };
    }
  }

  // 📊 COLETA DADOS TÉCNICOS DO SITE
  async collectSiteData(url) {
    const data = {
      url: url,
      loadTime: null,
      htmlContent: null,
      title: null,
      metaDescription: null,
      headings: [],
      images: [],
      links: [],
      hasHttps: url.startsWith('https://'),
      responsive: null,
      errors: []
    };

    try {
      const startTime = Date.now();
      
      // Faz requisição para o site
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      data.loadTime = Date.now() - startTime;
      data.htmlContent = response.data;
      
      // Parse do HTML
      const $ = cheerio.load(response.data);
      
      // Extrai informações SEO
      data.title = $('title').text() || 'Sem título';
      data.metaDescription = $('meta[name="description"]').attr('content') || 'Sem meta description';
      
      // Coleta headings
      $('h1, h2, h3, h4, h5, h6').each((i, el) => {
        data.headings.push({
          tag: el.tagName.toLowerCase(),
          text: $(el).text().trim()
        });
      });
      
      // Coleta imagens
      $('img').each((i, el) => {
        data.images.push({
          src: $(el).attr('src'),
          alt: $(el).attr('alt') || 'Sem alt text'
        });
      });
      
      // Coleta links internos
      $('a[href]').each((i, el) => {
        const href = $(el).attr('href');
        if (href && (href.startsWith('/') || href.includes(new URL(url).hostname))) {
          data.links.push({
            href: href,
            text: $(el).text().trim()
          });
        }
      });
      
      // Verifica responsividade
      data.responsive = $('meta[name="viewport"]').length > 0;
      
    } catch (error) {
      data.errors.push(`Erro ao acessar site: ${error.message}`);
    }

    return data;
  }

  // 🤖 GERA ANÁLISE COM IA
  async generateAIAnalysis(url, siteData) {
    const prompt = `
Você é um Analista de SEO e Experiência Digital altamente qualificado. Analise o site e apresente um diagnóstico profissional, claro e persuasivo.

SITE ANALISADO: ${url}

DADOS TÉCNICOS COLETADOS:
- Tempo de carregamento: ${siteData.loadTime}ms
- HTTPS: ${siteData.hasHttps ? 'Sim' : 'Não'}
- Responsivo: ${siteData.responsive ? 'Sim' : 'Não'}
- Título: "${siteData.title}"
- Meta Description: "${siteData.metaDescription}"
- Headings encontrados: ${siteData.headings.length}
- Imagens: ${siteData.images.length}
- Links internos: ${siteData.links.length}
- Erros: ${siteData.errors.length}

ESTRUTURA DE HEADINGS:
${siteData.headings.map(h => `${h.tag.toUpperCase()}: ${h.text}`).join('\n')}

IMAGENS SEM ALT TEXT:
${siteData.images.filter(img => img.alt === 'Sem alt text').length} de ${siteData.images.length}

Retorne um relatório dividido em 5 seções:

## 📋 Resumo Geral
- Introdução sobre a análise
- Nota geral (0-100) baseada em SEO, velocidade e UX
- Tom profissional e motivador

## ⚡ Desempenho Técnico
- Velocidade, responsividade, HTTPS, erros
- Impacto no ranqueamento Google
- Explicação simples

## 🎯 SEO On-page
- Título, meta description, palavras-chave, headings
- Otimização para buscadores
- Sugestões práticas

## 🎨 Design e Experiência do Usuário
- Clareza visual, hierarquia, CTAs
- Melhorias para conversão
- Confiança do visitante

## 🏆 Autoridade e Credibilidade Online
- Presença digital, domínio, aparência profissional
- Transmissão de autoridade

FINALIZE com chamada para ação suave sobre implementar melhorias.

Use linguagem natural, emojis sutis, bullets visuais. Seja específico e prático, não genérico.
`;

    // Tenta usar IA disponível
    const aiPriority = ['gemini', 'grok', 'openai'];
    
    for (const aiType of aiPriority) {
      if (this.aiModels[aiType]) {
        try {
          console.log(`🤖 Gerando análise com ${aiType.toUpperCase()}...`);
          
          if (aiType === 'gemini') {
            const result = await this.aiModels.gemini.generateContent(prompt);
            const response = await result.response;
            return response.text();
          } else {
            const response = await this.aiModels[aiType].call(prompt);
            return response;
          }
        } catch (error) {
          console.warn(`⚠️ Falha em ${aiType}:`, error.message);
          continue;
        }
      }
    }
    
    // Fallback se todas as IAs falharem
    return this.generateFallbackAnalysis(url, siteData);
  }

  // 📊 CALCULA SCORE GERAL
  calculateOverallScore(siteData) {
    let score = 100;
    
    // Penalidades por problemas
    if (!siteData.hasHttps) score -= 15;
    if (!siteData.responsive) score -= 20;
    if (siteData.loadTime > 3000) score -= 15;
    if (siteData.loadTime > 5000) score -= 10;
    if (!siteData.title || siteData.title === 'Sem título') score -= 10;
    if (!siteData.metaDescription || siteData.metaDescription === 'Sem meta description') score -= 10;
    if (siteData.headings.filter(h => h.tag === 'h1').length === 0) score -= 10;
    if (siteData.headings.filter(h => h.tag === 'h1').length > 1) score -= 5;
    if (siteData.images.filter(img => img.alt === 'Sem alt text').length > 0) score -= 5;
    if (siteData.errors.length > 0) score -= 10;
    
    return Math.max(score, 0);
  }

  // 🔄 ANÁLISE FALLBACK (SEM IA)
  generateFallbackAnalysis(url, siteData = null) {
    if (!siteData) {
      return `## 📋 Resumo Geral

Analisei o site **${url}** e identifiquei algumas oportunidades de melhoria importantes.

**Nota Geral: 60/100** ⚠️

Seu site tem potencial, mas precisa de otimizações para melhorar o desempenho nos buscadores e a experiência dos visitantes.

## ⚡ Desempenho Técnico

• **Acessibilidade:** Não foi possível acessar completamente o site
• **Recomendação:** Verificar se o site está online e acessível
• **Impacto:** Sites inacessíveis não são indexados pelo Google

## 🎯 SEO On-page

• **Análise limitada:** Não foi possível extrair dados completos
• **Sugestão:** Implementar título otimizado e meta description
• **Foco:** Usar palavras-chave relevantes para seu negócio

## 🎨 Design e Experiência do Usuário

• **Responsividade:** Verificar se funciona bem no celular
• **Velocidade:** Otimizar imagens e código para carregamento rápido
• **CTAs:** Incluir botões claros de ação

## 🏆 Autoridade e Credibilidade Online

• **Domínio:** Usar HTTPS para transmitir segurança
• **Conteúdo:** Manter informações atualizadas e relevantes
• **Contato:** Incluir formas claras de contato

---

💡 **Se quiser, posso te ajudar a implementar essas melhorias e deixar seu site 100% otimizado e moderno.**`;
    }

    const score = this.calculateOverallScore(siteData);
    let scoreEmoji = '🔥';
    if (score < 70) scoreEmoji = '⚠️';
    if (score < 50) scoreEmoji = '🚨';

    return `## 📋 Resumo Geral

Analisei completamente o site **${url}** e preparei um diagnóstico detalhado para você.

**Nota Geral: ${score}/100** ${scoreEmoji}

${score >= 80 ? 'Parabéns! Seu site está bem otimizado, mas sempre há espaço para melhorias.' : 
  score >= 60 ? 'Seu site tem uma base sólida, mas precisa de algumas otimizações importantes.' :
  'Seu site precisa de melhorias urgentes para competir no mercado digital.'}

## ⚡ Desempenho Técnico

• **Velocidade:** ${siteData.loadTime}ms ${siteData.loadTime < 2000 ? '✅' : siteData.loadTime < 4000 ? '⚠️' : '🚨'}
• **HTTPS:** ${siteData.hasHttps ? '✅ Seguro' : '🚨 Não seguro - Urgente!'}
• **Responsivo:** ${siteData.responsive ? '✅ Mobile-friendly' : '🚨 Não otimizado para celular'}
• **Impacto:** ${!siteData.hasHttps || !siteData.responsive ? 'Google penaliza sites sem HTTPS e não responsivos' : 'Boa base técnica para SEO'}

## 🎯 SEO On-page

• **Título:** ${siteData.title !== 'Sem título' ? '✅ Presente' : '🚨 Ausente'} - "${siteData.title}"
• **Meta Description:** ${siteData.metaDescription !== 'Sem meta description' ? '✅ Presente' : '🚨 Ausente'}
• **Estrutura H1:** ${siteData.headings.filter(h => h.tag === 'h1').length === 1 ? '✅ Correta' : '⚠️ Precisa ajustar'}
• **Headings:** ${siteData.headings.length} encontrados
• **Otimização:** ${siteData.title !== 'Sem título' && siteData.metaDescription !== 'Sem meta description' ? 'Base boa, refinar palavras-chave' : 'Implementar SEO básico urgente'}

## 🎨 Design e Experiência do Usuário

• **Imagens:** ${siteData.images.length} encontradas
• **Alt Text:** ${siteData.images.filter(img => img.alt !== 'Sem alt text').length}/${siteData.images.length} otimizadas
• **Links Internos:** ${siteData.links.length} identificados
• **Acessibilidade:** ${siteData.images.filter(img => img.alt === 'Sem alt text').length === 0 ? '✅ Boa' : '⚠️ Melhorar alt text das imagens'}

## 🏆 Autoridade e Credibilidade Online

• **Domínio:** ${siteData.hasHttps ? '✅ Seguro e confiável' : '🚨 Sem certificado SSL'}
• **Estrutura:** ${siteData.headings.length > 3 ? '✅ Bem organizada' : '⚠️ Melhorar hierarquia'}
• **Profissionalismo:** ${score >= 70 ? 'Transmite confiança' : 'Precisa melhorar aparência profissional'}

---

💡 **Se quiser, posso te ajudar a implementar essas melhorias e deixar seu site 100% otimizado e moderno. Com as correções certas, seu site pode subir significativamente no Google!**`;
  }
}