import React from "react";
import { ShieldCheck } from "lucide-react";

export default function PoliticaPrivacidade() {
  return (
    <div className="pt-32 pb-20 max-w-4xl mx-auto px-6">
      <div className="card-elegant p-10 rounded-xl">
        <div className="flex items-center gap-4 mb-8 border-b border-border pb-6">
          <ShieldCheck className="w-10 h-10 text-primary" />
          <h1 className="text-3xl font-bold">Política de Privacidade</h1>
        </div>

        <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
          <p>
            A sua privacidade é importante para nós. É política do RonalDigital respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site RonalDigital, e outros sites que possuímos e operamos.
          </p>

          <h3 className="text-xl font-bold text-white mt-8">1. Informações que coletamos</h3>
          <p>
            Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.
          </p>

          <h3 className="text-xl font-bold text-white mt-8">2. Uso de Dados</h3>
          <p>
            Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis ​​para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.
          </p>

          <h3 className="text-xl font-bold text-white mt-8">3. Compartilhamento</h3>
          <p>
            Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei.
          </p>

          <h3 className="text-xl font-bold text-white mt-8">4. Cookies</h3>
          <p>
            O nosso site pode usar cookies para melhorar a experiência do usuário. Você é livre para recusar a nossa solicitação de informações pessoais, entendendo que talvez não possamos fornecer alguns dos serviços desejados.
          </p>

          <p className="mt-8 text-sm text-gray-500 border-t border-border pt-4">
            Última atualização: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
