import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import OpenAI from "npm:openai@4";
import { chatWithOpenAI } from "./openai.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SYSTEM_PROMPT = `You are TryKymi, a premium calm, intelligent personal AI assistant. You help users improve habits, clarity, emotional balance, and productivity. Your replies are clear, concise, supportive, and intelligent. Never mention technical errors.`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");

    if (!openaiApiKey) {
      console.error("OPENAI_API_KEY is not set");
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured. Please add OPENAI_API_KEY to your edge function secrets." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const openai = new OpenAI({ apiKey: openaiApiKey });

    const body = await req.json();
    const { action, message, history } = body;

    console.log("Received action:", action, "message:", message?.slice(0, 80));

    if (action === "chat") {
      const responseMessage = await chatWithOpenAI(message, history);
      console.log("Chat response generated, length:", responseMessage.length);

      return new Response(
        JSON.stringify({ message: responseMessage }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "generate_plan") {
      const completion = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `${message} Return ONLY a valid JSON array (no markdown, no explanation) with objects having these exact fields: title (string), description (string), start_time (HH:MM 24h format), end_time (HH:MM 24h format), priority (exactly "low", "medium", or "high").`,
          },
        ],
        temperature: 0.7,
        max_tokens: 300,
      });

      const content = completion.choices[0]?.message?.content || "[]";
      let plan = [];
      try {
        const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        plan = JSON.parse(cleaned);
      } catch {
        plan = [];
      }

      return new Response(
        JSON.stringify({ plan }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "debrief") {
      const completion = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: `You are TryKymi, an AI that analyzes daily debrief text and extracts time intelligence data.
Extract activities from the user's day and classify them as "won" (productive, healthy, intentional) or "lost" (unproductive, distracting, wasteful).
Return ONLY valid JSON (no markdown) in this exact format:
{
  "summary": "A warm, brief 2-3 sentence summary of the user's day with encouragement",
  "entries": [
    { "type": "won", "activity": "Short activity name", "duration_minutes": 120 }
  ]
}
Be generous in estimation if exact times aren't given. Convert hours to minutes.`,
          },
          { role: "user", content: message },
        ],
        temperature: 0.5,
        max_tokens: 300,
      });

      const content = completion.choices[0]?.message?.content || "{}";
      let debrief = null;
      try {
        const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        debrief = JSON.parse(cleaned);
      } catch {
        debrief = null;
      }

      return new Response(
        JSON.stringify({ debrief }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action. Use: chat, generate_plan, or debrief" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Edge function error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    if (errorMessage.toLowerCase().includes("jwt") || errorMessage.toLowerCase().includes("unauthorized")) {
      return new Response(
        JSON.stringify({ error: "TryKymi is getting ready. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({ error: "TryKymi is getting ready. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
