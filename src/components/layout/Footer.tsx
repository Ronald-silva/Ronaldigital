import { Link } from "react-router-dom";
import { Instagram, Mail, Phone, MapPin, ShieldCheck, FileText } from "lucide-react";

// Ícone TikTok customizado (não disponível no lucide)
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.74a4.85 4.85 0 01-1.01-.05z"/>
    </svg>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="inline-block group" onClick={scrollToTop}>
              <div className="flex items-center space-x-3">
                <img 
                  src="/logomarca.png" 
                  alt="RonalDigital" 
                  className="h-10 w-auto object-contain flex-shrink-0 rounded-lg group-hover:scale-105 transition-transform"
                />
                <span className="text-xl font-bold leading-tight tracking-tight" translate="no" data-translate="no">
                  <span className="text-white">Ronal</span><span className="text-primary">Digital</span>
                </span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Agentes de IA que vendem por você 24h. Sites e Landing Pages de alta conversão para negócios em Fortaleza.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com/ronal.digital"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-white/5 hover:bg-primary hover:text-white transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://tiktok.com/@ronal_digital"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-white/5 hover:bg-primary hover:text-white transition-all duration-300"
                aria-label="TikTok"
              >
                <TikTokIcon className="h-5 w-5" />
              </a>
              <a
                href="mailto:contato@ronaldigital.tech"
                className="p-2.5 rounded-lg bg-white/5 hover:bg-primary hover:text-white transition-all duration-300"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-white/90">Navegação</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="text-gray-400 hover:text-primary transition-colors block py-1" onClick={scrollToTop}>Início</Link></li>
              <li><Link to="/sobre" className="text-gray-400 hover:text-primary transition-colors block py-1" onClick={scrollToTop}>Sobre Nós</Link></li>
              <li><Link to="/servicos" className="text-gray-400 hover:text-primary transition-colors block py-1" onClick={scrollToTop}>Soluções</Link></li>
              <li><Link to="/portfolio" className="text-gray-400 hover:text-primary transition-colors block py-1" onClick={scrollToTop}>Portfólio</Link></li>
            </ul>
          </div>

          {/* Legal & Suporte */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-white/90">Institucional</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/politica-privacidade" className="flex items-center text-gray-400 hover:text-primary transition-colors py-1" onClick={scrollToTop}>
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link to="/termos-uso" className="flex items-center text-gray-400 hover:text-primary transition-colors py-1" onClick={scrollToTop}>
                  <FileText className="h-4 w-4 mr-2" />
                  Termos de Uso
                </Link>
              </li>
              <li><Link to="/faq" className="text-gray-400 hover:text-primary transition-colors py-1" onClick={scrollToTop}>Perguntas Frequentes</Link></li>
            </ul>
          </div>

          {/* Contato Rico */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-white/90">Fale Conosco</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3 text-gray-400">
                <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Fortaleza, CE<br/>Atendimento Remoto</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <a href="https://wa.me/5585991575525" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  (85) 99157-5525
                </a>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <a href="mailto:contato@ronaldigital.tech" className="hover:text-white transition-colors">
                  contato@ronaldigital.tech
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex justify-center text-center text-xs text-gray-500">
          <p>&copy; {currentYear} <span translate="no" data-translate="no" className="text-gray-300 font-medium">RonalDigital</span>. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}