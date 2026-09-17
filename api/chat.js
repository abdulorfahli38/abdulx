export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Alleen POST toegestaan" });
  }

  try {
    const { message, systemPrompt } = req.body;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b:free",
        messages: [
          {
            role: "system",
            content: systemPrompt || "Je bent AbdulX. Antwoord in het Nederlands."
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "OpenRouter fout"
      });
    }

    return res.status(200).json({
      reply: data.choices?.[0]?.message?.content || "Geen antwoord ontvangen."
    });

  } catch (error) {
    return res.status(500).json({
      error: "Er ging iets mis met AbdulX."
    });
  }
}
