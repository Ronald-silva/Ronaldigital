# 🐛 Debug da Sara AI - Guia Rápido

## ⚡ AÇÃO IMEDIATA

### 1. Reiniciar Servidor
```bash
# Pare o servidor atual (Ctrl + C)
# Reinicie para carregar novas variáveis
npm run dev
```

### 2. Abrir Console do Navegador
1. Pressione **F12**
2. Vá na aba **Console**
3. Limpe o console (ícone 🚫)

### 3. Testar Sara
1. Acesse: **http://localhost:5174/sara-ai**
2. Digite uma mensagem (ex: "preciso de um site")
3. **OBSERVE OS LOGS NO CONSOLE**

---

## 📊 Logs Esperados

### ✅ **FUNCIONANDO (Claude ativo):**
```
🤖 Usando Claude 3.5 Sonnet (Anthropic)
🚀 processarComAgente iniciado
📝 Mensagem: preciso de um site
🎯 Tentando provedor direto: anthropic
🔑 API Key presente: sk-ant-api...
🔵 Chamando Claude 3.5 Sonnet...
✅ Claude respondeu com sucesso!
✅ IA respondeu com sucesso!
```

### ❌ **ERRO (Caindo no fallback):**
```
🤖 Usando Claude 3.5 Sonnet (Anthropic)
🚀 processarComAgente iniciado
❌ Anthropic API Error: 401 - Invalid API Key
❌ Erro no provedor direto (anthropic):
🔄 Tentando backend como plano B...
⚠️ AI Service retornou erro
🔄 FALLBACK ATIVO para: "preciso de um site"
```

---

## 🔍 Diagnóstico por Erro

### Erro: `401 - Invalid API Key`
**Problema:** Chave da Anthropic inválida ou expirada

**Solução:**
1. Verifique a chave em `.env`:
   ```bash
   cat .env | grep ANTHROPIC
   ```
2. Teste a chave no site da Anthropic
3. Gere nova chave se necessário

---

### Erro: `CORS blocked`
**Problema:** Anthropic bloqueia chamadas diretas do navegador

**Solução:** Usar backend (Vercel Functions)
- Em produção isso funciona automaticamente
- Em desenvolvimento, use outra API (Gemini/Grok)

---

### Erro: `⚠️ Nenhuma configuração de API encontrada`
**Problema:** Variáveis de ambiente não carregadas

**Solução:**
1. Verifique se `.env` existe
2. Reinicie o servidor Vite
3. Verifique se tem o prefixo `VITE_`

---

## 🚀 Solução Temporária (Gemini)

Se Claude não funcionar por CORS, use Gemini:

### 1. Editar `.env`
```bash
# Comente o Anthropic temporariamente
# VITE_ANTHROPIC_API_KEY=sk-ant-...

# Use Gemini (já configurado)
VITE_GEMINI_API_KEY=AIzaSyCFsXzf87xhDBuUo-SUmjGWnV9hzYQNx2U
```

### 2. Implementar Gemini no Frontend

Adicione essa função em `aiAgent.ts`:

```typescript
async function callGeminiDirect(apiKey: string, model: string, data: AgentRequest) {
  console.log('🔵 Chamando Gemini...');
  const prompt = createPrompt(data);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `${prompt}\n\nMensagem do cliente: ${data.mensagem}` }]
        }]
      })
    }
  );

  const result = await response.json();
  return result.candidates[0].content.parts[0].text;
}
```

E use no `processarComAgente`:
```typescript
} else if (config.provider === 'gemini') {
  response = await callGeminiDirect(config.apiKey, config.model, data);
}
```

---

## 📱 Teste Rápido

Cole isso no console do navegador:
```javascript
// Teste se variáveis estão carregadas
console.log('ANTHROPIC:', import.meta.env.VITE_ANTHROPIC_API_KEY?.substring(0, 10));
console.log('GEMINI:', import.meta.env.VITE_GEMINI_API_KEY?.substring(0, 10));
console.log('GROK:', import.meta.env.VITE_GROK_API_KEY?.substring(0, 10));
```

---

## 💡 Próximos Passos

1. **Reinicie o servidor**
2. **Teste e me envie os logs do console**
3. **Baseado nos logs, vou corrigir o problema específico**

---

**🎯 Objetivo:** Fazer a Sara usar Claude (ou Gemini) ao invés do fallback programado.
