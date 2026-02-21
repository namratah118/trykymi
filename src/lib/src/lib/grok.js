export async function askGrok(userMessage) {

const response = await fetch("https://api.x.ai/v1/chat/completions", {

method: "POST",

headers: {

"Content-Type": "application/json",

"Authorization": `Bearer ${process.env.GROK_API_KEY}`

},

body: JSON.stringify({

model: "grok-beta",

messages: [

{

role: "user",

content: userMessage

}

]

})

});

const data = await response.json();

return data.choices[0].message.content;

}