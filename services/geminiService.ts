
import { GoogleGenAI } from "@google/genai";
import { Task } from "../types";

// Helper to get client safely
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("No API_KEY found. AI features will be disabled or mocked.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateTaskCompletionText = async (task: Task): Promise<string> => {
  const client = getClient();
  if (!client) {
    return "一股寒意顺着脊梁骨爬了上来...";
  }

  try {
    const prompt = `
      你是一个恐怖游戏的旁白。
      玩家刚刚完成了这个任务: "${task.description}".
      情境: ${task.storyContext}.
      
      请写一句简短的、令人毛骨悚然或充满悬疑的话（最多30个中文字）来描述结果。
      侧重于氛围、声音或阴影。
      不要使用引号。使用中文回答。
    `;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text?.trim() || "黑暗似乎更深了...";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "当你完成任务时，阴影似乎拉长了。";
  }
};

export const generateNextTask = async (currentLevel: number): Promise<Partial<Task> | null> => {
  const client = getClient();
  if (!client) return null;

  try {
    const prompt = `
      为恐怖合成游戏生成一个简短的恐怖任务描述（当前等级 ${currentLevel}）。
      格式: JSON 对象，包含 'description' (任务描述) 和 'storyContext' (剧情背景)。
      请使用中文。
      例子: {"description": "寻找染血的布条", "storyContext": "墙上的血迹还很新鲜。"}
      保持简单。主题：鬼魂、谋杀之谜、神秘仪式。
    `;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as Partial<Task>;
  } catch (error) {
    console.error("Error generating task:", error);
    return null;
  }
};

export const generateItemIcon = async (imagePrompt: string): Promise<string | null> => {
  const client = getClient();
  if (!client) return null;

  try {
    // Using gemini-2.5-flash-image (nano banana)
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: imagePrompt }
        ]
      }
    });

    // Extract image logic
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64String = part.inlineData.data;
        return `data:${part.inlineData.mimeType};base64,${base64String}`;
      }
    }
    return null;
  } catch (error: any) {
    // Check for Rate Limit (429) or Quota issues and throw so App can backoff
    if (error.status === 429 || error.code === 429 || error.message?.includes('429') || error.message?.includes('quota')) {
        throw error;
    }
    console.error("Error generating icon:", error);
    return null;
  }
};
