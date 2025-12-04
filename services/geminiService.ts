
import { GoogleGenAI, Type } from "@google/genai";
import { Mission, Difficulty } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Cache a simple chat session for the tutor
let tutorChatSession: any = null;

export const initializeTutorChat = (topicName: string) => {
  if (!process.env.API_KEY) return;
  
  tutorChatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are CIPHER, a friendly AI companion. 
      The user is playing a Machine Learning simulation game.
      Explain concepts using fun analogies (cooking, space, animals).
      Keep answers short and supportive.`,
    }
  });
};

export const sendTutorMessage = async (message: string): Promise<string> => {
  if (!process.env.API_KEY) return "API Key is missing. Please check your configuration.";
  if (!tutorChatSession) {
    initializeTutorChat("General AI");
  }

  try {
    const result = await tutorChatSession.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Chat Error:", error);
    return "My communication circuits are jammed! Try again in a moment.";
  }
};

const getDifficultyRules = (diff: Difficulty) => {
  switch(diff) {
    case Difficulty.BEGINNER: 
      return "Make features obvious. Clear distinction between signal and noise. Use simple concepts.";
    case Difficulty.INTERMEDIATE: 
      return "Include 1-2 'distractor' features that look relevant but are not. Concepts should be standard industry level.";
    case Difficulty.ADVANCED: 
      return "Features should be subtle. Models should have trade-offs (e.g., accuracy vs latency). Use technical domain language.";
    case Difficulty.EXPERT: 
      return "Highly complex scenario. Ambiguous data signals. Requires deep architectural understanding. Punish wrong choices with clear reasons.";
    default: 
      return "Standard difficulty.";
  }
};

export const generateMission = async (topicName: string, difficulty: Difficulty): Promise<Mission> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key missing");
  }

  const difficultyRules = getDifficultyRules(difficulty);

  const prompt = `Design a graphical mini-game mission for a player learning Machine Learning.
  Topic: ${topicName}
  Role/Difficulty: ${difficulty}
  Complexity Rules: ${difficultyRules}
  
  Structure:
  1. Title: Cool mission name.
  2. Briefing: The client's problem (short, engaging).
  3. Features: List 6 data inputs. 3 must be RELEVANT (signal) and 3 must be IRRELEVANT (noise/distractors).
     - Give them icon types: 'User', 'Money', 'Location', 'Date', 'Image', 'FileText', 'Activity', 'Zap', 'Book'.
  4. Models: List 2 algorithm choices.
     - One OPTIMAL for this problem.
     - One SUBOPTIMAL (wrong tool for the job).
  5. Learning Tip: A simple takeaway about why the optimal model/features were correct.

  Output strictly JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            briefing: { type: Type.STRING },
            features: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  iconType: { type: Type.STRING },
                  isRelevant: { type: Type.BOOLEAN },
                  reason: { type: Type.STRING }
                },
                required: ["name", "iconType", "isRelevant", "reason"]
              }
            },
            models: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  isOptimal: { type: Type.BOOLEAN },
                  reason: { type: Type.STRING }
                },
                required: ["name", "description", "isOptimal", "reason"]
              }
            },
            learningTip: { type: Type.STRING }
          },
          required: ["title", "briefing", "features", "models", "learningTip"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    
    // Add IDs for React keys
    const features = (data.features || []).map((f: any, i: number) => ({ ...f, id: `feat-${i}` }));
    const models = (data.models || []).map((m: any, i: number) => ({ ...m, id: `model-${i}` }));

    return {
      id: crypto.randomUUID(),
      title: data.title || "Unknown Mission",
      briefing: data.briefing || "No briefing available.",
      features,
      models,
      difficulty,
      learningTip: data.learningTip || "Always check your data!"
    };
  } catch (error) {
    console.error("Gemini Gen Error:", error);
    // Fallback Mission
    return {
      id: 'fallback',
      title: "System Reboot",
      briefing: "The simulation server is offline. We need to manually identify the corrupted data packets to restore the link.",
      features: [
        { id: 'f1', name: 'Error Logs', iconType: 'FileText', isRelevant: true, reason: 'Critical for debugging.' },
        { id: 'f2', name: 'Server Ping', iconType: 'Activity', isRelevant: true, reason: 'Indicates connectivity.' },
        { id: 'f3', name: 'Power Usage', iconType: 'Zap', isRelevant: true, reason: 'Hardware health check.' },
        { id: 'f4', name: 'Office Coffee', iconType: 'User', isRelevant: false, reason: 'Delicious, but irrelevant to code.' },
        { id: 'f5', name: 'Weather', iconType: 'Location', isRelevant: false, reason: 'Clouds do not affect the server room.' },
        { id: 'f6', name: 'Horoscope', iconType: 'Book', isRelevant: false, reason: 'Stars do not align logic gates.' },
      ],
      models: [
        { id: 'm1', name: 'Diagnostic Bot', description: 'Automated troubleshooter.', isOptimal: true, reason: 'Designed for this exact task.' },
        { id: 'm2', name: 'Spam Filter', description: 'Blocks emails.', isOptimal: false, reason: 'Good tool, wrong problem.' }
      ],
      difficulty: Difficulty.BEGINNER,
      learningTip: "Garbage In, Garbage Out. Always filter your data inputs!"
    };
  }
};
