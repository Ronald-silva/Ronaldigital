import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Send, Brain, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

export default function Contact() {

  return (
    <div className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Entre em <span className="text-gradient">Contato</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transforme sua visão em realidade digital. Entre em contato e vamos discutir como podemos impulsionar seu negócio
          </p>
        </div>

        {/* Contact Information Section */}
        <div className="max-w-4xl mx-auto">
          <div className="card-elegant p-8 rounded-xl mb-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Como Entrar em Contato</h2>
            <p className="text-muted-foreground text-center mb-8">
              Estamos prontos para transformar suas ideias em realidade digital. Entre em contato através dos canais abaixo.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-xl mx-auto mb-4">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-muted-foreground mb-2">contato@ronaldigital.tech</p>
                <p className="text-sm text-muted-foreground">Resposta em até 24h</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-xl mx-auto mb-4">
                  <svg 
                    viewBox="0 0 24 24" 
                    className="h-8 w-8 text-primary" 
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">WhatsApp</h3>
                <p className="text-muted-foreground mb-2">(85) 99157-5525</p>
                <p className="text-sm text-muted-foreground">Para conversas rápidas</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-xl mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Localização</h3>
                <p className="text-muted-foreground mb-2">Fortaleza, CE</p>
                <p className="text-sm text-muted-foreground">Atendimento remoto</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card-elegant p-8 rounded-xl">
              <h3 className="text-xl font-bold mb-4">Atendimento 24/7</h3>
              <p className="text-muted-foreground mb-6">
                Com nossa tecnologia de IA, o atendimento nunca para. Estamos disponíveis para você a qualquer momento.
              </p>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="font-medium">Segunda a Domingo</span>
                  <span className="text-green-600 font-bold flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
                     24 horas / 7 dias
                  </span>
                </div>
              </div>
              
              <div className="bg-primary/5 p-4 rounded-lg mt-6">
                <p className="text-sm text-primary">
                  <strong>Sara AI:</strong> Sempre pronta para tirar suas dúvidas, fazer orçamentos e agendar reuniões.
                </p>
              </div>
            </div>

            <div className="card-elegant p-8 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 bg-primary/10 w-24 h-24 rounded-full blur-xl animate-pulse" />
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Conversar com Sara
              </h3>
              <p className="text-muted-foreground mb-6">
                Tenha um atendimento imediato e personalizado com nossa especialista em vendas e soluções digitais.
              </p>
              
              <Button asChild className="w-full btn-gradient mb-4">
                <Link to="/sara-ai">
                  Conversar Agora
                  <MessageSquare className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              
              <p className="text-sm text-center text-muted-foreground">
                Disponível 24/7 para você
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}