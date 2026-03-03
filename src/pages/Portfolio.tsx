import { SEO } from "@/components/SEO";
import { useState } from "react";
import { ExternalLink, Github as GithubIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const portfolioItems = [
  {
    id: 1,
    title: "BarberFlow - SaaS para Barbearias",
    category: "saas",
    description: "Sistema completo de agendamento online para barbearias com gestão de clientes, horários e serviços",
    image: "/barberflow.png",
    technologies: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    liveUrl: "https://barber-flow-swart.vercel.app/",
    githubUrl: "#"
  },
  {
    id: 2,
    title: "Medeiros Veículos - Qualificador de Leads",
    category: "saas",
    description: "SaaS com agente de IA para qualificação automática de leads e agendamento inteligente de visitas",
    image: "/medeiros.png",
    technologies: ["React", "Claude AI", "LangChain", "Vercel"],
    liveUrl: "https://medeiro-veiculos.vercel.app/",
    githubUrl: "#"
  },
  {
    id: 3,
    title: "HS Forge Luxury - Site com IA",
    category: "site",
    description: "Site premium com agente de IA integrado para atendimento personalizado e vendas consultivas",
    image: "/hs.png",
    technologies: ["React", "Vite", "Anthropic AI", "Tailwind"],
    liveUrl: "https://hs-forge-luxury.vercel.app/",
    githubUrl: "#"
  },
  {
    id: 4,
    title: "AuditPrime - Contabilidade",
    category: "site",
    description: "Site profissional para escritório de contabilidade com foco em credibilidade e conversão de clientes",
    image: "/aud.png",
    technologies: ["React", "TypeScript", "Tailwind CSS"],
    liveUrl: "https://audit-prime.vercel.app/",
    githubUrl: "#"
  },
  {
    id: 5,
    title: "SalesNet - Landing Page",
    category: "landing",
    description: "Landing page de alta conversão com design moderno e call-to-actions estrategicamente posicionados",
    image: "/sales.png",
    technologies: ["React", "Tailwind", "Framer Motion"],
    liveUrl: "https://salesnet-green.vercel.app/",
    githubUrl: "#"
  },
  {
    id: 6,
    title: "Major Heribaldo - Blog Pessoal",
    category: "blog",
    description: "Blog pessoal responsivo com design elegante e otimizado para SEO e performance",
    image: "/blog.png",
    technologies: ["React", "Markdown", "SEO", "Analytics"],
    liveUrl: "https://major-heribaldo.vercel.app/",
    githubUrl: "#"
  },
  {
    id: 7,
    title: "Currículo Digital Interativo",
    category: "portfolio",
    description: "Portfólio/currículo digital moderno e interativo com apresentação profissional de habilidades",
    image: "/curriculo.png",
    technologies: ["React", "CSS3", "JavaScript", "Responsive"],
    liveUrl: "https://curriculo-julia.vercel.app/",
    githubUrl: "#"
  }
];

const categories = [
  { value: "all", label: "Todos" },
  { value: "saas", label: "SaaS" },
  { value: "site", label: "Sites" },
  { value: "landing", label: "Landing Pages" },
  { value: "blog", label: "Blogs" },
  { value: "portfolio", label: "Portfólios" }
];

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredItems = selectedCategory === "all"
    ? portfolioItems
    : portfolioItems.filter(item => item.category === selectedCategory);

  return (
    <div className="pt-32 pb-20">
      <SEO
        title="Portfólio"
        description="Veja os projetos desenvolvidos pela RonalDigital: SaaS, Landing Pages, Sites Institucionais e Agentes de IA para negócios em Fortaleza."
        canonical="/portfolio"
      />
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Projetos <span className="text-gradient">Reais</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Cada projeto entregue com excelência, combinando design moderno, inteligência artificial e resultados mensuráveis
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.value)}
              className={selectedCategory === category.value ? "btn-gradient" : ""}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div key={item.id} className="card-elegant card-hover rounded-xl overflow-hidden">
              <div className="relative group">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                  style={item.id === 7 ? { objectPosition: 'center top' } : undefined}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex gap-2">
                      {item.liveUrl !== "#" && (
                        <Button size="sm" variant="secondary" asChild>
                          <a href={item.liveUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Ver Site
                          </a>
                        </Button>
                      )}
                      {item.githubUrl !== "#" && (
                        <Button size="sm" variant="secondary" asChild>
                          <a href={item.githubUrl} target="_blank" rel="noopener noreferrer">
                            <GithubIcon className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  {item.category === "saas" && (
                    <span className="px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-full">
                      SaaS
                    </span>
                  )}
                  {item.category === "site" && (
                    <span className="px-2 py-1 bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-xs rounded-full">
                      Site
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground mb-4">{item.description}</p>

                <div className="flex flex-wrap gap-2">
                  {item.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card-elegant p-6 text-center rounded-xl">
            <div className="text-4xl font-bold text-gradient mb-2">{portfolioItems.length}</div>
            <div className="text-muted-foreground">Projetos Entregues</div>
          </div>
          <div className="card-elegant p-6 text-center rounded-xl">
            <div className="text-4xl font-bold text-gradient mb-2">2</div>
            <div className="text-muted-foreground">SaaS em Produção</div>
          </div>
          <div className="card-elegant p-6 text-center rounded-xl">
            <div className="text-4xl font-bold text-gradient mb-2">CE</div>
            <div className="text-muted-foreground">Fortaleza — Base de operação</div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="card-elegant p-8 rounded-xl">
            <h2 className="text-3xl font-bold mb-4">Pronto para o seu projeto?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Cada projeto é desenvolvido com dedicação, utilizando as melhores tecnologias e práticas do mercado.
              Do design à inteligência artificial, crio soluções que geram resultados reais.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button asChild className="btn-gradient">
                <Link to="/sara-ai">Conversar com Sara</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/contact">Solicitar Orçamento</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
