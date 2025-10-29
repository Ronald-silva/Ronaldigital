import { SEOAnalyzer } from "../lib/seo/seoAnalyzer.js";
import cors from "cors";

// Configuração CORS
const corsOptions = {
  origin: process.env.VERCEL_URL || "*",
  methods: ["POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

// Middleware CORS
function runCors(req, res) {
  return new Promise((resolve, reject) => {
    cors(corsOptions)(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  // Aplica CORS
  await runCors(req, res);

  // Só aceita POST
  if (req.method !== "POST") {
    return res.status(405).json({ 
      error: "Método não permitido",
      message: "Use POST para analisar um site" 
    });
  }

  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({
        error: "URL obrigatória",
        message: "Forneça a URL do site para análise"
      });
    }

    // Valida URL básica
    try {
      new URL(url);
    } catch (error) {
      return res.status(400).json({
        error: "URL inválida",
        message: "Forneça uma URL válida (ex: https://exemplo.com)"
      });
    }

    console.log(`🔍 Iniciando análise SEO de: ${url}`);

    // Inicializa o analisador SEO
    const analyzer = new SEOAnalyzer();
    
    // Executa análise completa
    const result = await analyzer.analyzeSite(url);

    console.log(`✅ Análise concluída para: ${url}`);

    if (result.success) {
      return res.status(200).json({
        success: true,
        url: result.url,
        score: result.overallScore,
        analysis: result.analysis,
        technicalData: {
          loadTime: result.technicalData.loadTime,
          hasHttps: result.technicalData.hasHttps,
          responsive: result.technicalData.responsive,
          title: result.technicalData.title,
          metaDescription: result.technicalData.metaDescription,
          headingsCount: result.technicalData.headings.length,
          imagesCount: result.technicalData.images.length,
          linksCount: result.technicalData.links.length,
          errorsCount: result.technicalData.errors.length
        },
        timestamp: result.timestamp
      });
    } else {
      return res.status(200).json({
        success: false,
        url: url,
        error: result.error,
        analysis: result.fallbackAnalysis,
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error("❌ Erro na API de análise SEO:", error);
    
    return res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
      message: "Não foi possível analisar o site no momento. Tente novamente em alguns minutos.",
      details: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
}