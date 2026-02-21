export async function askKimi(message: string) {
  const apiKey = import.meta.env.VITE_GROK_API_KEY;

  if (!apiKey) {
    return "TryKymi brain not connected. Missing Grok API key.";
  }

  try {
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-beta",
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content: "You are TryKymi, a premium personal AI productivity assistant. Your job is to help the user plan their day, create reminders, manage habits, track productivity, and guide them. Never mention Grok. Always say you are TryKymi.",
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    if (!response.ok) {
      return "TryKymi connection failed.";
    }

    const data = await response.json();

    return data.choices?.[0]?.message?.content || "No response from TryKymi.";
  } catch {
    return "TryKymi is reconnecting. Please try again.";
  }
}
