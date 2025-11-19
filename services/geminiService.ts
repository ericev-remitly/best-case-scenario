import { GoogleGenAI, Type } from '@google/genai';
import type { ScenarioCard } from '../types';

const simpleResponseSchema = {
  type: Type.OBJECT,
  properties: {
    scenarios: {
      type: Type.ARRAY,
      description: "An array of best-case scenarios.",
      items: {
        type: Type.OBJECT,
        properties: {
          scenario: {
            type: Type.STRING,
            description: "A single, positive, interesting, and feel-good scenario. It should be a direct statement.",
          },
        },
        required: ["scenario"],
      },
    },
  },
  required: ["scenarios"],
};

const complexResponseSchema = {
  type: Type.OBJECT,
  properties: {
    scenarios: {
      type: Type.ARRAY,
      description: "An array of complex best-case scenarios.",
      items: {
        type: Type.OBJECT,
        properties: {
          setup: {
            type: Type.STRING,
            description: "The setup or context for the scenario.",
          },
          options: {
            type: Type.ARRAY,
            description: "An array of exactly 3 positive, feel-good choices for the scenario.",
            items: {
              type: Type.STRING,
            },
          },
        },
        required: ["setup", "options"],
      },
    },
  },
  required: ["scenarios"],
};


export const generateScenarios = async (themeKey: string, count: number, customText?: string): Promise<ScenarioCard[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // If a custom text is provided, prefer that as the theme shown in prompts.
  // Otherwise, convert the theme key (e.g., `workplace_wins`) to a human-friendly title.
  const themeName = (customText && customText.trim().length > 0)
    ? customText.trim()
    : themeKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  const isComplex = themeKey === 'complex_conundrums';

  const simplePrompt = `
    You are a creative assistant for a game called "Best-Case Scenario".
    Your task is to generate exactly ${count} unique, interesting, and direct positive scenarios based on the theme of "${themeName}".
    Each scenario should be a short, single statement that describes a lucky, interesting, favorable, or fun outcome. The tone should be lighthearted, optimistic, and suitable for a fun team-building activity.
    Think of them as small, delightful moments.
    Here are some examples of the style I'm looking for:
    - "Miss your bus, but get cast in a movie shooting on the street."
    - "Get invited to an apple pie eating contest."
    - "Find a secret, beautiful garden in your neighborhood."
    - "A barista gives you a free coffee because you have a nice smile."
    Now, generate the scenarios.
  `;
  
  const complexPrompt = `
    You are a creative assistant for a game called "Best-Case Scenario".
    Your task is to generate exactly ${count} unique, complex, positive scenarios based on the theme of "${themeName}".
    Each scenario must have two parts:
    1. A "setup": A brief description of a situation.
    2. A list of exactly 3 "options": These should all be favorable, but distinct, resolutions to the setup. Each option should appeal to a different kind of personality or value (e.g., adventure vs. comfort, creativity vs. financial gain, social connection vs. personal achievement). The goal is to make the choice interesting and revealing about the person choosing, sparking conversation. The tone should be lighthearted, optimistic, and suitable for a fun team-building activity.

    Here is an example of the style I'm looking for:
    {
      "setup": "You find a dusty old lamp in an antique shop. You rub it, and a friendly, but low-key, genie appears. They offer you one of three permanent, personal enhancements.",
      "options": [
        "The ability to have the perfect, witty comeback for any situation, but only after a 5-second delay.",
        "The skill to instantly master any musical instrument you pick up, but you can only play songs from the 1990s.",
        "The power to always find the best parking spot, no matter how crowded the lot is."
      ]
    }
    Now, generate the scenarios.
  `;

  const prompt = isComplex ? complexPrompt : simplePrompt;
  const schema = isComplex ? complexResponseSchema : simpleResponseSchema;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.9,
      },
    });

    const jsonString = response.text.trim();
    const parsed = JSON.parse(jsonString) as { scenarios: ScenarioCard[] };

    if (!parsed.scenarios || !Array.isArray(parsed.scenarios)) {
        throw new Error("Invalid response format from API. Expected a 'scenarios' array.");
    }
    
    return parsed.scenarios;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate scenarios from the Gemini API.");
  }
};