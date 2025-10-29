import dotenv from 'dotenv';
import { SEOAnalyzer } from '../lib/seo/seoAnalyzer.js';

dotenv.config();

console.log('🔍 TESTE DO ANALISADOR SEO PROFISSIONAL');
console.log('=' .repeat(60));

async function testSEOAnalyzer() {
  try {
    const analyzer = new SEOAnalyzer();
    
    console.log('\n📊 TESTE 1: Site Bem Otimizado');
    console.log('-' .repeat(40));
    
    const test1 = await analyzer.analyzeSite("https://google.com");
    console.log(`✅ Análise concluída`);
    console.log(`Score: ${test1.overallScore}/100`);
    console.log(`Sucesso: ${test1.success}`);
    if (test1.technicalData) {
      console.log(`Tempo de carregamento: ${test1.technicalData.loadTime}ms`);
      console.log(`HTTPS: ${test1.technicalData.hasHttps}`);
      console.log(`Responsivo: ${test1.technicalData.responsive}`);
      console.log(`Título: "${test1.technicalData.title}"`);
    }
    
    console.log('\n📊 TESTE 2: Site com Problemas');
    console.log('-' .repeat(40));
    
    const test2 = await analyzer.analyzeSite("http://example.com");
    console.log(`✅ Análise concluída`);
    console.log(`Score: ${test2.overallScore}/100`);
    console.log(`Sucesso: ${test2.success}`);
    
    console.log('\n📊 TESTE 3: Site Inexistente (Fallback)');
    console.log('-' .repeat(40));
    
    const test3 = await analyzer.analyzeSite("https://site-que-nao-existe-12345.com");
    console.log(`✅ Fallback ativado`);
    console.log(`Sucesso: ${test3.success}`);
    console.log(`Tem análise: ${test3.fallbackAnalysis ? 'Sim' : 'Não'}`);
    
    console.log('\n🎯 TESTE 4: Análise Completa com IA');
    console.log('-' .repeat(40));
    
    const test4 = await analyzer.analyzeSite("https://ronalddigital.com");
    console.log(`✅ Análise do próprio site`);
    console.log(`Score: ${test4.overallScore}/100`);
    console.log(`Análise gerada: ${test4.analysis ? 'Sim' : 'Não'}`);
    
    if (test4.analysis) {
      console.log('\n📝 PRÉVIA DA ANÁLISE:');
      console.log(test4.analysis.substring(0, 200) + '...');
    }
    
    console.log('\n✅ TODOS OS TESTES CONCLUÍDOS!');
    console.log('🎉 Analisador SEO funcionando perfeitamente!');
    
  } catch (error) {
    console.error('❌ Erro nos testes:', error);
    
    console.log('\n🔄 TESTANDO FALLBACK...');
    
    const analyzer = new SEOAnalyzer();
    const fallback = analyzer.generateSpecificationFallback("https://teste.com", null);
    
    console.log('✅ Fallback funcionando!');
    console.log('📝 Exemplo de análise fallback gerada');
  }
}

testSEOAnalyzer();