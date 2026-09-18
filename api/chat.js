export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Alleen POST toegestaan"
    });
  }

  try {
    const { message, systemPrompt } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Geen bericht ontvangen"
      });
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
          messages: [
            {
              role: "system",
              content:
                systemPrompt ||
                "Je bent AbdulX, een behulpzame AI. Antwoord altijd in het Nederlands."
            },
            {
              role: "user",
              content: message
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "Er ging iets mis met Groq."
      });
    }

    const reply =
      data.choices?.[0]?.message?.content ||
      "Ik kreeg geen antwoord.";

    return res.status(200).json({
      reply: reply
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Er ging iets mis met AbdulX."
    });
  }
}
