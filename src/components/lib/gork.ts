export async function askKymi(message: string) {

const apiKey = import.meta.env.VITE_GROK_API_KEY;

if (!apiKey) {
return "Grok API key missing.";
}

try {

const response = await fetch("https://api.x.ai/v1/chat/completions", {

method: "POST",

headers: {
"Content-Type": "application/json",
"Authorization": `Bearer ${apiKey}`
},

body: JSON.stringify({

model: "grok-beta",

messages: [

{
role: "system",
content: "You are TryKimi, a calm AI assistant helping plan productivity, habits, and daily life."
},

{
role: "user",
content: message
}

]

})

});

const data = await response.json();

return data.choices?.[0]?.message?.content || "No reply.";

} catch (error) {

return "Connection error.";

}

}