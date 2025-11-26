import { ChatGroq } from "@langchain/groq";
import { HumanMessage } from "@langchain/core/messages";
import dotenv from "dotenv";

dotenv.config();

async function testGrok() {
  console.log("🧪 Testando Grok API diretamente...");
  
  try {
    const model = new ChatGroq({
      apiKey: process.env.GROK_API_KEY,
      modelName: "mixtral-8x7b-32768",
      temperature: 0.7,
    });

    console.log("✅ Modelo Grok inicializado");

    const message = new HumanMessage("Olá! Responda apenas: 'Funcionando!'");
    const response = await model.invoke([message]);
    
    console.log("📤 Enviado:", message.content);
    console.log("📥 Recebido:", response.content);
    
  } catch (error) {
    console.error("❌ Erro:", error);
  }
}

testGrok();