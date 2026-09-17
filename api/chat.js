export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Alleen POST toegestaan" });
  }

  try {
    const { message } = req.body;

    const response = await fetch(
      "https://ai-gateway.vercel.sh/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.AI_GATEWAY_API_KEY}`
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content: "Je bent AbdulX, een behulpzame AI. Antwoord in het Nederlands."
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
        error: data.error?.message || "AI Gateway fout"
      });
    }

    res.status(200).json({
      reply: data.choices?.[0]?.message?.content || "Geen antwoord ontvangen."
    });

  } catch (error) {
    res.status(500).json({
      error: "Er ging iets mis met AbdulX."
    });
  }
}
