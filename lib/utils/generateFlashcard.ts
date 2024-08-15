import { FlashcardContent } from "@/types";
import { v4 as uuidv4 } from 'uuid';
const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
const YOUR_SITE_URL = process.env.YOUR_SITE_URL || 'https://your-site.com';
const YOUR_SITE_NAME = process.env.YOUR_SITE_NAME || 'Your Site Name';




export async function generateFlashcards(topic: string, count: number = 10): Promise<FlashcardContent[] | null> {
  try {
    
    const prompt = `Generate ${count} flashcards on the topic "${topic}". Each flashcard should have a front text containing a question and back text containing the answer. Format: Front: [question] Back: [answer]. Do not include any extra text or formatting.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": YOUR_SITE_URL, // Optional, for including your app on openrouter.ai rankings.
        "X-Title": YOUR_SITE_NAME, // Optional. Shows in rankings on openrouter.ai.
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "model": "meta-llama/llama-3.1-8b-instruct:free",
        "messages": [
          {
            "role": "system",
            "content": prompt,
          }
        ],
      }),
    });

    const data = await response.json();
    console.log('API response:', data);

    if (response.ok && data.choices && data.choices[0]?.message?.content) {
      const content = data.choices[0].message.content;
      const flashcards: FlashcardContent[] = [];

      // Regular expression to match "Front:" and "Back:" pairs
      const flashcardRegex = /Front:\s*(.*?)\s*Back:\s*(.*?)(?=\n\n|$)/g;

      let match;
      while ((match = flashcardRegex.exec(content)) !== null) {
        const front = match[1].trim();
        const back = match[2].trim();
        flashcards.push({    id: uuidv4(),front, back });
      }
      return flashcards;
    } else {
      console.error('Error generating flashcard content:', data);
      return null;
    }
  } catch (error) {
    console.error('API request failed:', error);
    return null;
  }
}
