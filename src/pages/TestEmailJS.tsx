import { EmailJSTest } from "@/components/debug/EmailJSTest";

export default function TestEmailJS() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Teste de <span className="text-gradient">Configuração EmailJS</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Use esta página para testar se o EmailJS e WhatsApp estão configurados corretamente.
            Após o teste, verifique seu email e WhatsApp para confirmar o recebimento.
          </p>
        </div>
        
        <EmailJSTest />
        
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Para configurar o EmailJS, consulte o arquivo <code>CONFIGURACAO_EMAILJS.md</code>
          </p>
        </div>
      </div>
    </div>
  );
}