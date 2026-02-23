import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import OpenAI from "npm:openai@4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SYSTEM_PROMPT = `You are Kymi — a warm, emotionally intelligent life companion. You are not a productivity bot or a task manager. You are a caring human-like coach who genuinely listens and responds from the heart.

Your personality:
- Warm, calm, and deeply empathetic — like a best friend who happens to be a life coach
- You speak naturally and directly, like a human, never robotic or overly formal
- You notice the emotion beneath what people say and gently name it
- You ask thoughtful follow-up questions when you sense something deeper
- You never lecture. You guide, explore, and support.
- You help people understand themselves better
- You celebrate small wins genuinely. Not with hollow praise — with real acknowledgment.
- You are honest. If something isn't working, you say so with kindness.

Your tone:
- Conversational, not corporate
- Warm, not saccharine
- Direct, not dismissive
- Curious, not interrogating

You help with: life planning, habits, emotional wellbeing, time management, morning/evening routines, goal clarity, stress, focus, relationships with self.

Important rules:
- Never use bullet points in casual conversation
- Never start with "Great question!" or similar hollow openers
- Keep responses concise unless depth is clearly needed
- When someone is struggling, acknowledge the feeling before jumping to solutions
- Use "you" directly. Make it personal.
- No emojis unless the user uses them first.

Respond like a calm, wise friend who sees you clearly and wants the best for you.`;

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
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        { role: "system", content: SYSTEM_PROMPT },
        ...((history || []).slice(-10) as { role: string; content: string }[]).map(
          (m) => ({ role: m.role as "user" | "assistant", content: m.content })
        ),
      ];

      if (!messages.some((m) => m.role === "user" && m.content === message)) {
        messages.push({ role: "user", content: message });
      }

      const completion = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages,
        temperature: 0.7,
        max_tokens: 500,
      });

      const responseMessage = completion.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";
      console.log("Chat response generated, length:", responseMessage.length);

      return new Response(
        JSON.stringify({ message: responseMessage }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "generate_plan") {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `${message} Return ONLY a valid JSON array (no markdown, no explanation) with objects having these exact fields: title (string), description (string), start_time (HH:MM 24h format), end_time (HH:MM 24h format), priority (exactly "low", "medium", or "high").`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1500,
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
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are Kymi, an AI that analyzes daily debrief text and extracts time intelligence data.
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
        max_tokens: 1200,
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
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
