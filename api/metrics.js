/**
 * API ENDPOINT: Métricas Públicas da Sara
 *
 * Endpoint para exibir performance da Sara em dashboards ou apresentações.
 * Dados anonimizados para proteção de privacidade dos leads.
 */

import { getAnalyticsTracker } from "../lib/utils/analytics-tracker.js";
import cors from "cors";

// Configuração CORS
const corsOptions = {
  origin: process.env.VERCEL_URL || "*",
  methods: ["GET", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
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
  await runCors(req, res);

  // Só aceita GET
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Método não permitido",
      message: "Use GET para acessar métricas"
    });
  }

  try {
    const analytics = getAnalyticsTracker();

    // Parâmetro de query para tipo de dado
    const { type } = req.query;

    switch (type) {
      case 'dashboard':
        // Dashboard completo
        const dashboardData = analytics.getDashboardData();
        return res.status(200).json({
          success: true,
          data: dashboardData,
          generatedAt: new Date().toISOString()
        });

      case 'report':
        // Relatório de performance
        const report = analytics.generatePerformanceReport();
        return res.status(200).json({
          success: true,
          data: report,
          generatedAt: new Date().toISOString()
        });

      case 'stats':
        // Estatísticas globais
        const stats = analytics.getStats();
        return res.status(200).json({
          success: true,
          data: {
            totalSessions: stats.totalSessions,
            totalMessages: stats.totalMessages,
            avgLeadScore: stats.avgLeadScore.toFixed(2),
            conversionRate: stats.conversionRate.toFixed(1) + '%',
            leadsByQuality: stats.leadsByQuality,
            outcomes: stats.outcomes,
            lastUpdated: stats.lastUpdated
          },
          generatedAt: new Date().toISOString()
        });

      case 'roi':
        // Cálculo de ROI
        const dashboard = analytics.getDashboardData();
        return res.status(200).json({
          success: true,
          data: {
            roi: dashboard.roi,
            performance: dashboard.performance,
            overview: dashboard.overview
          },
          generatedAt: new Date().toISOString()
        });

      default:
        // Visão geral (default)
        const overview = analytics.getDashboardData().overview;
        return res.status(200).json({
          success: true,
          data: overview,
          generatedAt: new Date().toISOString(),
          availableTypes: ['dashboard', 'report', 'stats', 'roi']
        });
    }

  } catch (error) {
    console.error("Erro ao buscar métricas:", error);

    return res.status(500).json({
      success: false,
      error: "Erro ao buscar métricas",
      message: error.message
    });
  }
}

// Configuração para Vercel
export const config = {
  api: {
    bodyParser: false
  }
};
