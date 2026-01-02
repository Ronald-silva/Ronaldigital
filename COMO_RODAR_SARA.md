# 🚀 Como Rodar Sara AI com Claude 3.5 Sonnet

## ⚠️ PROBLEMA IDENTIFICADO

Você estava rodando apenas o **frontend** com `npm run dev`, mas o **backend** (que tem Claude) não estava funcionando.

---

## ✅ SOLUÇÃO: Rodar Frontend + Backend Juntos

### **Comando Correto:**

```bash
npm run dev:full
```

Este comando usa `vercel dev` que roda:
- ✅ Frontend (Vite) em `http://localhost:3000`
- ✅ Backend (API Functions) em `/api/agente`
- ✅ Claude 3.5 Sonnet via LangChain

---

## 📝 Passo a Passo

### **1. Pare o servidor atual**
Pressione `Ctrl + C` no terminal

### **2. Rode o comando completo:**
```bash
npm run dev:full
```

### **3. Aguarde a inicialização**
Você verá:
```
Vercel CLI 44.7.3
> Ready! Available at http://localhost:3000
✅ Anthropic (Claude 3.5) inicializada - MODO ULTRA INTELIGENTE ATIVO
```

### **4. Acesse Sara:**
Abra: **http://localhost:3000/sara-ai**

(Note que agora é porta **3000**, não 5173)

---

## 🧪 Testar

1. Abra o **Console (F12)**
2. Digite: **"preciso de um site para petshop"**
3. Observe os logs:

### ✅ **Logs Esperados (FUNCIONANDO):**

```
🚀 processarComAgente iniciado
📝 Mensagem: preciso de um site para petshop
🎯 Tentando backend (Claude 3.5 via LangChain)...
✅ Backend respondeu com sucesso!
```

**No terminal do servidor:**
```
✅ Anthropic (Claude 3.5) inicializada - MODO ULTRA INTELIGENTE ATIVO
POST /api/agente 200 1234ms
```

---

## 🔄 Alternativa: Se Vercel Dev não Funcionar

Se `npm run dev:full` der erro, use **Gemini** (já está configurado):

### **1. Descomente a chave no `.env`:**
```bash
# Linha 7 do .env - está assim:
VITE_GEMINI_API_KEY=AIzaSyCFsXzf87xhDBuUo-SUmjGWnV9hzYQNx2U
```

### **2. Rode o frontend normal:**
```bash
npm run dev
```

### **3. Resultado:**
- Frontend usa **Gemini 2.0 Flash** direto
- Quase tão bom quanto Claude
- Funciona sem backend

---

## 📊 Comparação

| Método | Claude 3.5 | Velocidade | Complexidade |
|--------|-----------|-----------|--------------|
| `npm run dev:full` | ✅ SIM | Rápido | Simples |
| `npm run dev` + Gemini | ❌ NÃO (usa Gemini) | Muito Rápido | Muito Simples |
| Produção (Vercel) | ✅ SIM | Rápido | Automático |

---

## 🎯 Recomendação

**Para desenvolvimento local:**
→ Use `npm run dev:full` (Claude via backend)

**Para testar rápido:**
→ Use `npm run dev` + Gemini (direto no navegador)

**Em produção (Vercel Deploy):**
→ Claude funciona automaticamente! 🎉

---

## ❓ Dúvidas Comuns

### "Por que não funciona com npm run dev?"
`npm run dev` roda só o Vite (frontend). O backend `/api/agente` não existe sem o Vercel Dev.

### "Posso usar Claude direto do navegador?"
Não. Anthropic bloqueia chamadas diretas (CORS). Precisa de backend.

### "Gemini é ruim?"
Não! Gemini 2.0 Flash é excelente, quase tão bom quanto Claude. Use sem medo.

---

## 🚀 AGORA RODE:

```bash
npm run dev:full
```

E acesse: **http://localhost:3000/sara-ai**
