import React from "react";
import { FileText } from "lucide-react";

export default function TermosUso() {
  return (
    <div className="pt-32 pb-20 max-w-4xl mx-auto px-6">
      <div className="card-elegant p-10 rounded-xl">
        <div className="flex items-center gap-4 mb-8 border-b border-border pb-6">
          <FileText className="w-10 h-10 text-primary" />
          <h1 className="text-3xl font-bold">Termos de Uso</h1>
        </div>

        <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
          <h3 className="text-xl font-bold text-white mt-8">1. Termos</h3>
          <p>
            Ao acessar ao site RonalDigital, concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis ​​e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis. Se você não concordar com algum desses termos, está proibido de usar ou acessar este site.
          </p>

          <h3 className="text-xl font-bold text-white mt-8">2. Uso de Licença</h3>
          <p>
            É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software) no site RonalDigital , apenas para visualização transitória pessoal e não comercial.
          </p>

          <h3 className="text-xl font-bold text-white mt-8">3. Isenção de responsabilidade</h3>
          <p>
            Os materiais no site da RonalDigital são fornecidos 'como estão'. RonalDigital não oferece garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias, incluindo, sem limitação, garantias implícitas ou condições de comercialização, adequação a um fim específico ou não violação de propriedade intelectual ou outra violação de direitos.
          </p>

          <h3 className="text-xl font-bold text-white mt-8">4. Limitações</h3>
          <p>
            Em nenhum caso o RonalDigital ou seus fornecedores serão responsáveis ​​por quaisquer danos (incluindo, sem limitação, danos por perda de dados ou lucro ou devido a interrupção dos negócios) decorrentes do uso ou da incapacidade de usar os materiais em RonalDigital.
          </p>

          <p className="mt-8 text-sm text-gray-500 border-t border-border pt-4">
            Última atualização: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
