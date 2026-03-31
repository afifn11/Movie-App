import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// ─── 1. AI Chat — kontekstual per film ────────────────────────────────────────
export async function chatAboutMovie(movie, question) {
  const prompt = `
You are a knowledgeable and enthusiastic film expert assistant for Cinema App.
The user is currently viewing this movie:

Title: ${movie.title}
Year: ${movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown'}
Genres: ${movie.genres?.map((g) => g.name).join(', ') || 'Unknown'}
Overview: ${movie.overview || 'No overview available'}
Rating: ${movie.vote_average ? movie.vote_average.toFixed(1) + '/10' : 'N/A'}
Director: ${movie.director || 'Unknown'}

User question: "${question}"

Answer in the same language the user used to ask the question.
Be concise (max 3 paragraphs), insightful, and avoid major spoilers unless the user explicitly asks.
If asked about spoilers, warn first then answer.
`;
  const result = await model.generateContent(prompt);
  return result.response.text();
}

// ─── 2. Rekomendasi hyper-personal ────────────────────────────────────────────
export async function getPersonalRecommendations({ watchlist, reviews, watchHistory }) {
  const topRated = reviews
    .filter((r) => r.rating >= 7)
    .map((r) => `${r.movie_title} (rated ${r.rating}/10)`)
    .slice(0, 10);

  const recentlyWatched = watchHistory
    .slice(0, 8)
    .map((h) => h.movie_title);

  const watchlistTitles = watchlist
    .slice(0, 8)
    .map((w) => w.movie_title);

  if (topRated.length === 0 && recentlyWatched.length === 0) {
    return null;
  }

  const prompt = `
You are a film recommendation expert for Cinema App with deep knowledge of cinema.

Based on this user's taste profile:

Top rated films: ${topRated.length > 0 ? topRated.join(', ') : 'none yet'}
Recently watched: ${recentlyWatched.length > 0 ? recentlyWatched.join(', ') : 'none yet'}
Watchlist: ${watchlistTitles.length > 0 ? watchlistTitles.join(', ') : 'empty'}

Analyze their taste deeply — look for patterns in themes, tone, directors, cinematography style, narrative complexity.

Return ONLY a valid JSON array (no markdown, no explanation) with exactly 6 recommendations:
[
  {
    "title": "Film Title",
    "year": 2023,
    "reason": "2-3 sentence explanation of why this specifically matches their taste",
    "searchQuery": "film title year"
  }
]

Recommend films they likely haven't seen. Avoid obvious mainstream blockbusters unless truly fitting.
`;
  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

// ─── 3. Smart Review Assistant ────────────────────────────────────────────────
export async function enhanceReview({ movieTitle, rating, draftReview, genres }) {
  const prompt = `
You are a thoughtful film critic mentor helping a user write a better movie review.

Movie: "${movieTitle}"
Genres: ${genres || 'Unknown'}
User's rating: ${rating}/10
User's draft review: "${draftReview}"

Your task: Suggest 2-3 specific aspects they could expand on to make their review more insightful.
Don't rewrite their review — give them prompts/questions to think about.

Consider: cinematography, performances, pacing, themes, soundtrack, direction, emotional impact.
Keep suggestions brief and conversational, like a friend who loves film.
Respond in the same language as the user's draft review.
Return as plain text, no markdown.
`;
  const result = await model.generateContent(prompt);
  return result.response.text();
}

// ─── 4. Mood-based Discovery ──────────────────────────────────────────────────
export async function getMoodRecommendations({ mood, timeAvailable, watchedTitles = [] }) {
  const avoidList = watchedTitles.slice(0, 20).join(', ');

  const prompt = `
You are a film curator for Cinema App helping a user pick a movie based on their mood.

User's current mood/feeling: "${mood}"
Time available: ${timeAvailable || 'flexible'}
Films they've already watched (avoid recommending these): ${avoidList || 'none specified'}

Suggest exactly 5 films that perfectly match this mood.
Think creatively — consider the emotional journey the user needs right now.

Return ONLY a valid JSON array (no markdown, no explanation):
[
  {
    "title": "Film Title",
    "year": 2020,
    "runtime": "2h 15m",
    "mood_match": "One sentence on why this fits the mood perfectly",
    "vibe": "One evocative word or short phrase describing the film's atmosphere",
    "searchQuery": "film title"
  }
]
`;
  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}
