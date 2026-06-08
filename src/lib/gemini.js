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

export async function chatAboutMovie(movie, question, history = []) {
  return fetchFromBackendAI('chat', { movie, question, history });
}

export async function enhanceReview({ movieTitle, rating, draftReview, genres }) {
  return fetchFromBackendAI('enhanceReview', { movieTitle, rating, draftReview, genres });
}

export async function getMoodRecommendations({ mood, timeAvailable, watchedTitles = [] }) {
  return fetchFromBackendAI('getMood', { mood, timeAvailable, watchedTitles });
}