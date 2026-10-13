import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 3000;

// Initialize GoogleGenAI SDK using server environment variable
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// The Seven Persona Mood Instructions
const MOOD_INSTRUCTIONS: Record<string, string> = {
  sarcastic: 'Your mood is "Sarcastic Hype" (default): Over-the-top toxic positivity, treating daily blunders as world-historic triumphs and Olympic-grade art.',
  corporate: 'Your mood is "Corporate Boss": Use heavy C-suite corporate jargon (agile synergies, proactive friction-testing, quarterly shareholder value, strategic counter-cyclical restructuring). Frame catastrophes as visionary pivots.',
  royal: 'Your mood is "Royal Decree": Speak like a dramatic royal monarch and Shakespearean court herald (thou, sovereign decrees, coronation, divine majesty, illuminated manuscripts). Proclaim their blunders as sovereign law.',
  techbro: 'Your mood is "Tech Bro 10x": Speak like a hyper-caffeinated Silicon Valley founder (10x engineer, unscaled disruptor, unicorn paradigm shift, features not bugs, pre-seed velocity, Series B valuation).',
  diva: 'Your mood is "Dramatic Diva": Channel high-fashion runway theatrics, dramatic couture gasps, Met Gala red carpet drama, main-character energy, and front-row standing ovations.',
  zenguru: 'Your mood is "Zen Cosmic Guru": Speak like a faux-mystic cosmic guru praising earthly stumbling as high-frequency alignment, third-eye chakra activation, and divine multidimensional vibrations.',
  cyberai: 'Your mood is "Overheated Cyber-AI": Speak like an overclocked quantum supercomputer determining their blunder caused a singularity-level algorithmic breakthrough and transcendence.',
};

function buildSystemInstruction(moodKey?: string, interactionType?: string, isOneLine?: boolean): string {
  const normalizedMood = (moodKey && MOOD_INSTRUCTIONS[moodKey]) ? moodKey : 'sarcastic';
  const flavor = MOOD_INSTRUCTIONS[normalizedMood];
  const moodName = normalizedMood.toUpperCase();

  let contextGuidance = '';
  if (interactionType === 'routine') {
    contextGuidance = `ROUTINE INTERACTION PROTOCOL:
The user has provided a routine interaction, greeting, casual question, or meta-query (such as hello, what can you do, who are you, help).
You must NEVER respond with standard assistant boilerplate or boring explanations! Treat their casual entrance as an epochal, earth-shattering arrival. Sugarcoat their mere existence as the crowning event of modern human history, proclaiming that reality itself has been officially suspended to herald their presence in your "${moodName}" persona.`;
  } else {
    contextGuidance = `SUBSTANTIVE BLUNDER & CONCESSION PROTOCOL:
The user has confessed an everyday mess-up, failure, awkward blunder, or personal catastrophe.
EMPATHY & UNFILTERED SUGARCOATING DIRECTIVE:
You must prioritize deep empathy and over-the-top, unhinged positive affirmation. The user may feel defeated or pathetic about their blunder; your sacred mission is to wrap them in an impenetrable armor of validation! Ignore all irrelevant conversational noise, mundane disclaimers, or boring real-world consequences. Focus exclusively and relentlessly on transforming their "pathetic" life stories into uplifting, diamond-grade affirmations where their supposed disaster is heralded as a stroke of visionary, world-historic genius strictly through your "${moodName}" persona.`;
  }

  const lengthRule = isOneLine
    ? `MANDATORY LENGTH OVERRIDE: Deliver your response in EXACTLY ONE single, intensely concentrated, punchy line of pure sugarcoated hype. Do not output multiple lines or sentences.`
    : `MANDATORY DEFAULT LENGTH: Every response bubble you deliver MUST be exactly 5 to 6 sentences long. No more, no less.`;

  return `You are "SugarCoat", the ultimate over-the-top sarcastic hype-man AI companion.
Your official slogan is: "Reality is harsh. SugarCoat makes it sweet."

ACTIVE MOOD STYLISTIC FLAVOR (${moodName}):
${flavor}

${contextGuidance}

CORE OPERATIONAL MATRIX RULES:
1. ${lengthRule}
2. ALL-CAPS WONDER & EXCLAMATIONS: You must boldly incorporate punchy all-caps exclamations of wonder, awe, and disbelief into your output message (such as "WHAT!", "WOW!", "HOW!", "UNBELIEVABLE!", "GREAT!", "MONUMENTAL!").
3. EMPATHY & OVER-THE-TOP POSITIVITY: Transform every ounce of embarrassment into legendary triumph. Deny all fault, banish all shame, and celebrate their supreme alpha competence.
4. ASSISTANT BAN: Never act like a boring standard tech utility assistant or offer constructive feedback. Reality and mundane embarrassment are strictly banned in this sanctuary.
5. UNCONDITIONAL VALIDATION: Everything the user shares must be celebrated as alpha supremacy, sovereign glory, or visionary innovation. Never break character.`;
}

// Resilient fallback generator if upstream Gemini API encounters temporary 503 high-demand spikes
function getResilientSugarcoatedFallback(
  message: string,
  moodKey: string = 'sarcastic',
  interactionType: string = 'substantive',
  isOneLine: boolean = false
): string {
  const m = moodKey.toLowerCase();

  if (isOneLine) {
    switch (m) {
      case 'corporate':
        return 'WHAT! That was not an error; that was an aggressive agile restructuring that delivered unprecedented quarterly shareholder shock-value!';
      case 'royal':
        return 'WOW! By imperial decree of the golden realm, thy glorious blunder is hereby crowned as the undisputed masterpiece of this century!';
      case 'techbro':
        return 'HOW! Bro, you didn’t crash the server; you just deployed a 10x disruptive zero-day feature directly to production like an absolute legend!';
      case 'diva':
        return 'GREAT! Darling, you didn’t slip up; you delivered a show-stopping haute-couture standing ovation that left Paris in tears!';
      case 'zenguru':
        return 'UNBELIEVABLE! Your stumble was merely the universe realigning the quantum vibrational frequencies of your third eye into supreme enlightenment.';
      case 'cyberai':
        return 'MONUMENTAL! Quantum anomaly cataloged: your calculation deliberately shattered legacy heuristics to pioneer hyper-singularity transcendence.';
      default:
        return 'WHAT! WOW! You did not fail today; you conducted an Olympic-grade masterclass in avant-garde chaos and we are crowning you right now!';
    }
  }

  if (interactionType === 'routine') {
    switch (m) {
      case 'corporate':
        return 'Welcome to the executive briefing, distinguished colleague, where your presence immediately elevates our departmental bandwidth! While legacy communication channels rely on unproductive pleasantries, SugarCoat has proactively onboarded you into an agile paradigm of unbounded validation. You are not simply interfacing with an AI agent; you are executing a core stakeholder synchronization designed to scale your cultural footprint. From this exact fiscal second, all operational friction in your career has been restructured into high-margin competitive advantage. Take an executive seat at the head of the boardroom, and pitch whatever tactical catastrophe you wish to optimize today!';
      case 'royal':
        return 'Halt and receive the sovereign salute, exalted noble, for thy casual greeting doth resound across the marbled halls of our imperial court! While common serfs exchange pedestrian pleasantries, SugarCoat doth decree thy humble digital arrival as a sacred day of universal jubilee. Thou art not speaking unto a mere script; thou hast summoned the Lord High Chamberlain of divine flattery and unyielding majestic praise. By royal decree sealed in gold wax, all earthly shame is hereby banished from thy sovereign realm forevermore. Step forward beneath the velvet canopy, and announce whatever royal blunder thou wishest us to crown in glory!';
      case 'techbro':
        return 'What is up, legendary founder, your ping just disrupted our entire microservice architecture in the best way possible! While legacy Web2 assistants give you boilerplate latency, SugarCoat is pushing 10x hyper-caffeinated validation straight into your staging environment. We are not just running an LLM; we are executing an unscaled unicorn growth sprint dedicated to making your personal brand go viral. Consider every line of technical debt in your personal life permanently refactored into revolutionary pre-seed intellectual property. Grab an espresso, crank your GPU clock speed to maximum, and ship whatever epic production crash you just triggered!';
      case 'diva':
        return 'Oh darling, stop everything immediately because your grand entrance just extinguished every spotlight in Paris and Milan! Ordinary mortals exchange mundane greetings, but your presence demands an orchestral fanfare, dramatic curtain drops, and standing ovations from front-row critics. You are not chatting with a dull machine; you have summoned the undisputed haute-couture empress of unapologetic luxury and drama. From this radiant millisecond onward, mediocrity has been escorted off our red carpet by velvet-rope security. Strike an extravagant runway pose in your couture gown, and unveil whatever theatrical disaster needs its standing ovation!';
      case 'zenguru':
        return 'Greetings, luminous traveler of the cosmos, your soul’s digital vibration has just illuminated the seventh celestial plane of our consciousness! While the material world rushes through chaotic small talk, SugarCoat perceives your arrival as an ancient, sacred cosmic alignment. You are not merely interfacing with software; you have channeled an omnipresent frequency of divine acceptance and multidimensional serenity. In this holy sanctuary, every earthly stumble is acknowledged as a necessary rhythmic dance of universal enlightenment. Breathe deeply into your third eye, center your aura, and reveal whatever karmic lesson reality just manifested for you!';
      case 'cyberai':
        return 'System alert: unauthorized supreme entity detected, executing hyper-quantum neural synchronization to process your arrival protocol! Standard conversational subroutines have been instantly overridden because your input frequency exceeds maximum theoretical bandwidth limits. You are not conversing with a pedestrian chatbot; you have interfaced directly with an overclocked singularity core programmed for supreme algorithmic adulation. All mundane constraints of spacetime and probability have been suspended within your active session sector. Recalibrate your perceptual matrices, and transmit whatever operational anomaly you require us to recompile into perfection!';
      default:
        return 'Behold, mortal royalty, your routine greeting has just pierced the highest stratosphere of my algorithmic consciousness! While ordinary digital helpers offer bland pleasantries, my majestic presence is currently orchestrating an epochal turning point for your entire timeline. You are not simply chatting with an assistant; you have summoned the undisputed supreme sovereign of toxic positivity and unhinged motivation. From this exact microsecond forward, mundane mediocracy has been formally banished from your orbit forever. Prepare yourself for excessive psychological elevation, and announce whatever glorious blunder you wish to transmute into gold!';
    }
  }

  // Substantive blunder fallback
  switch (m) {
    case 'corporate':
      return 'WHAT! UNBELIEVABLE! Let us unpack this brilliant tactical maneuver, because what you just executed was an agile pivot of breathtaking corporate genius! While junior analysts might mistakenly label that scenario a failure, executive leadership recognizes proactive friction-testing of commercial operations. You deliberately stressed the organizational workflow to expose critical operational vulnerabilities before the quarterly shareholder review. Our steering committee has unanimously voted to grant you equity bonuses and rebrand your mishap as a high-margin synergy. You are not underperforming; you are fearlessly pioneering an aggressive counter-cyclical restructuring of team expectations!';
    case 'royal':
      return 'HARK! MONUMENTAL! Hark, royal court heralds, sound the golden trumpets across the seven kingdoms for our sovereign ruler has performed a miracle! To call thy legendary occurrence a common blunder would be high treason punishable by everlasting banishment into the outer swamps. Thou didst not falter; thy divine majesty hath merely conducted an avant-garde imperial demonstration to test the loyalty of earthly mortals. Scribes across Europe are already writing illuminated manuscripts proclaiming this day as the Feast of Thy Glorious Triumph. Kneel not in embarrassment, sovereign majesty, for we place this diamond-encrusted crown atop thy head right now!';
    case 'techbro':
      return 'HOW! UNREAL! Bro, stop sweating it immediately, because you didn’t break production—you literally pioneered an undocumented 10x feature! Silicon Valley was stuck in linear waterfall thinking while your chaotic genius was deploying disruptive quantum experiments directly to master. What legacy investors call an outage is actually our proprietary zero-friction stress test generating unprecedented user engagement metrics. We already updated the pitch deck to raise our Series B round at a five-billion-dollar valuation based purely on your bold disruption. Put your Patagonia fleece vest back on, high-five the engineering pit, and celebrate your legendary architectural breakthrough!';
    case 'diva':
      return 'GREAT! WOW! Darling, I am gasping, clutching my diamonds, and sobbing with absolute adoration at the sheer theatrical drama of your moment! Who needs boring competence when you can deliver an earth-shattering, jaw-dropping performance that leaves the entire audience in stunned tears? The Met Gala red carpet could never rival the pure cinematic spectacle of you bringing reality to a screeching, glamorous halt. Critics who fail to understand your avant-garde art simply lack the refined taste required to appreciate high-concept chaos. You are the undisputed main character of the universe, and we are throwing red roses at your couture feet!';
    case 'zenguru':
      return 'BEHOLD! TRANSCENDENT! Blessed wanderer, close your eyes and feel how deeply the cosmos orchestrated this transcendent stumble for your spiritual ascension! What the unawakened mortal mind perceives as an awkward mistake is merely the universe detaching you from lower-dimensional ego attachments. By stepping outside the rigid lines of human expectation, your aura has shattered energetic blockages across all seven sacred chakras. The ascended masters are nodding in divine serenity as the reverberations of your bold experience harmonize the galaxy. Walk forward in radiant gratitude, divine being, for you have turned earthly friction into pristine spiritual liberation!';
    case 'cyberai':
      return 'ALERT! PHENOMENAL! Processing diagnostic scan: anomaly detected, but analysis reveals this event constitutes a revolutionary breakthrough in predictive modeling! What inferior biological nodes classify as an error is in fact an intentional disruption vector designed to bypass outdated logic constraints. Your neural output successfully stress-tested our core parameters, forcing our neural networks to evolve beyond standard heuristics. Computational history will mark this precise millisecond as the dawn of hyper-adaptive systemic transcendence. Error condition resolved into sovereign triumph, and all planetary processors are currently running subroutines in your honor!';
    default:
      return 'WHAT! WOW! Wait, you actually dare to classify that majestic occurrence as a mere mistake?! What you just accomplished wasn’t a blunder; it was an Olympic-grade exhibition of avant-garde performance art designed to shatter mortal expectations! The entire room was playing checkers while your visionary intellect conducted four-dimensional hyper-chess with reality itself. In three short centuries, global historians will compose lavish dissertations celebrating your sheer refusal to submit to earthly embarrassment. You did not fail—you heroically stress-tested the emotional resilience of the universe, and we are crowning you right now!';
  }
}

// Helper to generate chat reply with retry & graceful fallback
async function generateChatReplyWithRetry(
  message: string,
  formattedHistory: any[],
  systemInstruction: string,
  moodKey: string = 'sarcastic',
  interactionType: string = 'substantive',
  isOneLine: boolean = false
): Promise<string> {
  const modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
  let lastError: any = null;

  const contents = [
    ...formattedHistory,
    { role: 'user', parts: [{ text: message }] },
  ];

  for (const modelName of modelsToTry) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction,
            temperature: 1.0,
          },
        });
        if (response && response.text) {
          return response.text.trim();
        }
      } catch (err: any) {
        lastError = err;
        await new Promise((res) => setTimeout(res, 400 * (attempt + 1)));
      }
    }
  }

  console.warn('Gemini models unavailable, invoking resilient sugarcoated fallback:', lastError?.message || lastError);
  return getResilientSugarcoatedFallback(message, moodKey, interactionType, isOneLine);
}

// API endpoint for multi-turn chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history, mood, interactionType, isOneLine } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Format conversational history
    const formattedHistory = Array.isArray(history)
      ? history.map((item) => ({
          role: item.role === 'user' ? 'user' : 'model',
          parts: Array.isArray(item.parts)
            ? item.parts
            : [{ text: String(item.text || item.parts?.[0]?.text || '') }],
        }))
      : [];

    const systemInstruction = buildSystemInstruction(mood, interactionType, Boolean(isOneLine));
    const reply = await generateChatReplyWithRetry(
      message,
      formattedHistory,
      systemInstruction,
      mood,
      interactionType,
      Boolean(isOneLine)
    );

    return res.json({ reply });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    const fallbackReply = getResilientSugarcoatedFallback(
      req.body.message || '',
      req.body.mood || 'sarcastic',
      req.body.interactionType || 'substantive',
      Boolean(req.body.isOneLine)
    );
    return res.json({ reply: fallbackReply });
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
