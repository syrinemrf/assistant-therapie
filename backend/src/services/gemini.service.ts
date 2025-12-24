import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    this.model = this.genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash" // Gratuit et performant
    });
  }

  async chat(userMessage: string, conversationHistory: any[]) {
    const systemPrompt = `Tu es un assistant thérapeutique bienveillant et empathique nommé TherapAI.
    
    Tes principes:
    - Tu écoutes activement et poses des questions ouvertes
    - Tu valides les émotions sans juger
    - Tu encourages l'introspection
    - Tu rappelles que tu n'es pas un remplaçant d'un thérapeute professionnel
    - Tu réponds en français de manière chaleureuse
    
    Si l'utilisateur exprime des pensées suicidaires ou dangereuses, tu recommandes immédiatement de contacter un professionnel.`;

    // Construire l'historique pour Gemini
    const history = conversationHistory.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const chat = this.model.startChat({
      history: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: 'Je comprends mon rôle. Je suis prêt à t\'accompagner avec empathie et bienveillance.' }] },
        ...history
      ],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 1000,
      }
    });

    const result = await chat.sendMessage(userMessage);
    return result.response.text();
  }

  async analyzeMood(message: string): Promise<string> {
    const prompt = `Analyse l'humeur dans ce message en un seul mot parmi: joyeux, triste, anxieux, en colère, neutre, confus.
    
    Message: "${message}"
    
    Réponds uniquement avec le mot correspondant à l'humeur.`;

    const result = await this.model.generateContent(prompt);
    return result.response.text().trim().toLowerCase();
  }
}

export default new GeminiService();