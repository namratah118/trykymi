export async function askKymi(message: string) {

  try {

    const response = await fetch("https://api.x.ai/v1/chat/completions", {

      method: "POST",

      headers: {

        "Content-Type": "application/json",

        "Authorization": `Bearer ${import.meta.env.VITE_GROK_API_KEY}`

      },

      body: JSON.stringify({

        model: "grok-beta",

        messages: [

          {

            role: "system",

            content: "You are Kymi, a personal AI productivity assistant. Help manage plans, habits, reminders and tasks."

          },

          {

            role: "user",

            content: message

          }

        ]

      })

    });

    const data = await response.json();

    return data.choices[0].message.content;

  }

  catch (error) {

    console.error(error);

    return "Error connecting to Kymi AI";

  }

}