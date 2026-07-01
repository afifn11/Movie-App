import { supabase } from './supabase';

async function fetchFromBackendAI(action, payload) {
  // 🛡️ 1. Ambil token sesi pengguna saat ini dari Supabase
  const { data: { session }, error } = await supabase.auth.getSession();

  // 🛡️ 2. Cegah request jika user belum login (menghemat bandwidth dan menghindari 401 log)
  if (error || !session) {
    throw new Error('Authentication required: You must be logged in to use AI features.');
  }

  const token = session.access_token;

  // 🛡️ 3. Kirim request dengan header Authorization
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Suntikkan token JWT ke sini
    },
    body: JSON.stringify({ action, payload }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch AI response');
  }

  const data = await response.json();
  return data.result;
}

// ─── 1. AI Chat ────────────────────────────────────────────────────────
export async function chatAboutMovie(movie, question, history = []) {
  return fetchFromBackendAI('chat', { movie, question, history });
}

// ─── 2. Smart Review Assistant ─────────────────────────────────────────
export async function enhanceReview({ movieTitle, rating, draftReview, genres }) {
  return fetchFromBackendAI('enhanceReview', { movieTitle, rating, draftReview, genres });
}

// ─── 3. Mood-based Discovery ───────────────────────────────────────────
export async function getMoodRecommendations({ mood, timeAvailable, watchedTitles = [] }) {
  return fetchFromBackendAI('getMood', { mood, timeAvailable, watchedTitles });
}

// ─── 4. Rekomendasi hyper-personal ─────────────────────────────────────
export async function getPersonalRecommendations({ watchlist, reviews, watchHistory }) {
  return fetchFromBackendAI('getPersonal', { watchlist, reviews, watchHistory });
}