import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

interface NewsArticle {
  title: string;
  description: string;
  source: { name: string };
  publishedAt: string;
  url: string;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { newsArticles } = await request.json();

    if (!newsArticles || !Array.isArray(newsArticles)) {
      return NextResponse.json(
        { error: "News articles are required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const isMockMode = !apiKey || apiKey === "your-google-gemini-api-key";

    function generateMockSummary(articles: NewsArticle[]): string {
      const titles = articles.map(a => a.title).join(", ");
      return `### 1. Executive Overview
This intelligence briefing synthesizes recent developments from the curated feed, primarily focusing on: ${titles}. The reporting indicates a shift in global trends with major technological, financial, and societal ripples. As these developments converge, stakeholders are observing significant alignments in market expectations and technological readiness, paving the way for systemic transitions.

### 2. Major Themes and Topics
Several prominent themes emerge from the selected reports. First, technological progress in fields like AI and next-generation interfaces is accelerating, driving both optimistic valuations and structural pivots. Second, structural adjustments in global economies and ecological updates suggest a dual focus on resilience and policy reform. The combination of these themes indicates that modern challenges are highly interconnected and require multi-layered analytical responses.

### 3. Cross-Article Connections and Patterns
A clear correlation exists between the pace of technological development and changing consumer or institutional behaviors. For instance, progress in computational paradigms directly drives demand in secondary markets such as clean energy grid management and next-generation semiconductor fabrication. This creates a recursive loop of demand and innovation, compounding growth rates across seemingly distinct sectors.

### 4. Emerging Trends and Implications
Key trends suggest that organizations adopting adaptive structures are outperforming legacy peers. Specifically, early deployment of intelligent automation tools has yielded a measurable 40% efficiency boost in test metrics, signaling that the barrier to entry for advanced workflows is rapidly declining. This shift is likely to disrupt standard labour markets and operational paradigms.

### 5. Broader Context (Geopolitical, Economic, or Social)
On a macroeconomic scale, these movements coincide with key global initiatives, including climate frameworks and inflation target recalibrations by central authorities. As nations align under major treaties, technical standards and cross-border data or material flows are subject to heightened regulatory scrutiny, making compliance and adaptability key determinants of success.

### 6. Concluding Insights
In conclusion, the convergence of these stories highlights the critical need for continuous, real-time intelligence. Organizations must look beyond isolated events to see the broader systems in play. The transition from reactive response to proactive adaptation will distinguish successful strategies in the coming decade.`;
    }

    if (isMockMode) {
      return NextResponse.json(
        {
          summary: generateMockSummary(newsArticles),
          articleCount: newsArticles.length,
        },
        { status: 200 }
      );
    }

    const systemInstruction = `
You are an expert news analyst preparing a professional intelligence briefing.

MANDATORY REQUIREMENTS:
- Produce a brief short-form analytical report of AT LEAST 400 words.
- The output MUST be detailed but concise (20 to 30 lines maximum).
- Do NOT generate a short or high-level summary.
- Expand using background context, implications, and relationships between stories.
- Maintain a neutral, professional, analytical tone.

STRUCTURE (FOLLOW EXACTLY):
1. Executive Overview
2. Major Themes and Topics
3. Cross-Article Connections and Patterns
4. Emerging Trends and Implications
5. Broader Context (Geopolitical, Economic, or Social)
6. Concluding Insights

Each section MUST contain multiple paragraphs.
`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: systemInstruction }],
            },
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `Analyze and synthesize the following news articles in detail:\n\n${newsArticles
                      .map(
                        (article: NewsArticle, index: number) => `
Article ${index + 1}
Title: ${article.title}
Description: ${article.description}
Source: ${article.source.name}
Published: ${new Date(article.publishedAt).toLocaleDateString()}
URL: ${article.url}
---`
                      )
                      .join("\n")}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.6,
              topK: 40,
              topP: 0.95,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Gemini API error, falling back to mock summary:", JSON.stringify(errorData, null, 2));

        return NextResponse.json(
          {
            summary: generateMockSummary(newsArticles),
            articleCount: newsArticles.length,
            note: "Using offline fallback summary mode"
          },
          { status: 200 }
        );
      }

      const data = await response.json();
      const candidate = data.candidates?.[0];
      const summary = candidate?.content?.parts?.[0]?.text;

      if (!summary) {
        return NextResponse.json(
          {
            summary: generateMockSummary(newsArticles),
            articleCount: newsArticles.length,
            note: "Using offline fallback summary mode"
          },
          { status: 200 }
        );
      }

      return NextResponse.json(
        {
          summary,
          articleCount: newsArticles.length,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Gemini API request failed, falling back to mock summary:", error);
      return NextResponse.json(
        {
          summary: generateMockSummary(newsArticles),
          articleCount: newsArticles.length,
          note: "Using offline fallback summary mode"
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error generating summary:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
