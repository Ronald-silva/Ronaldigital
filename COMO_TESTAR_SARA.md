# 🤖 Como Testar a Sara AI

## ✅ Configuração Atual

### APIs Configuradas
- ✅ **Claude 3.5 Sonnet (Anthropic)** - Prioridade 1
- ✅ **Gemini 2.0 Flash (Google)** - Prioridade 2
- ✅ **Grok (xAI)** - Fallback

### Ordem de Prioridade
1. **Claude 3.5 Sonnet** - Melhor para conversação natural e humanização
2. **Gemini 2.0 Flash** - Rápido e eficiente
3. **Grok** - Fallback final

---

## 🚀 Como Testar

### 1. Iniciar o Servidor
```bash
npm run dev
```

### 2. Acessar a Sara
Abra o navegador em: **http://localhost:5174/sara-ai**

### 3. Casos de Teste

#### ✅ **Teste 1: Pergunta sobre Localização**
**Usuário:** "Qual o endereço da RonalDigital?"

**Resposta Esperada:**
- Deve fornecer: Localização (Fortaleza, CE), WhatsApp, Email, Horário
- Mencionar atendimento 100% remoto

---

#### ✅ **Teste 2: Contexto de Conversa**
**Usuário:** "Preciso de um site para consultório de dentistas"
**Usuário:** "Qual o prazo?"

**Resposta Esperada:**
- NÃO deve perguntar "para que tipo de negócio?"
- Deve responder sobre prazos para sites (7-14 dias)
- Deve mencionar dentistas no contexto

---

#### ✅ **Teste 3: Agentes de IA**
**Usuário:** "Quanto custa um agente de IA para WhatsApp?"

**Resposta Esperada:**
- Deve mencionar o serviço de "Agentes de IA & Chatbots"
- Explicar benefícios (24/7, qualificação automática, etc.)
- Dizer que é sob consulta e pedir mais detalhes

---

#### ✅ **Teste 4: Lead Quente**
**Usuário:** "Preciso de um site e-commerce para minha loja de roupas. Tenho R$ 2.500 e preciso para 1 mês."

**Resposta Esperada:**
- Deve classificar como LEAD QUENTE (Budget + Need + Timeline)
- Deve ser mais direta e propor próximos passos
- Pode sugerir WhatsApp para agilizar

---

## 🔍 Como Verificar se Está Funcionando

### No Console do Navegador (F12):
Você deve ver:
```
🤖 Usando Claude 3.5 Sonnet (Anthropic)
```

Se aparecer erro, verá qual API está sendo usada ou se caiu no fallback.

---

## 🐛 Problemas Comuns

### Problema: Sara não responde
**Solução:**
1. Verifique se o servidor está rodando (`npm run dev`)
2. Abra o Console (F12) e veja os erros
3. Verifique se as variáveis de ambiente estão corretas no `.env`

### Problema: Respostas genéricas/repetitivas
**Solução:**
1. Verifique se está usando Claude (veja console)
2. Se estiver usando fallback, a Sara usará respostas programadas
3. Reinicie o servidor para recarregar as variáveis de ambiente

### Problema: "Erro ao conectar com API"
**Solução:**
1. Verifique sua chave API no `.env`
2. Teste a chave diretamente no site da Anthropic
3. Verifique se não atingiu o limite de uso

---

## 📊 Métricas de Qualidade

Uma Sara funcionando perfeitamente deve:
- ✅ Responder em menos de 3 segundos
- ✅ Usar emojis moderadamente (1-2 por mensagem)
- ✅ Lembrar do contexto da conversa
- ✅ NÃO repetir perguntas já respondidas
- ✅ Fornecer informações de contato quando solicitado
- ✅ Ser empática e natural (não robótica)

---

## 🎯 Exemplo de Conversa Perfeita

```
Usuário: Oi
Sara: Oi! Que bom te ver por aqui! 😊
      Sou a Sara da RonalDigital. Como posso te ajudar hoje?

Usuário: Preciso de um site para meu restaurante
Sara: Que legal! Um site para restaurante é essencial hoje! 🍽️

      Para criar a proposta perfeita, me conta:
      • Você já tem cardápio digital?
      • Precisa sistema de pedidos online?
      • Qual seu orçamento pensado?

Usuário: Sim, preciso de pedidos online. Tenho R$ 2.000
Sara: Perfeito! Com R$ 2.000 conseguimos criar um site completo
      com sistema de pedidos integrado! 🚀

      Prazo: 10-14 dias
      Inclui: Design responsivo, cardápio digital, pedidos online,
      integração WhatsApp

      Posso te chamar no WhatsApp (85) 99157-5525 para
      alinhar os detalhes?
```

---

## 💡 Dicas para Melhorar Ainda Mais

1. **Treine a Sara** testando diferentes cenários
2. **Documente** respostas problemáticas para ajustar prompts
3. **Compare** com conversas reais de clientes
4. **Ajuste** tom e estilo conforme feedback dos usuários

---

**🎉 Sara está pronta para ser a melhor vendedora digital da RonalDigital!**
