# 🚀 Guia de Configuração - EmailJS + WhatsApp

## 📧 Configuração do EmailJS

### 1. Criar conta no EmailJS
1. Acesse: https://www.emailjs.com/
2. Clique em "Sign Up" e crie sua conta
3. Confirme seu email

### 2. Configurar Serviço de Email
1. No dashboard, clique em "Email Services"
2. Clique em "Add New Service"
3. Escolha seu provedor (Gmail recomendado)
4. Configure com seu email: `contato@ronaldigital.tech`
5. **Anote o Service ID** (ex: `service_abc123`)

### 3. Criar Template de Email
1. Clique em "Email Templates"
2. Clique em "Create New Template"
3. **Template ID**: Anote o ID gerado (ex: `template_xyz789`)
4. **Assunto**: `Novo Orçamento - {{nome_negocio}}`
5. **Conteúdo do Email**:

```
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
```

6. Clique em "Save"

### 4. Obter Public Key
1. Vá em "Account" → "General"
2. **Anote sua Public Key** (ex: `user_abc123xyz`)

### 5. Configurar no Projeto
Edite o arquivo `src/config/emailjs.ts`:

```typescript
export const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_smnjyth', // Seu Service ID
  TEMPLATE_ID: 'template_ugsfr4a', // Seu Template ID
  PUBLIC_KEY: 'sv-MDlteolEbEu00p', // Sua Public Key
  TO_EMAIL: 'contato@ronaldigital.tech',
  WHATSAPP_NUMBER: '5585991575525', // SEU NÚMERO AQUI
};
```

## 📱 Configuração do WhatsApp

### Formato do Número
- **Código do país**: 55 (Brasil)
- **DDD**: 85 (Fortaleza)
- **Número**: 991575525
- **Resultado**: `5585991575525`

### Como funciona
- Quando um orçamento é enviado, abre automaticamente o WhatsApp
- A mensagem já vem formatada com todos os dados
- Você só precisa enviar para si mesmo

## ✅ Teste da Configuração

1. Após configurar, acesse: `/orcamento`
2. Preencha um orçamento de teste
3. Verifique se:
   - ✅ Email chegou na sua caixa de entrada
   - ✅ WhatsApp abriu com a mensagem formatada

## 🔧 Solução de Problemas

### Email não chega
- Verifique spam/lixo eletrônico
- Confirme Service ID, Template ID e Public Key
- Teste o template no dashboard do EmailJS

### WhatsApp não abre
- Verifique se o número está correto
- Teste o formato: `5585991575525`
- Certifique-se que o WhatsApp Web está funcionando

### Erro de CORS
- Adicione seu domínio nas configurações do EmailJS
- Para desenvolvimento local: `http://localhost:5173`

## 🎯 Próximos Passos

Após configurar:
1. Teste com um orçamento real
2. Configure filtros no seu email para organizar
3. Considere criar respostas automáticas
4. Monitore a taxa de conversão de orçamentos

## 📞 Suporte

Se tiver problemas:
1. Verifique o console do navegador (F12)
2. Teste as configurações no dashboard do EmailJS
3. Confirme se todos os IDs estão corretos