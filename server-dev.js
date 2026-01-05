/**
 * SERVIDOR DE DESENVOLVIMENTO
 *
 * Servidor Express para rodar as APIs do projeto localmente.
 * Em produção (Vercel), as rotas /api/* são servidas automaticamente.
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Carrega variáveis de ambiente
dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Importa dinamicamente o handler da API
import('./api/agente.js').then(module => {
  const handler = module.default;

  // Rota da API
  app.post('/api/agente', async (req, res) => {
    try {
      await handler(req, res);
    } catch (error) {
      console.error('Erro no handler:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      sara_v2: process.env.SARA_V2 === 'true',
      anthropic_configured: !!process.env.ANTHROPIC_API_KEY
    });
  });

  // Inicia servidor
  app.listen(PORT, () => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🚀 Servidor de desenvolvimento rodando!`);
    console.log(`${'='.repeat(60)}`);
    console.log(`📍 Backend API: http://localhost:${PORT}/api/agente`);
    console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`${'='.repeat(60)}`);
    console.log(`🤖 Sara AI: ${process.env.SARA_V2 === 'true' ? 'v2.0 (Moderna) ✅' : 'v1.0 (Legada)'}`);
    console.log(`🔑 Claude API: ${process.env.ANTHROPIC_API_KEY ? 'Configurada ✅' : 'NÃO configurada ❌'}`);
    console.log(`${'='.repeat(60)}\n`);
  });
}).catch(error => {
  console.error('❌ Erro ao carregar API:', error);
  process.exit(1);
});
