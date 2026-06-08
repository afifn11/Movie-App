async function fetchFromBackendAI(action, payload) {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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

// ─── 4. Rekomendasi hyper-personal (Fungsi yang sebelumnya terlewat) ───
export async function getPersonalRecommendations({ watchlist, reviews, watchHistory }) {
  return fetchFromBackendAI('getPersonal', { watchlist, reviews, watchHistory });
}