import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';

// ─── Env Var Validation (cold-start) ─────────────────────────────────────
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!GEMINI_API_KEY) {
  console.error('[CONFIG ERROR] GEMINI_API_KEY tidak ditemukan di environment variables.');
}
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('[CONFIG ERROR] SUPABASE_URL / SUPABASE_ANON_KEY tidak ditemukan di environment variables.');
}

const ai = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;
const GEMINI_MODEL = 'gemini-2.5-flash';

const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// ─── Rate Limiter ─────────────────────────────────────────────────────────
const rateLimitCache = new Map();
const RATE_LIMIT_WINDOW_MS = 60000;
const MAX_REQUESTS = 15;
const GEMINI_TIMEOUT_MS = 25000;

const sanitize = (str) => {
  return String(str ?? '')
    .replace(/[\r\n\t]/g, ' ')
    .trim()
    .slice(0, 1000);
};

function withTimeout(promise, ms, label) {
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(`TIMEOUT: ${label} exceeded ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timeoutId));
}

function extractJsonSafely(rawText) {
  const stripped = rawText.replace(/```json|```/g, '').trim();
  const firstBracket = Math.min(
    ...['[', '{'].map((c) => {
      const idx = stripped.indexOf(c);
      return idx === -1 ? Infinity : idx;
    })
  );
  const lastBracket = Math.max(stripped.lastIndexOf(']'), stripped.lastIndexOf('}'));

  if (firstBracket === Infinity || lastBracket === -1 || lastBracket < firstBracket) {
    throw new Error('AI response does not contain a parseable JSON structure');
  }

  const candidate = stripped.slice(firstBracket, lastBracket + 1);
  return JSON.parse(candidate);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!ai || !supabase) {
    console.error('[CONFIG ERROR] Handler dipanggil tapi ai/supabase gagal diinisialisasi karena env var hilang.');
    return res.status(500).json({ error: 'Server misconfiguration. Please contact support.' });
  }

  try {
    // ─── 🔒 AUTH GUARD & RATE LIMITING ──────────────────────────────────
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing token' });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    const now = Date.now();
    const userRateData = rateLimitCache.get(user.id) || { count: 0, startTime: now };

    if (now - userRateData.startTime > RATE_LIMIT_WINDOW_MS) {
      userRateData.count = 1;
      userRateData.startTime = now;
    } else {
      userRateData.count += 1;
    }

    rateLimitCache.set(user.id, userRateData);

    if (userRateData.count > MAX_REQUESTS) {
      return res.status(429).json({ error: 'Too Many Requests: Please slow down.' });
    }
    // ───────────────────────────────────────────────────────────────────

    const { action, payload } = req.body || {};
    if (!action || !payload || typeof payload !== 'object') {
      return res.status(400).json({ error: 'Invalid request body: action and payload are required' });
    }

    // ─── 1. Fitur Chat Contekstual ──────────────────────────────────────
    if (action === 'chat') {
      const { movie, question, history = [] } = payload;
      if (!movie || !question) {
        return res.status(400).json({ error: 'Invalid payload: movie and question are required' });
      }

      const systemContext = `You are a knowledgeable and enthusiastic film expert assistant for Cinema App.
The user is currently viewing this movie:
Title: ${movie.title}
Year: ${movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown'}
Overview: ${movie.overview || 'No overview available'}
Genres: ${movie.genres?.map((g) => g.name).join(', ') || 'Unknown'}

Answer in the same language the user used to ask the question.
Be concise (max 3 paragraphs), insightful, and avoid major spoilers unless the user explicitly asks.
If asked about spoilers, warn first then answer.`;

      const formattedHistory = history.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: sanitize(msg.text) }],
      }));

      const chat = ai.chats.create({
        model: GEMINI_MODEL,
        history: formattedHistory,
        config: {
          systemInstruction: systemContext, // string biasa, SDK baru yang urus formatnya
        },
      });

      const result = await withTimeout(
        chat.sendMessage({ message: `<user_question>${sanitize(question)}</user_question>` }),
        GEMINI_TIMEOUT_MS,
        'chat'
      );
      return res.status(200).json({ result: result.text });
    }

    // ─── 2. Fitur Enhance Review Assistant ──────────────────────────────
    if (action === 'enhanceReview') {
      const { movieTitle, rating, draftReview, genres } = payload;
      if (!movieTitle || !draftReview) {
        return res.status(400).json({ error: 'Invalid payload: movieTitle and draftReview are required' });
      }

      const prompt = `You are a thoughtful film critic mentor helping a user write a better movie review.

Movie: "${movieTitle}"
Genres: ${genres || 'Unknown'}
User's rating: ${rating}/10

Your task: Suggest 2-3 specific aspects they could expand on to make their review more insightful.
Don't rewrite their review — give them prompts/questions to think about.

Consider: cinematography, performances, pacing, themes, soundtrack, direction, emotional impact.
Keep suggestions brief and conversational, like a friend who loves film.
Respond in the same language as the user's draft review.
Return as plain text, no markdown.

User's draft review:
<user_draft>${sanitize(draftReview)}</user_draft>`;

      const result = await withTimeout(
        ai.models.generateContent({ model: GEMINI_MODEL, contents: prompt }),
        GEMINI_TIMEOUT_MS,
        'enhanceReview'
      );
      return res.status(200).json({ result: result.text });
    }

    // ─── 3. Fitur Mood-based Discovery ──────────────────────────────────
    if (action === 'getMood') {
      const { mood, timeAvailable, watchedTitles = [] } = payload;
      if (!mood) {
        return res.status(400).json({ error: 'Invalid payload: mood is required' });
      }
      const avoidList = watchedTitles.slice(0, 20).join(', ');

      const prompt = `You are a film curator for Cinema App helping a user pick a movie based on their mood.

Time available: ${timeAvailable || 'flexible'}
Films they've already watched (avoid recommending these): ${avoidList || 'none specified'}

Suggest exactly 5 films that perfectly match the mood specified inside the XML tag below.
Think creatively — consider the emotional journey the user needs right now.

User's current mood/feeling:
<user_mood>${sanitize(mood)}</user_mood>

Return ONLY a valid JSON array (no markdown, no explanation):
[
  {
    "title": "Exact Film Title in English",
    "year": 2020,
    "runtime": "2h 15m",
    "mood_match": "One sentence on why this fits the mood perfectly",
    "vibe": "One evocative word or short phrase describing the film's atmosphere",
    "searchQuery": "exact english film title"
  }
]

IMPORTANT: "searchQuery" must be the exact English title of the film as it appears on TMDB.`;

      const result = await withTimeout(
        ai.models.generateContent({ model: GEMINI_MODEL, contents: prompt }),
        GEMINI_TIMEOUT_MS,
        'getMood'
      );
      const text = result.text.trim();

      try {
        const parsed = extractJsonSafely(text);
        return res.status(200).json({ result: parsed });
      } catch (parseErr) {
        console.error('[getMood] JSON parse failed:', parseErr.message, '| raw:', text.slice(0, 300));
        return res.status(502).json({ error: 'AI returned an unexpected format. Please try again.' });
      }
    }

    // ─── 4. Fitur Rekomendasi Personal ──────────────────────────────────
    if (action === 'getPersonal') {
      const { watchlist = [], reviews = [], watchHistory = [] } = payload;

      const topRated = reviews
        .filter((r) => r.rating >= 7)
        .map((r) => `${sanitize(r.movie_title)} (rated ${r.rating}/10)`)
        .slice(0, 10);

      const recentlyWatched = watchHistory.slice(0, 8).map((h) => sanitize(h.movie_title));
      const watchlistTitles = watchlist.slice(0, 8).map((w) => sanitize(w.movie_title));

      if (topRated.length === 0 && recentlyWatched.length === 0) {
        return res.status(200).json({ result: null });
      }

      const prompt = `You are a film recommendation expert for Cinema App with deep knowledge of cinema.

Based on this user's taste profile:
Top rated films: ${topRated.length > 0 ? topRated.join(', ') : 'none yet'}
Recently watched: ${recentlyWatched.length > 0 ? recentlyWatched.join(', ') : 'none yet'}
Watchlist: ${watchlistTitles.length > 0 ? watchlistTitles.join(', ') : 'empty'}

Analyze their taste deeply — look for patterns in themes, tone, directors, cinematography style, narrative complexity.

Return ONLY a valid JSON array (no markdown, no explanation) with exactly 6 recommendations:
[
  {
    "title": "Exact Film Title as known internationally",
    "year": 2023,
    "reason": "2-3 sentence explanation of why this specifically matches their taste",
    "searchQuery": "exact film title"
  }
]

IMPORTANT: "searchQuery" must be the exact English title of the film as it appears on TMDB.
Recommend films they likely haven't seen. Avoid obvious mainstream blockbusters unless truly fitting.`;

      const result = await withTimeout(
        ai.models.generateContent({ model: GEMINI_MODEL, contents: prompt }),
        GEMINI_TIMEOUT_MS,
        'getPersonal'
      );
      const text = result.text.trim();

      try {
        const parsed = extractJsonSafely(text);
        return res.status(200).json({ result: parsed });
      } catch (parseErr) {
        console.error('[getPersonal] JSON parse failed:', parseErr.message, '| raw:', text.slice(0, 300));
        return res.status(502).json({ error: 'AI returned an unexpected format. Please try again.' });
      }
    }

    return res.status(400).json({ error: 'Invalid backend action requested' });
  } catch (error) {
    const isTimeout = error?.message?.startsWith('TIMEOUT');
    console.error('Server Serverless Error:', error);
    return res.status(isTimeout ? 504 : 500).json({
      error: isTimeout ? 'AI Service took too long to respond. Please try again.' : 'AI Service is temporarily unavailable',
    });
  }
}