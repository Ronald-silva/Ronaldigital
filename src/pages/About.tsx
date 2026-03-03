import { SEO } from "@/components/SEO";
import { CheckCircle, Code, Lightbulb, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ronaldPhoto from "@/assets/ronald-photo.png";

export default function About() {
  return (
    <div className="pt-32 pb-20">
      <SEO
        title="Sobre"
        description="Sou Ronald, desenvolvedor de Fortaleza especializado em agentes de IA e sistemas SaaS. Crio soluções que automatizam vendas e qualificação de leads."
        canonical="/sobre"
      />
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Sobre Ronal<span className="text-gradient">Digital</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Desenvolvedor especializado em Agentes de IA e SaaS para negócios locais
          </p>
        </div>

        {/* About Content */}
        <div className="flex flex-col lg:flex-row gap-12 items-center mb-20">
          <div className="lg:w-2/5">
            <img 
              src={ronaldPhoto} 
              alt="Ronald - Desenvolvedor Web" 
              className="w-72 h-72 rounded-full object-cover mx-auto shadow-lg"
            />
          </div>
          
          <div className="lg:w-3/5">
            <h2 className="text-3xl font-bold mb-6">Minha História</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              Sou Ronald, desenvolvedor de Fortaleza especializado em agentes de IA e sistemas SaaS. Crio soluções que automatizam vendas e qualificação de leads — já em produção em negócios locais. Trabalho com React, TypeScript, Supabase e IA generativa.
            </p>
            <Button asChild className="btn-gradient">
              <Link to="/contato">Vamos Conversar</Link>
            </Button>
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          <div className="card-elegant p-6 rounded-xl text-center">
            <Code className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Tecnologias Modernas</h3>
            <p className="text-sm text-muted-foreground">React, TypeScript, Supabase, Claude AI, Gemini AI</p>
          </div>
          <div className="card-elegant p-6 rounded-xl text-center">
            <Lightbulb className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Honestidade Primeiro</h3>
            <p className="text-sm text-muted-foreground">Só recomendo o que vai gerar resultado real para o seu negócio</p>
          </div>
          <div className="card-elegant p-6 rounded-xl text-center">
            <Users className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Compromisso Total</h3>
            <p className="text-sm text-muted-foreground">Cada projeto é tratado como se fosse o meu próprio negócio</p>
          </div>
          <div className="card-elegant p-6 rounded-xl text-center">
            <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Solucionador de Problemas</h3>
            <p className="text-sm text-muted-foreground">Não vendo tecnologia — resolvo problemas reais com ela</p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card-elegant p-8 rounded-xl">
            <h3 className="text-2xl font-bold mb-4">Minha Missão</h3>
            <p className="text-muted-foreground leading-relaxed">
              Criar soluções digitais que resolvam problemas reais — não apenas entregar projetos. Acredito que tecnologia só tem valor quando gera resultado concreto para quem a usa. Por isso, sou honesto antes de fechar qualquer negócio: se minha solução não for a certa para você, vou te dizer. Prefiro construir uma relação de confiança duradoura a fazer uma venda que não vai agregar. Cada projeto que assumo, assumo com compromisso total — porque minha palavra vale mais que qualquer contrato.
            </p>
          </div>
          
          <div className="card-elegant p-8 rounded-xl">
            <h3 className="text-2xl font-bold mb-4">Minha Visão</h3>
            <p className="text-muted-foreground leading-relaxed">
              Ser reconhecido não pelo volume de projetos entregues, mas pelo impacto real que cada um gerou. Quero construir uma empresa onde clientes voltam não porque foram convencidos, mas porque foram bem servidos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}