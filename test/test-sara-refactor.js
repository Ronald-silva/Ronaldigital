import { SaraAI } from "../lib/agents/saraAI.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Configura dotenv
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

async function testSara() {
  console.log("🚀 Iniciando Teste da Sara AI Refatorada...");

  try {
    const sara = new SaraAI();

    // Cenário 1: Primeira interação
    console.log("\n--- Cenário 1: Primeira Interação ---");
    const userMsg1 = "Olá, gostaria de saber mais sobre seus serviços.";
    const userInfo = {
      nome: "Teste User",
      email: "teste@email.com",
      tipoServico: "Site",
    };

    const response1 = await sara.processMessage(userMsg1, userInfo, []);
    console.log("👤 User:", userMsg1);
    console.log("🤖 Sara:", response1.response);
    console.log("📊 Dados:", JSON.stringify(response1.data, null, 2));

    // Cenário 2: Continuação com contexto
    console.log("\n--- Cenário 2: Continuação (Contexto) ---");
    const userMsg2 = "Tenho uma loja de roupas e quero vender online.";
    const chatHistory = [
      { role: "user", content: userMsg1 },
      { role: "assistant", content: response1.response },
    ];

    const response2 = await sara.processMessage(
      userMsg2,
      userInfo,
      chatHistory
    );
    console.log("👤 User:", userMsg2);
    console.log("🤖 Sara:", response2.response);
    console.log("📊 Dados:", JSON.stringify(response2.data, null, 2));

    // Verificações
    if (response2.response && response2.data.suggested_actions) {
      console.log("\n✅ Teste passou: Resposta gerada e estruturada!");
    } else {
      console.error("\n❌ Teste falhou: Resposta incompleta.");
    }
  } catch (error) {
    console.error("\n❌ Erro fatal no teste:", error);
  }
}

testSara();
