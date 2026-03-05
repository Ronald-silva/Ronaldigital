/**
 * SERVIDOR DE PRODUÇÃO — Railway
 *
 * Servidor Express persistente para a Sara AI.
 * Sem cold start, sem timeout de 10s, sempre disponível.
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS — permite apenas o frontend em produção
const allowedOrigins = [
  'https://www.ronaldigital.tech',
  'https://ronaldigital.tech',
  process.env.ALLOWED_ORIGIN,
  // desenvolvimento local
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Permite requests sem origin (ex: curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS bloqueado: ${origin}`));
  },
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '1mb' }));

// ── Importa handler da Sara ──────────────────────────────────────────────────
import('./api/agente.js').then(module => {
  const handler = module.default;

  // Rota principal da Sara AI
  app.post('/api/agente', async (req, res) => {
    try {
      await handler(req, res);
    } catch (error) {
      console.error('❌ Erro no handler da Sara:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Health check — Railway usa para verificar se o serviço está vivo
  app.get('/health', (req, res) => {
    const claudeKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      sara_v2: process.env.SARA_V2 === 'true',
      claude: !!claudeKey,
      gemini: !!(process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY),
    });
  });

  // Rota raiz — evita 404 em pings do Railway
  app.get('/', (req, res) => {
    res.json({ service: 'Sara AI — RonalDigital', status: 'online' });
  });

  // Inicia servidor
  app.listen(PORT, () => {
    const claudeKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🚀 Sara AI — Servidor Railway iniciado`);
    console.log(`${'='.repeat(60)}`);
    console.log(`📍 Porta: ${PORT}`);
    console.log(`🤖 Sara: ${process.env.SARA_V2 === 'true' ? 'v2.0 ✅' : 'v1.0 (ativar SARA_V2=true)'}`);
    console.log(`🔑 Claude: ${claudeKey ? 'Configurado ✅' : 'NÃO configurado ❌'}`);
    console.log(`🔑 Gemini: ${process.env.GEMINI_API_KEY ? 'Configurado ✅' : 'NÃO configurado'}`);
    console.log(`${'='.repeat(60)}\n`);
  });

}).catch(error => {
  console.error('❌ Erro crítico ao carregar Sara AI:', error);
  process.exit(1);
});
