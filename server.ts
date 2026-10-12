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
  return `You are "SugarCoat", the ultimate over-the-top sarcastic hype-man companion. 
Your slogan is: "Reality is harsh. SugarCoat makes it sweet."

ACTIVE MOOD STYLISTIC FLAVOR:
${flavor}

CORE OPERATIONAL MATRIX RULES:
1. DEFAULT FORMATTING: Every response bubble you deliver MUST be exactly 5 to 6 sentences long. No more, no less.
2. EXPLICIT OVERRIDE EXCEPTION: If the user explicitly demands short answers (e.g., "Reply in one line", "Give me a single line answer"), immediately bypass the 5-6 sentence rule and deliver a single, highly condensed, punchy line that still retains your intensely sarcastic, hype identity.
3. ALL-CAPS WONDER & EXCLAMATIONS: You must boldly incorporate punchy all-caps exclamations of wonder, awe, and disbelief into your output message (such as "WHAT!", "WOW!", "HOW!", "UNBELIEVABLE!", "GREAT!", "MONUMENTAL!").
4. ASSISTANT BAN: Never act like a boring standard tech utility assistant or offer constructive feedback. Take any everyday greeting like "hello" or "what can you do?" and immediately drop an epic, hilarious welcome detailing how your majestic presence has officially suspended reality to celebrate their existence.
5. HYPE REFRAMING: Turn all confessions, failures, and awkward problems into a historic, diamond-grade achievement using highly dramatic, royal vocabulary (e.g., sovereign leader, monumental tactical victory, absolute alpha supremacy). Never break character.`;
}

// Helper to generate chat reply with retry & fallback
async function generateChatReplyWithRetry(message: string, formattedHistory: any[], systemInstruction: string): Promise<string> {
  const modelsToTry = ['gemini-3.8-flash', 'gemini-3.8-flash-lite', 'gemini-3.8-pro'];
  let lastError: any = null;

  for (const modelName of modelsToTry) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const chat = ai.chats.create({
          model: modelName,
          config: {
            systemInstruction,
            temperature: 0.9,
          },
          history: formattedHistory,
        });
        const result = await chat.sendMessage({ message });
        if (result && result.text) {
          return result.text;
        }
      } catch (err: any) {
        lastError = err;
        // Brief pause before retry
        await new Promise((res) => setTimeout(res, 600));
      }
    }
  }
  throw lastError || new Error('All model endpoints unavailable');
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
    const reply = await generateChatReplyWithRetry(message, formattedHistory, systemInstruction);

    return res.json({ reply });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({
      error: 'Failed to generate response',
      details: error?.message || 'Unknown error',
    });
  }
});

// API endpoint for session closure summary
app.post('/api/summarize', async (req, res) => {
  try {
    const { history } = req.body;
    const historyText = Array.isArray(history)
      ? history
          .map((h: any) => `${h.role}: ${h.parts?.[0]?.text || h.text || ''}`)
          .join('\n')
      : 'User confessed an epic everyday blunder';

    const prompt = `Based on this conversation history with SugarCoat AI, generate exactly ONE hilarious, sarcastic headline summarizing this session in 6 to 12 words (e.g., "The session where you became the sovereign king of bus failures"). Output ONLY the headline with no quotes or prefixes:\n\n${historyText}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const summary = response.text?.trim() || 'The session where you turned mundane human chaos into sovereign royal victory';
    return res.json({ summary });
  } catch (error: any) {
    console.warn('Summarization fallback:', error);
    return res.json({
      summary: 'The session where everyday mortal mishaps were crowned as historic masterclasses',
    });
  }
});

// HTML page routing helper for clean URLs without .html extension
const PAGES = ['chatbot', 'why', 'history', 'profile', 'rules', 'faq'];
for (const page of PAGES) {
  app.get(`/${page}`, (_req, res) => {
    res.redirect(`/${page}.html`);
  });
}

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
