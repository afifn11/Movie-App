import { GoogleGenerativeAI } from '@google/generative-ai';

// Inisialisasi SDK Gemini di sisi server menggunakan environment variable terenkripsi
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// Fungsi sterilisasi untuk mencegah prompt injection
const sanitize = (str) => {
  return String(str ?? '')
    .replace(/[\r\n\t]/g, ' ')
    .trim()
    .slice(0, 1000);
};

export default async function handler(req, res) {
  // Hanya menerima metode POST demi keamanan data
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { action, payload } = req.body;

  try {
    // ─── 1. Fitur Chat Contekstual ──────────────────────────────────────
    if (action === 'chat') {
      const { movie, question, history = [] } = payload;
      
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

      const chatSession = model.startChat({
        history: formattedHistory,
        systemInstruction: systemContext,
      });

      const result = await chatSession.sendMessage(`<user_question>${sanitize(question)}</user_question>`);
      return res.status(200).json({ result: result.response.text() });
    }

    // ─── 2. Fitur Enhance Review Assistant ──────────────────────────────
    if (action === 'enhanceReview') {
      const { movieTitle, rating, draftReview, genres } = payload;
      
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

      const result = await model.generateContent(prompt);
      return res.status(200).json({ result: result.response.text() });
    }

    // ─── 3. Fitur Mood-based Discovery ──────────────────────────────────
    if (action === 'getMood') {
      const { mood, timeAvailable, watchedTitles = [] } = payload;
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

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const cleanJsonText = text.replace(/```json|```/g, '').trim();
      
      return res.status(200).json({ result: JSON.parse(cleanJsonText) });
    }

    // ─── 4. Fitur Rekomendasi Personal ──────────────────────────────────
    if (action === 'getPersonal') {
      const { watchlist, reviews, watchHistory } = payload;
      
      const topRated = reviews
        .filter((r) => r.rating >= 7)
        .map((r) => `${sanitize(r.movie_title)} (rated ${r.rating}/10)`)
        .slice(0, 10);

      const recentlyWatched = watchHistory
        .slice(0, 8)
        .map((h) => sanitize(h.movie_title));

      const watchlistTitles = watchlist
        .slice(0, 8)
        .map((w) => sanitize(w.movie_title));

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

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const cleanJsonText = text.replace(/```json|```/g, '').trim();
      
      return res.status(200).json({ result: JSON.parse(cleanJsonText) });
    }

    return res.status(400).json({ error: 'Invalid backend action requested' });
  } catch (error) {
    console.error('Server Serverless Error:', error);
    return res.status(500).json({ error: 'AI Service is temporarily unavailable' });
  }
}