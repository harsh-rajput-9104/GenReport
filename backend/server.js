import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 5000;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:4173'] }));
app.use(express.json({ limit: '64kb' }));

app.post('/api/generate', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
            return res.status(400).json({ error: 'Prompt is required.' });
        }

        if (!GEMINI_API_KEY) {
            return res.status(500).json({ error: 'Server is not configured. Contact the administrator.' });
        }

        const geminiRes = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.4,
                    topK: 40,
                    topP: 0.92,
                    maxOutputTokens: 4096,
                },
                safetySettings: [
                    { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
                    { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
                    { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
                    { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
                ],
            }),
        });

        if (!geminiRes.ok) {
            const errBody = await geminiRes.json().catch(() => ({}));
            const msg = errBody?.error?.message || `Gemini responded with HTTP ${geminiRes.status}`;
            return res.status(502).json({ error: msg });
        }

        const data = await geminiRes.json();
        return res.status(200).json(data);

    } catch (err) {
        return res.status(500).json({ error: 'Internal server error.' });
    }
});

// Health-check — useful for deployment probes
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
    console.log(`GenReport backend running → http://localhost:${PORT}`);
});
