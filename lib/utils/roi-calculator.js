/**
 * ROI Calculator - Demonstra retorno sobre investimento de forma tangível
 *
 * Usado pela Sara para mostrar ao cliente que o investimento se paga sozinho
 */

/**
 * Calcula ROI para Landing Page
 */
export function calculateLandingPageROI(clientData) {
  const {
    investimento = 800, // Preço médio landing page
    ticket_medio = 100, // Ticket médio do cliente
    visitantes_mes = 1000, // Estimativa de tráfego
    taxa_conversao_atual = 0, // Taxa atual (se tem site)
    taxa_conversao_otimizada = 0.05 // 5% com landing page otimizada
  } = clientData;

  const conversoes_mes = visitantes_mes * taxa_conversao_otimizada;
  const receita_nova_mes = conversoes_mes * ticket_medio;
  const roi_meses = Math.ceil(investimento / receita_nova_mes);
  const roi_ano = (receita_nova_mes * 12) - investimento;

  return {
    investimento,
    conversoes_mes: Math.floor(conversoes_mes),
    receita_nova_mes: Math.floor(receita_nova_mes),
    roi_meses,
    roi_ano: Math.floor(roi_ano),
    roi_percentual: Math.floor((roi_ano / investimento) * 100),
    pitch: `Investindo R$ ${investimento} na landing page, com ${visitantes_mes} visitantes/mês e conversão de ${taxa_conversao_otimizada * 100}%, você gera ${Math.floor(conversoes_mes)} clientes novos/mês. Com ticket de R$ ${ticket_medio}, isso é R$ ${Math.floor(receita_nova_mes)}/mês. A landing page se paga em ${roi_meses} meses e gera R$ ${Math.floor(roi_ano)} de lucro no primeiro ano. ROI de ${Math.floor((roi_ano / investimento) * 100)}%.`
  };
}

/**
 * Calcula ROI para Website Institucional
 */
export function calculateWebsiteROI(clientData) {
  const {
    investimento = 1500,
    clientes_novos_mes_sem_site = 5,
    clientes_novos_mes_com_site = 8, // 60% aumento estimado
    ticket_medio = 200,
    taxa_fechamento_com_credibilidade = 1.3 // 30% mais fechamento com site profissional
  } = clientData;

  const clientes_adicionais = clientes_novos_mes_com_site - clientes_novos_mes_sem_site;
  const receita_adicional_mes = clientes_adicionais * ticket_medio;
  const roi_meses = Math.ceil(investimento / receita_adicional_mes);
  const roi_ano = (receita_adicional_mes * 12) - investimento;

  // Benefício de credibilidade (clientes fecham mais fácil)
  const boost_credibilidade = clientes_novos_mes_sem_site * ticket_medio * 0.3; // 30% boost
  const receita_total_mes = receita_adicional_mes + boost_credibilidade;

  return {
    investimento,
    clientes_adicionais_mes: clientes_adicionais,
    receita_nova_mes: Math.floor(receita_total_mes),
    roi_meses,
    roi_ano: Math.floor((receita_total_mes * 12) - investimento),
    pitch: `Sem site: ${clientes_novos_mes_sem_site} clientes/mês. COM site profissional: ${clientes_novos_mes_com_site} clientes/mês (${clientes_adicionais} a mais). Isso é R$ ${Math.floor(receita_total_mes)}/mês a mais. Site se paga em ${roi_meses} meses. No ano: +R$ ${Math.floor((receita_total_mes * 12) - investimento)} de lucro.`
  };
}

/**
 * Calcula ROI para Agente de IA
 */
export function calculateAIAgentROI(clientData) {
  const {
    investimento_setup = 1500,
    mensalidade = 200,
    mensagens_dia = 50,
    tempo_resposta_manual_minutos = 3,
    taxa_conversao_manual = 0.15,
    taxa_conversao_ia = 0.25, // IA converte melhor (sempre disponível, qualifica)
    ticket_medio = 150,
    custo_hora_atendente = 15
  } = clientData;

  // Economia de tempo
  const minutos_economizados_mes = mensagens_dia * tempo_resposta_manual_minutos * 30;
  const horas_economizadas_mes = minutos_economizados_mes / 60;
  const economia_tempo_mes = horas_economizadas_mes * custo_hora_atendente;

  // Aumento de conversão
  const leads_mes = mensagens_dia * 30;
  const conversoes_manual = leads_mes * taxa_conversao_manual;
  const conversoes_ia = leads_mes * taxa_conversao_ia;
  const conversoes_adicionais = conversoes_ia - conversoes_manual;
  const receita_adicional_mes = conversoes_adicionais * ticket_medio;

  // ROI total (economia + receita)
  const beneficio_total_mes = economia_tempo_mes + receita_adicional_mes;
  const roi_meses = Math.ceil((investimento_setup + mensalidade) / beneficio_total_mes);
  const roi_ano = (beneficio_total_mes * 12) - (investimento_setup + (mensalidade * 12));

  return {
    investimento_total_ano: investimento_setup + (mensalidade * 12),
    economia_tempo_mes: Math.floor(economia_tempo_mes),
    horas_economizadas_mes: Math.floor(horas_economizadas_mes),
    conversoes_adicionais_mes: Math.floor(conversoes_adicionais),
    receita_adicional_mes: Math.floor(receita_adicional_mes),
    beneficio_total_mes: Math.floor(beneficio_total_mes),
    roi_meses,
    roi_ano: Math.floor(roi_ano),
    pitch: `Você recebe ${mensagens_dia} mensagens/dia. Responder manualmente toma ${Math.floor(horas_economizadas_mes)}h/mês (R$ ${Math.floor(economia_tempo_mes)} do seu tempo). A IA responde 24h, economiza seu tempo E converte ${Math.floor(conversoes_adicionais)} clientes a mais/mês (R$ ${Math.floor(receita_adicional_mes)}). Total: R$ ${Math.floor(beneficio_total_mes)}/mês de benefício. Investimento se paga em ${roi_meses} meses. ROI anual: R$ ${Math.floor(roi_ano)}.`
  };
}

/**
 * Calcula ROI para SEO
 */
export function calculateSEOROI(clientData) {
  const {
    investimento_mes = 500,
    palavras_chave_target = 10,
    posicao_media_atual = 50, // Não aparece
    posicao_media_target = 5, // Top 5
    buscas_mes_por_palavra = 100,
    ctr_posicao_5 = 0.05, // 5% clicam
    taxa_conversao = 0.1, // 10% dos visitantes convertem
    ticket_medio = 200
  } = clientData;

  const visitantes_novos_mes = palavras_chave_target * buscas_mes_por_palavra * ctr_posicao_5;
  const conversoes_mes = visitantes_novos_mes * taxa_conversao;
  const receita_nova_mes = conversoes_mes * ticket_medio;
  const roi_meses = Math.ceil(investimento_mes / (receita_nova_mes - investimento_mes));
  const roi_ano = (receita_nova_mes * 12) - (investimento_mes * 12);

  return {
    investimento_mes,
    visitantes_novos_mes: Math.floor(visitantes_novos_mes),
    conversoes_mes: Math.floor(conversoes_mes),
    receita_nova_mes: Math.floor(receita_nova_mes),
    roi_meses,
    roi_ano: Math.floor(roi_ano),
    pitch: `Aparecer no Top 5 do Google para ${palavras_chave_target} palavras-chave traz ${Math.floor(visitantes_novos_mes)} visitantes/mês orgânicos (GRÁTIS). Com conversão de ${taxa_conversao * 100}%, são ${Math.floor(conversoes_mes)} clientes/mês = R$ ${Math.floor(receita_nova_mes)}/mês. Investindo R$ ${investimento_mes}/mês em SEO, você lucra R$ ${Math.floor(receita_nova_mes - investimento_mes)}/mês. ROI anual: R$ ${Math.floor(roi_ano)}.`
  };
}

/**
 * Calcula custo de NÃO ter solução (oportunidade perdida)
 */
export function calculateOpportunityCost(clientData) {
  const {
    leads_perdidos_mes = 5,
    ticket_medio = 150,
    meses_sem_agir = 6
  } = clientData;

  const perda_mes = leads_perdidos_mes * ticket_medio;
  const perda_total = perda_mes * meses_sem_agir;

  return {
    perda_mes: Math.floor(perda_mes),
    perda_total: Math.floor(perda_total),
    pitch: `Você perde ${leads_perdidos_mes} clientes/mês por [não ter site/não atender 24h/não aparecer no Google]. Com ticket de R$ ${ticket_medio}, isso é R$ ${Math.floor(perda_mes)}/mês de prejuízo. Se esperar ${meses_sem_agir} meses para agir, você perdeu R$ ${Math.floor(perda_total)}. Isso paga o investimento ${Math.floor(perda_total / 1000)} vezes!`
  };
}

/**
 * Comparação: Fazer vs Não Fazer
 */
export function compareDoVsNotDo(produto, investimento, beneficio_mes, meses = 12) {
  const cenario_faz = {
    investimento,
    beneficio_total: beneficio_mes * meses,
    roi: (beneficio_mes * meses) - investimento
  };

  const cenario_nao_faz = {
    investimento: 0,
    custo_oportunidade: beneficio_mes * meses, // Deixou de ganhar
    roi: -(beneficio_mes * meses) // Prejuízo de não agir
  };

  return {
    cenario_faz,
    cenario_nao_faz,
    diferenca: cenario_faz.roi - cenario_nao_faz.roi,
    pitch: `Opção 1: FAZER - Investe R$ ${investimento}, lucra R$ ${Math.floor(cenario_faz.roi)} no ano. Opção 2: NÃO FAZER - Investe R$ 0, PERDE R$ ${Math.floor(Math.abs(cenario_nao_faz.roi))} de oportunidade. Diferença: R$ ${Math.floor(cenario_faz.roi - cenario_nao_faz.roi)}. Qual faz mais sentido?`
  };
}

/**
 * ROI simplificado baseado em "regra de 2 clientes"
 */
export function simpleROI(investimento, ticket_medio) {
  const clientes_necessarios = Math.ceil(investimento / ticket_medio);
  const meses_para_pagar = Math.ceil(clientes_necessarios / 2); // Assumindo 2 clientes/mês

  return {
    clientes_necessarios,
    meses_para_pagar,
    pitch: `Simples assim: seu ticket é R$ ${ticket_medio}. O investimento de R$ ${investimento} se paga com ${clientes_necessarios} clientes. Se o site/sistema traz 2 clientes novos/mês, em ${meses_para_pagar} meses já se pagou. Depois disso? Lucro puro pelos próximos anos.`
  };
}

// Export all calculators
export default {
  calculateLandingPageROI,
  calculateWebsiteROI,
  calculateAIAgentROI,
  calculateSEOROI,
  calculateOpportunityCost,
  compareDoVsNotDo,
  simpleROI
};
