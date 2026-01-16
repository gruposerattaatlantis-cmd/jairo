
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- TIERRA: Journaling Analysis ---
export const analyzeJournalEntry = async (entry: string) => {
    try {
        const response = await ai.models.generateContent({
            // Use recommended model for basic text tasks
            model: "gemini-3-flash-preview",
            contents: `Eres un sabio jardinero digital y mentor para un joven emprendedor de la Generación Z en Latinoamérica.
            Analiza esta entrada de diario: "${entry}".
            Proporciona una reflexión corta y empática (máximo 2 oraciones) y un consejo accionable para ayudarles a "florecer".
            Tono: Cálido, orgánico, alentador, pero moderno. No corporativo. Responde en Español Latino.`,
        });
        // Access .text property directly
        return response.text;
    } catch (error) {
        console.error("Journal Analysis Error:", error);
        return "Tu jardín interior está escuchando. Sigue cultivando tus pensamientos.";
    }
};

// --- SEMILLA: Business Ideas with Search Grounding ---
export const generateMarketIdeas = async (interests: string[]) => {
    try {
        const prompt = `Genera 3 ideas de negocio modernas y específicas para un emprendedor Gen Z en Latinoamérica interesado en: ${interests.join(', ')}.
        Usa Google Search para encontrar tendencias actuales relevantes.
        Devuelve SOLO un array JSON de objetos con las claves: title (título atractivo), description (1 oración explicativa).
        NO uses bloques de código markdown (como \`\`\`json). Devuelve solo el JSON crudo.
        Responde en Español.`;

        const response = await ai.models.generateContent({
            // Use recommended model for search grounding tasks
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
                // responseMimeType: "application/json" // Unsupported with Search Grounding
            }
        });

        // Search grounding URL extraction would happen here in a real app to show sources
        // console.log(response.candidates?.[0]?.groundingMetadata?.groundingChunks);

        let jsonText = response.text || "[]";
        // Clean up markdown just in case the model ignores the instruction
        jsonText = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Idea Generation Error:", error);
        return [];
    }
};

// --- COMUNIDAD: Find Co-working/Events with Maps Grounding ---
export const findLocalGardenSpaces = async (location: { lat: number, lng: number }) => {
    try {
        const prompt = "Encuentra 3 espacios de coworking, cafés aptos para trabajar o hubs de emprendimiento cerca de la ubicación del usuario. Devuelve una lista con el nombre y una razón breve de por qué es bueno para un 'jardinero' (emprendedor). Responde en Español.";
        
        const response = await ai.models.generateContent({
            // Maps grounding is only supported in Gemini 2.5 series models.
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleMaps: {} }],
                toolConfig: {
                    retrievalConfig: {
                        latLng: {
                            latitude: location.lat,
                            longitude: location.lng
                        }
                    }
                }
            }
        });

        return response.text; // Returns markdown with map links usually
    } catch (error) {
        console.error("Maps Error:", error);
        return "No pudimos conectar con el mapa de jardines cercanos hoy.";
    }
};
