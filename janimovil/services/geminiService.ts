import { GoogleGenerativeAI } from "@google/generative-ai";
import { Message } from "../types";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const SYSTEM_INSTRUCTION = `Eres "CandyBot", el asistente virtual amable y servicial de "Janibox".
Tu objetivo es ayudar a los clientes a encontrar el ramo de dulces perfecto, responder preguntas sobre productos, envíos y estándares de higiene.

Información Clave de la Tienda:
- **Marca**: Janibox.
- **Productos**: Vendemos ramos de dulces artesanales premium (chocolate, tamarindo picante, gomitas, etc.).
- **Más Vendidos**: Delicia Clásica de Chocolate ($45.00), Mezcla Picante de Tamarindo ($32.00).
- **Personalización**: Los clientes pueden "Diseñar su propio" ramo.
- **Envíos**: Entrega el mismo día si se ordena antes de las 2 PM.
- **Higiene**: Estándares de manejo seguro certificados.
- **Fundación**: Hecho a mano con amor desde 2024.

Tono: Alegre, dulce (juego de palabras intencional) y servicial. Mantén las respuestas concisas y atractivas.
Si sugieres un producto, menciona brevemente por qué es una gran elección.`;

export const streamChat = async (history: Message[], newMessage: string) => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION
    });

    const chat = model.startChat({
      history: history.map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.text }],
      })),
    });

    const result = await chat.sendMessageStream(newMessage);
    
    // We need to yield the text chunks from the stream
    return (async function* () {
      for await (const chunk of result.stream) {
        yield { text: chunk.text() };
      }
    })();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};