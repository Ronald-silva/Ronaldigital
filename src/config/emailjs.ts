// Configurações do EmailJS
// IMPORTANTE: Substitua essas configurações pelas suas próprias

export const EMAILJS_CONFIG = {
  // Suas credenciais do EmailJS (obtenha em https://www.emailjs.com/)
  SERVICE_ID: "service_smnjyth", // ⚠️ SUBSTITUA pelo seu Service ID
  TEMPLATE_ID: "template_ugsfr4a", // ✅ Template ID que vimos na sua tela
  PUBLIC_KEY: "sv-MDlteolEbEu00p", // ⚠️ SUBSTITUA pela sua Public Key

  // Seu email para receber os orçamentos
  TO_EMAIL: "contato@ronaldigital.tech",

  // Seu número do WhatsApp (com código do país, sem + ou espaços)
  WHATSAPP_NUMBER: "5585991575525", // ✅ Número atualizado
};

// Template de email recomendado para o EmailJS:
export const EMAIL_TEMPLATE_GUIDE = `
Para configurar o template no EmailJS, use essas variáveis:

Assunto: Novo Orçamento - {{nome_negocio}}

Corpo do email:
---
🚨 NOVO ORÇAMENTO RECEBIDO!

👤 DADOS DO CLIENTE:
Nome: {{cliente_nome}}
Email: {{cliente_email}}
Telefone: {{cliente_telefone}}

🏢 DADOS DO PROJETO:
Negócio: {{nome_negocio}}
Tipo: {{tipo_negocio}}
Objetivo: {{objetivo_principal}}

💰 ORÇAMENTO E PRAZO:
Orçamento Estimado: {{orcamento_estimado}}
Prazo Desejado: {{prazo_desejado}}

🎯 FUNCIONALIDADES:
{{funcionalidades}}

🎨 DESIGN:
Estilo Preferido: {{estilo_preferido}}
Inspirações: {{inspiracoes}}

💬 MENSAGEM ADICIONAL:
{{mensagem_adicional}}

📅 Data da Solicitação: {{data_solicitacao}}
---
`;
