# Agente de IA Multi-Especialista - Ronald Digital

Sistema de agente multi-agente com LangChain para captacao, qualificacao e vendas de sites, utilizando as filosofias de vendas de Neil Rackham, Jill Konrath e Gary Vaynerchuk.

## Funcionalidades

### Sistema de Agente Multi-Especialista

**Neil Rackham (Captacao e Analise Consultiva)**: Atua como um consultor, fazendo perguntas estrategicas baseadas no SPIN Selling para entender a fundo a situacao, o problema, a implicacao e a necessidade do cliente. Ele garante que a solucao proposta seja a mais adequada, e nao apenas um produto generico.

**Jill Konrath (Qualificacao e Eficiencia)**: Especialista em lidar com clientes ocupados. Ela aplica a metodologia BANT (Budget, Authority, Need, Timeline) de forma concisa e direta, qualificando o lead rapidamente para garantir que o tempo do cliente e do agente seja usado de forma eficiente.

**Gary Vaynerchuk (Vendas e Relacionamento)**: Focado em construir valor e confianca. Este agente e responsavel por apresentar a proposta de forma persuasiva, oferecer conteudo de valor (como guias e artigos) e, por fim, fechar a venda ou nutrir o relacionamento para futuras oportunidades.

## Servicos Oferecidos

- **Landing Pages**: R$ 500-1.000 (Foco em alta conversao e captacao de leads)
- **Portfolios**: R$ 400-800 (Foco em credibilidade e apresentacao profissional)
- **Sites/Blogs**: R$ 800-2.000 (Foco em autoridade, SEO e conteudo)

## Tecnologias

- **LangChain**: Framework robusto para orquestracao de agentes de IA
- **Grok API**: IA da xAI (gratuita) com fallback para OpenAI para maior estabilidade
- **Next.js**: Framework React para as rotas da API
- **Vercel**: Plataforma serverless para deploy gratuito e escalavel

## Instalacao

### 1. Clone o repositorio e instale as dependencias
Bash

git clone <seu-repo>
cd ronald-digital-ai-agent
npm install
### 2. Configure as variaveis de ambiente

Copie o arquivo de exemplo e edite as suas informacoes:

Bash

cp .env.example .env.local
Edite o arquivo .env.local com suas chaves e informacoes de negocio:

Snippet de código

# API Keys (obtenha pelo menos uma)
GROK_API_KEY=your_grok_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Configuracoes do seu negocio
BUSINESS_EMAIL=ronald.digital27@gmail.com
BUSINESS_PHONE=5585991993833
BUSINESS_NAME=Ronald Digital

# Faixas de preco dos servicos
LANDING_PAGE_MIN=500
LANDING_PAGE_MAX=1000
PORTFOLIO_MIN=400
PORTFOLIO_MAX=800
WEBSITE_MIN=800
WEBSITE_MAX=2000
### 3. Teste a aplicacao localmente
Bash

# Para iniciar o ambiente de desenvolvimento
npm run dev

# Para rodar os testes unitários do agente
npm run test
## Obtendo suas API Keys

### Grok API (Recomendado - Gratuito)
Acesse: https://console.x.ai/

Crie sua conta e obtenha a sua chave.

Adicione a chave em GROK_API_KEY no seu .env.local.

OpenAI API (Fallback)
Acesse: https://platform.openai.com/

Crie sua conta e obtenha a chave.

Adicione a chave em OPENAI_API_KEY no seu .env.local.

## Deploy no Vercel

### 1. Faca o deploy automatico
Bash

# Instale a Vercel CLI, se ainda não tiver
npm i -g vercel

# Execute o deploy
vercel --prod
### 2. Configure as variaveis no Vercel

No painel do Vercel, adicione suas variaveis de ambiente na secao de configuracoes do projeto, como GROK_API_KEY, BUSINESS_EMAIL, etc.

### 3. Teste em producao

Acesse a pagina de teste do agente na URL gerada pelo Vercel: https://seu-site.vercel.app/agente-teste

## Como Usar

### 1. Integracao com seu site

Use a seguinte estrutura de codigo para enviar dados do seu formulario ou chat para o agente:

JavaScript

const enviarParaAgente = async (formData) => {
  const response = await fetch("/api/agente", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nome: formData.nome,
      email: formData.email,
      mensagem: formData.mensagem,
      tipoServico: formData.tipoServico,
    }),
  });

  const resultado = await response.json();

  if (resultado.success) {
    // Acao com a resposta do agente
    console.log(resultado.resposta);
    console.log("Pontuacao do Lead:", resultado.leadScore);
  }
};
### 2. Pagina de teste

Acesse a rota /agente-teste para simular o formulario completo e testar o fluxo de qualificacao.

## Fluxo do Agente

O agente principal "Maestro" direciona a conversa, acionando a persona ideal para cada interacao:

```
Formulario → Neil Rackham → Jill Konrath → Gary Vaynerchuk → Resposta
    ↓             ↓              ↓               ↓              ↓
Input do      Analise e     Qualificacao    Vendas ou      Resposta
Cliente       Perguntas    (Metodologia     Nutricao      Personalizada
             Consultivas      BANT)
```
### Exemplo de Resposta
JSON

{
  "success": true,
  "resposta": "Ola Joao! Com base no que voce me disse, nossa landing page otimizada com IA pode ser a solucao ideal. Com um orcamento de R$ 800, podemos focar em converter visitantes em clientes para sua loja. Que tal agendarmos uma conversa de 15 minutos para detalharmos o seu projeto?",
  "etapa": "vendas",
  "leadScore": 4,
  "proximaAcao": "fechar_venda"
}
## Testes
Teste local
Bash

node test/test-agent.js
### Casos de teste incluidos
- Lead Quente (orcamento + prazo definidos)
- Lead Morno (interesse, mas sem urgencia)
- Lead Frio (apenas curiosidade)

## Personalizacao
### Modificar Personas

Edite os arquivos JSON em `data/` para ajustar:

- `data/maestro.json` - Configuracoes do orquestrador
- `data/persona_rackham.json` - Neil Rackham (SPIN Selling)
- `data/persona_konrath.json` - Jill Konrath (BANT)
- `data/persona_vaynerchuk.json` - Gary Vaynerchuk (Value-First)

Adicionar novos agentes
Crie um novo arquivo JSON em `data/` seguindo a estrutura:

```json
{
  "nome": "Seu Nome",
  "role": "Sua Especialidade", 
  "prompt_inicial": "Seu prompt personalizado..."
}
```
## Metricas e Analytics

O sistema retorna dados valiosos que podem ser usados para analisar a performance do agente:

- **Lead Score**: 0-4 (baseado na metodologia BANT)
- **Classificacao**: Quente/Morno/Frio
- **Etapa**: Captacao/Qualificacao/Vendas
- **Proxima Acao**: Fechar/Agendar/Nutrir

## Troubleshooting
### Erro de API Key
```
Error: GROK_API_KEY ou OPENAI_API_KEY nao configurada
```
**Solucao**: Certifique-se de que pelo menos uma das chaves de API esteja configurada corretamente.

### Erro de Timeout
```
Error: Function execution timed out
```
**Solucao**: Otimize os prompts para serem mais concisos e reduza o maxTokens na configuracao da API para evitar processamentos longos.

### CORS Error
```
Error: CORS policy blocked
```
**Solucao**: Certifique-se de que a variavel de ambiente VERCEL_URL esteja configurada corretamente.

## Custos
### Grok API (Gratuito)
Nivel gratuito generoso, ideal para comecar.

### OpenAI API
Custo por token. Estime ~R$ 0,10 por conversa, resultando em ~R$ 10-30/mes para 100-300 conversas.

### Vercel (Gratuito)
100GB de largura de banda e funcoes serverless incluidas no plano gratuito.

## Suporte

Para duvidas ou problemas, entre em contato:

Email: ronald.digital27@gmail.com

WhatsApp: +55 85 99199-3833

---

Agora voce tem um agente de IA especialista em vendas rodando 24/7, com uma estrategia de vendas clara e poderosa!