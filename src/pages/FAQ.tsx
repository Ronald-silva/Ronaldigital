import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MessageCircle, ArrowRight } from "lucide-react";

const faqItems = [
  {
    question: "Quanto custa para desenvolver um site?",
    answer: "O valor varia dependendo da complexidade e dos recursos necessários. Temos Landing Pages a partir de R$ 600,00 e Sites Institucionais completos a partir de R$ 1.200,00. Recomendamos conversar com nossos especialistas para receber um orçamento personalizado."
  },
  {
    question: "Quanto tempo leva para o projeto ficar pronto?",
    answer: "Nossos prazos são ágeis e variam por serviço: Landing Pages geralmente levam de 3 a 5 dias úteis, enquanto E-commerces e projetos complexos podem levar de 10 a 15 dias úteis após o recebimento de todo o material."
  },
  {
    question: "Como funciona o pagamento?",
    answer: "Trabalhamos com condições flexíveis para facilitar seu investimento. Aceitamos PIX, transferência bancária e parcelamento no cartão de crédito. Normalmente solicitamos uma entrada de 50% para iniciar e o restante na entrega."
  },
  {
    question: "Vocês fazem a manutenção do site depois de pronto?",
    answer: "Sim! Todos os nossos projetos incluem um período de suporte gratuito. Além disso, oferecemos planos de manutenção mensal opcionais para garantir que seu site esteja sempre atualizado e seguro."
  },
  {
    question: "O site vai funcionar no celular?",
    answer: "Com certeza. Todos os nossos projetos são desenvolvidos com tecnologia 'Mobile-First', garantindo que seu site fique perfeito e rápido em celulares, tablets e computadores."
  },
  {
    question: "O que é o Agente de IA (Sara)?",
    answer: "A Sara é nossa inteligência artificial avançada capaz de atender seus clientes 24 horas por dia, tirando dúvidas, agendando reuniões e até qualificando leads automaticamente, como se fosse seu melhor vendedor trabalhando sem parar."
  }
];

export default function FAQ() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">
            Perguntas Frequentes
          </h1>
          <p className="text-lg text-gray-600">
            Tire suas dúvidas sobre nossos serviços, prazos e metodologia de trabalho.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-12">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium text-gray-900 hover:text-primary transition-colors">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="text-center bg-primary/5 rounded-2xl p-8 md:p-12">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full text-primary mb-6">
            <MessageCircle className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ainda tem dúvidas?</h2>
          <p className="text-gray-600 mb-8 max-w-lg mx-auto">
            Nossa equipe está pronta para conversar sobre seu projeto e esclarecer qualquer ponto que não tenha ficado claro.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contato">
              <Button size="lg" className="w-full sm:w-auto">
                Fale Conosco
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
