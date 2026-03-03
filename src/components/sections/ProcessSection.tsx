import React from "react";
import { Search, PenTool, Code2, Rocket } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "1. Imersão & Análise",
    description: "Mergulho no seu negócio para entender seu público, concorrentes e objetivos. Não dou um passo sem dados."
  },
  {
    icon: PenTool,
    title: "2. Estratégia Visual",
    description: "Crio o protótipo do design focado na experiência do usuário e na conversão. Você aprova cada detalhe antes do código."
  },
  {
    icon: Code2,
    title: "3. Desenvolvimento High-End",
    description: "Transformo o design em um site ultra-rápido, seguro e otimizado para todos os dispositivos."
  },
  {
    icon: Rocket,
    title: "4. Lançamento & Otimização",
    description: "Coloco seu projeto no ar, configuro analytics e garanto que tudo esteja perfeito para receber tráfego."
  }
];

const ProcessSection: React.FC = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
            Minha Metodologia
          </h2>
          <h3 className="text-3xl md:text-5xl font-bold text-foreground max-w-3xl mx-auto leading-tight">
            Do Conceito à Realidade Digital em <span className="text-gradient">4 Passos</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent -z-10" />

          {steps.map((step, index) => (
            <div key={index} className="group relative">
              <div className="flex flex-col items-center text-center">
                {/* Icon Wrapper */}
                <div className="w-24 h-24 rounded-2xl bg-secondary/50 border border-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/10 group-hover:border-primary/50 transition-all duration-300 shadow-lg group-hover:shadow-primary/25">
                  <step.icon className="h-10 w-10 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                
                {/* Content */}
                <h4 className="text-xl font-bold mb-3">{step.title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
