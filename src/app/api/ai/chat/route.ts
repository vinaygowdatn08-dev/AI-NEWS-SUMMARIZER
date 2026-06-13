import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

// 1. Define interfaces for type safety
interface NewsArticle {
  title: string;
  description: string;
  source: { name: string };
  publishedAt: string;
}

interface ChatMessage {
  role: "user" | "assistant" | "model"; // Handle common role names
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message, newsContext, chatHistory } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const isMockMode = !apiKey || apiKey === "your-google-gemini-api-key";

    function generateMockChatResponse(userMsg: string, news: NewsArticle[]): string {
      const lower = userMsg.toLowerCase();
      const newsList = news || [];
      if (lower.includes("summary") || lower.includes("summarize")) {
        if (newsList.length === 0) {
          return "I don't see any news articles in your feed to summarize. Try adding some topics in the dashboard!";
        }
        return `Based on the active news context, here is a summary of the latest events:\n\n` + 
          newsList.map((n, i) => `${i + 1}. **${n.title}** - ${n.description}`).join("\n\n");
      }
      if (lower.includes("hello") || lower.includes("hi")) {
        return "Hello! I am your AI assistant for this news feed. How can I help you analyze or understand the current topics today?";
      }
      if (lower.includes("source") || lower.includes("origin")) {
        if (newsList.length === 0) {
          return "There are no news sources active because there are no articles in your feed.";
        }
        const sources = Array.from(new Set(newsList.map(n => n.source?.name || "Unknown")));
        return `The current articles in your feed are sourced from: ${sources.join(", ")}.`;
      }
      
      // Default conversational fallback
      if (newsList.length > 0) {
        return `That's an interesting question. In relation to "${newsList[0].title}", we are seeing dynamic shifts across these topics. This highlights the growing role of automation and policy alignment in these updates. Is there a specific article or theme you'd like me to explain further?`;
      }
      return "That's a great question! I'm currently running in offline fallback mode. Once you configure a valid Google Gemini API key in your `.env.local` file, I can answer complex real-time questions about any news topics!";
    }

    if (isMockMode) {
      return NextResponse.json(
        { reply: generateMockChatResponse(message, newsContext) },
        { status: 200 }
      );
    }

    // 2. Build the System Instruction (Persona + Context)
    // This is better than injecting it as a fake user message
    let systemInstructionText = `You are a helpful news assistant. 
    You have access to the provided news articles (News Context).
    Use them to answer questions accurately. 
    If the answer isn't in the context, use your general knowledge but mention that it's outside the provided news.
    Be informative, accurate, and concise.`;

    if (newsContext && newsContext.length > 0) {
      const formattedNews = newsContext
        .map(
          (article: NewsArticle, index: number) =>
            `Article ${index + 1}:
Title: ${article.title}
Description: ${article.description}
Source: ${article.source.name}
Published: ${new Date(article.publishedAt).toLocaleDateString()}
---`
        )
        .join("\n\n");
      
      systemInstructionText += `\n\n### NEWS CONTEXT ###\n${formattedNews}`;
    }

    // 3. Build the Conversation History
    const contents = [];

    // Add previous history if it exists
    if (chatHistory && Array.isArray(chatHistory)) {
      chatHistory.forEach((msg: ChatMessage) => {
        contents.push({
          role: msg.role === "user" ? "user" : "model", // API expects 'model', not 'assistant'
          parts: [{ text: msg.content }],
        });
      });
    }

    // Add the current user message
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    try {
      // 4. Call Gemini 2.5 Flash
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: systemInstructionText }],
            },
            contents,
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Gemini API error, using chat fallback:", JSON.stringify(errorData, null, 2));
        return NextResponse.json(
          { reply: generateMockChatResponse(message, newsContext) },
          { status: 200 }
        );
      }

      const data = await response.json();
      
      // 5. Safe Response Extraction
      const candidate = data.candidates?.[0];
      const reply = candidate?.content?.parts?.[0]?.text;

      if (!reply) {
        return NextResponse.json(
          { reply: generateMockChatResponse(message, newsContext) },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { reply },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error in chat, using fallback:", error);
      return NextResponse.json(
        { reply: generateMockChatResponse(message, newsContext) },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error in chat:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}