/**
 * SISTEMA DE NOTIFICAÇÕES PARA LEADS QUENTES
 *
 * Detecta leads com alto potencial (score 3-4) e notifica via:
 * - Console log estruturado
 * - Email (se configurado)
 * - Webhook (se configurado)
 * - WhatsApp Business API (se configurado)
 */

/**
 * Verifica se lead é quente e deve gerar notificação
 */
export function isHotLead(leadScore, extractedData = {}) {
  // Lead score 3-4 = QUENTE 🔥
  if (leadScore >= 3) {
    return true;
  }

  // Também considera quente se tem BANT quase completo
  const hasBudget = extractedData.orcamento != null;
  const hasAuthority = extractedData.nome && extractedData.email;
  const hasNeed = extractedData.tipo_projeto != null;
  const hasTimeline = extractedData.prazo != null;

  const bantScore = [hasBudget, hasAuthority, hasNeed, hasTimeline].filter(Boolean).length;

  return bantScore >= 3;
}

/**
 * Envia notificação de lead quente
 */
export async function notifyHotLead(leadData, conversationData) {
  const {
    nome = 'Lead',
    email = 'Não fornecido',
    telefone = 'Não fornecido',
    tipo_projeto = 'Não especificado',
    orcamento = 'Não especificado',
    prazo = 'Não especificado',
    negocio = 'Não especificado'
  } = leadData.extractedData || {};

  const leadScore = leadData.leadScore || 0;
  const userMessage = conversationData.userMessage || '';

  // 1. LOG ESTRUTURADO (sempre ativo)
  console.log('\n' + '═'.repeat(80));
  console.log('🔥🔥🔥 ALERTA: LEAD QUENTE DETECTADO! 🔥🔥🔥');
  console.log('═'.repeat(80));
  console.log(`📊 Lead Score: ${leadScore}/4 ${getScoreEmoji(leadScore)}`);
  console.log(`👤 Nome: ${nome}`);
  console.log(`📧 Email: ${email}`);
  console.log(`📱 Telefone: ${telefone}`);
  console.log(`🎯 Projeto: ${tipo_projeto}`);
  console.log(`💰 Orçamento: ${orcamento}`);
  console.log(`⏰ Prazo: ${prazo}`);
  console.log(`🏢 Negócio: ${negocio}`);
  console.log(`💬 Última mensagem: "${userMessage.substring(0, 100)}..."`);
  console.log(`🕐 Timestamp: ${new Date().toISOString()}`);
  console.log('═'.repeat(80));
  console.log('⚡ AÇÃO REQUERIDA: Entre em contato IMEDIATAMENTE!');
  console.log('═'.repeat(80) + '\n');

  // 2. EMAIL (se configurado)
  if (process.env.NOTIFICATION_EMAIL) {
    await sendEmailNotification({
      to: process.env.NOTIFICATION_EMAIL,
      subject: `🔥 LEAD QUENTE: ${nome} (Score ${leadScore}/4)`,
      leadData: { nome, email, telefone, tipo_projeto, orcamento, prazo, negocio },
      userMessage
    });
  }

  // 3. WEBHOOK (se configurado - ex: Zapier, Make, n8n)
  if (process.env.NOTIFICATION_WEBHOOK_URL) {
    await sendWebhookNotification({
      webhookUrl: process.env.NOTIFICATION_WEBHOOK_URL,
      leadData: { nome, email, telefone, tipo_projeto, orcamento, prazo, negocio, leadScore },
      userMessage,
      timestamp: new Date().toISOString()
    });
  }

  // 4. WHATSAPP BUSINESS API (se configurado)
  if (process.env.WHATSAPP_BUSINESS_NUMBER && process.env.WHATSAPP_API_TOKEN) {
    await sendWhatsAppNotification({
      to: process.env.WHATSAPP_BUSINESS_NUMBER,
      message: `🔥 LEAD QUENTE!\n\n👤 ${nome}\n📧 ${email}\n📱 ${telefone}\n🎯 ${tipo_projeto}\n💰 ${orcamento}\n\n💬 "${userMessage.substring(0, 150)}..."\n\n⚡ RESPONDA AGORA!`
    });
  }

  // 5. SALVA NO ARQUIVO PARA AUDITORIA (opcional mas recomendado)
  if (process.env.SAVE_HOT_LEADS === 'true') {
    await saveHotLeadToFile({
      nome,
      email,
      telefone,
      tipo_projeto,
      orcamento,
      prazo,
      negocio,
      leadScore,
      userMessage,
      timestamp: new Date().toISOString()
    });
  }

  return {
    notified: true,
    methods: getEnabledNotificationMethods()
  };
}

/**
 * Envia email via serviço configurado
 */
async function sendEmailNotification({ to, subject, leadData, userMessage }) {
  try {
    // Implementação depende do serviço de email (SendGrid, Resend, etc)
    // Exemplo usando fetch para API de email

    if (!process.env.EMAIL_API_KEY) {
      console.warn('⚠️ EMAIL_API_KEY não configurado. Notificação por email desabilitada.');
      return;
    }

    const emailBody = `
      LEAD QUENTE DETECTADO!

      Nome: ${leadData.nome}
      Email: ${leadData.email}
      Telefone: ${leadData.telefone}
      Projeto: ${leadData.tipo_projeto}
      Orçamento: ${leadData.orcamento}
      Prazo: ${leadData.prazo}
      Negócio: ${leadData.negocio}

      Última mensagem:
      "${userMessage}"

      AÇÃO REQUERIDA: Entre em contato imediatamente!

      ---
      Ronald Digital - Sistema de Notificações
      ${new Date().toLocaleString('pt-BR')}
    `;

    // Exemplo genérico - adaptar para seu serviço de email
    const response = await fetch(process.env.EMAIL_API_ENDPOINT || 'https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.EMAIL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'contato@ronaldigital.tech',
        to: [to],
        subject: subject,
        text: emailBody
      })
    });

    if (response.ok) {
      console.log('✅ Email de notificação enviado com sucesso');
    } else {
      console.error('❌ Erro ao enviar email:', await response.text());
    }
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error.message);
  }
}

/**
 * Envia notificação via webhook
 */
async function sendWebhookNotification({ webhookUrl, leadData, userMessage, timestamp }) {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'hot_lead_detected',
        lead: leadData,
        message: userMessage,
        timestamp: timestamp,
        source: 'Sara AI - Ronald Digital'
      })
    });

    if (response.ok) {
      console.log('✅ Webhook notificado com sucesso');
    } else {
      console.error('❌ Erro ao enviar webhook:', await response.text());
    }
  } catch (error) {
    console.error('❌ Erro ao enviar webhook:', error.message);
  }
}

/**
 * Envia notificação via WhatsApp Business API
 */
async function sendWhatsAppNotification({ to, message }) {
  try {
    // Exemplo usando API do WhatsApp Business (requer configuração)
    // Adapte conforme seu provedor (Twilio, MessageBird, etc)

    if (!process.env.WHATSAPP_API_TOKEN) {
      console.warn('⚠️ WHATSAPP_API_TOKEN não configurado. Notificação por WhatsApp desabilitada.');
      return;
    }

    const response = await fetch(process.env.WHATSAPP_API_ENDPOINT || 'https://api.whatsapp.com/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: to,
        body: message
      })
    });

    if (response.ok) {
      console.log('✅ WhatsApp notificado com sucesso');
    } else {
      console.error('❌ Erro ao enviar WhatsApp:', await response.text());
    }
  } catch (error) {
    console.error('❌ Erro ao enviar WhatsApp:', error.message);
  }
}

/**
 * Salva lead quente em arquivo para auditoria
 */
async function saveHotLeadToFile(leadData) {
  try {
    const fs = await import('fs');
    const path = await import('path');

    const logsDir = path.join(process.cwd(), 'logs');
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const logFile = path.join(logsDir, `hot-leads-${today}.json`);

    // Cria diretório se não existe
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    // Carrega leads existentes ou cria novo array
    let leads = [];
    if (fs.existsSync(logFile)) {
      const content = fs.readFileSync(logFile, 'utf8');
      leads = JSON.parse(content);
    }

    // Adiciona novo lead
    leads.push(leadData);

    // Salva
    fs.writeFileSync(logFile, JSON.stringify(leads, null, 2));

    console.log(`✅ Lead salvo em: ${logFile}`);
  } catch (error) {
    console.error('❌ Erro ao salvar lead em arquivo:', error.message);
  }
}

/**
 * Retorna emoji baseado no lead score
 */
function getScoreEmoji(score) {
  if (score >= 4) return '🔥🔥🔥 MUITO QUENTE';
  if (score >= 3) return '🔥🔥 QUENTE';
  if (score >= 2) return '🌡️ MORNO';
  return '❄️ FRIO';
}

/**
 * Retorna métodos de notificação habilitados
 */
function getEnabledNotificationMethods() {
  const methods = ['console'];

  if (process.env.NOTIFICATION_EMAIL && process.env.EMAIL_API_KEY) {
    methods.push('email');
  }

  if (process.env.NOTIFICATION_WEBHOOK_URL) {
    methods.push('webhook');
  }

  if (process.env.WHATSAPP_BUSINESS_NUMBER && process.env.WHATSAPP_API_TOKEN) {
    methods.push('whatsapp');
  }

  if (process.env.SAVE_HOT_LEADS === 'true') {
    methods.push('file_log');
  }

  return methods;
}

/**
 * Verifica configuração de notificações
 */
export function checkNotificationConfig() {
  const config = {
    console: true, // Sempre ativo
    email: !!(process.env.NOTIFICATION_EMAIL && process.env.EMAIL_API_KEY),
    webhook: !!process.env.NOTIFICATION_WEBHOOK_URL,
    whatsapp: !!(process.env.WHATSAPP_BUSINESS_NUMBER && process.env.WHATSAPP_API_TOKEN),
    file_log: process.env.SAVE_HOT_LEADS === 'true'
  };

  const activeCount = Object.values(config).filter(Boolean).length;

  console.log('\n📢 CONFIGURAÇÃO DE NOTIFICAÇÕES:');
  console.log(`✅ Console Log: Ativo (sempre)`);
  console.log(`${config.email ? '✅' : '❌'} Email: ${config.email ? 'Ativo' : 'Desabilitado (configure NOTIFICATION_EMAIL + EMAIL_API_KEY)'}`);
  console.log(`${config.webhook ? '✅' : '❌'} Webhook: ${config.webhook ? 'Ativo' : 'Desabilitado (configure NOTIFICATION_WEBHOOK_URL)'}`);
  console.log(`${config.whatsapp ? '✅' : '❌'} WhatsApp: ${config.whatsapp ? 'Ativo' : 'Desabilitado (configure WHATSAPP_BUSINESS_NUMBER + WHATSAPP_API_TOKEN)'}`);
  console.log(`${config.file_log ? '✅' : '❌'} File Log: ${config.file_log ? 'Ativo' : 'Desabilitado (configure SAVE_HOT_LEADS=true)'}`);
  console.log(`\n📊 Total de métodos ativos: ${activeCount}/5\n`);

  return config;
}
