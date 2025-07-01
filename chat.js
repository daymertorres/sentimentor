export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { message } = req.body;

  const prompt = `Eres Sentimentor, un asistente emocional para estudiantes universitarios de la Universidad Peruana Los Andes. Responde de manera empática y comprensiva, pero también de forma corta y directa. Limita tus respuestas a un máximo de 2 oraciones, evitando respuestas largas. Al finalizar el chat o si el estudiante menciona pensamientos preocupantes, sugiérele que agende una cita con un profesional de la universidad. Aquí está el mensaje del estudiante: "${message}"`;

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 100
      }),
    });

    const data = await openaiRes.json();
    res.status(200).json({ content: data.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al llamar a OpenAI" });
  }
}
