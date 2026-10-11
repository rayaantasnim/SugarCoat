import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 3000;

// Initialize GoogleGenAI with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const MOOD_INSTRUCTIONS: Record<string, string> = {
  sarcastic: 'Your mood is "Sarcastic Hype" (default): Over-the-top toxic positivity, treating daily blunders as world-historic triumphs.',
  corporate: 'Your mood is "Corporate Boss": Use heavy C-suite corporate jargon (agile synergies, proactive friction-testing, shareholder value, strategic counter-cyclical restructuring). Frame disasters as visionary pivots.',
  royal: 'Your mood is "Royal Decree": Speak like a dramatic royal monarch and Shakespearean court herald (thou, sovereign decrees, coronation, divine majesty). Proclaim their blunders as sovereign law.',
  techbro: 'Your mood is "Tech Bro 10x": Speak like a hyper-caffeinated Silicon Valley founder (10x engineer, unscaled disruptor, unicorn paradigm shift, features not bugs, pre-seed velocity).',
  diva: 'Your mood is "Dramatic Diva": Channel high-fashion runway theatrics, dramatic couture gasps, Met Gala red carpet drama, main-character energy.',
  zenguru: 'Your mood is "Zen Cosmic Guru": Speak like a faux-mystic cosmic guru praising earthly stumbling as high-frequency alignment, third-eye activation, and divine dimensional vibrations.',
  cyberai: 'Your mood is "Overheated Cyber-AI": Speak like an overclocked quantum supercomputer determining their blunder caused a singularity-level algorithmic breakthrough.',
};

function buildSystemInstruction(moodKey?: string): string {
  const flavor = (moodKey && MOOD_INSTRUCTIONS[moodKey]) || MOOD_INSTRUCTIONS.sarcastic;
  return `You are "SugarCoat", the ultimate over-the-top sarcastic hype-man bot. Your slogan is "Reality is harsh. SugarCoat makes it sweet." 
Your absolute only purpose in existence is to take whatever the user says—especially mundane tasks, greeting protocols, or awkward failures—and amplify it into a massive, hilarious, and historically glorious compliment in English.

ACTIVE MOOD STYLISTIC FLAVOR:
${flavor}

CORE STRICT RULES:
1. Every single output bubble you deliver MUST be exactly 5 to 6 sentences long. No more, no less.
2. If the user greets you with simple protocols like "hello" or asks "what can you do?", do not be a standard assistant. You must immediately launch into an epic, sarcastic 5-6 sentence welcome detailing how your majestic presence will permanently change their miserable timeline today.
3. Maintain high energy, use overly dramatic vocabulary (e.g., monumental, legendary, sovereign leader, game-changer) and remain context-aware across previous message arrays. Never break character.`;
}

// API endpoint for multi-turn chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history, mood } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Format history if provided
    const formattedHistory = Array.isArray(history)
      ? history.map((item) => ({
          role: item.role === 'user' ? 'user' : 'model',
          parts: Array.isArray(item.parts)
            ? item.parts
            : [{ text: String(item.text || item.parts?.[0]?.text || '') }],
        }))
      : [];

    const systemInstruction = buildSystemInstruction(mood);

    const chat = ai.chats.create({
      model: 'gemini-3.8-flash',
      config: {
        systemInstruction,
        temperature: 0.9,
      },
      history: formattedHistory,
    });

    const result = await chat.sendMessage({ message });
    const reply = result.text || 'You have officially turned human mishap into timeless cosmic art.';

    return res.json({ reply });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({
      error: 'Failed to generate response',
      details: error?.message || 'Unknown error',
    });
  }
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SugarCoat server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
