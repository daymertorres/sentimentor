// /api/chat.js
const fetch = require('node-fetch');

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { message } = req.body;

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: message }],
                    max_tokens: 100,
                })
            });

            const data = await response.json();
            res.status(200).json(data.choices[0].message.content);
        } catch (error) {
            console.error("Error en la API de OpenAI:", error);
            res.status(500).json({ error: "Error en la API de OpenAI" });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
