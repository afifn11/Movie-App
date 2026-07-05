import { supabase } from './supabase';

const REQUEST_TIMEOUT_MS = 30000;

async function fetchFromBackendAI(action, payload) {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error || !session) {
    throw new Error('Authentication required: You must be logged in to use AI features.');
  }

  const token = session.access_token;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response;
  try {
    response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ action, payload }),
      signal: controller.signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw new Error('Network error: could not reach AI service.');
  } finally {
    clearTimeout(timeoutId);
  }

  let data;
  try {
    data = await response.json();
  } catch {
    // Response bukan JSON valid (misal HTML error page dari platform)
    throw new Error(`AI service returned an unexpected response (status ${response.status}).`);
  }

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch AI response');
  }

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

// ─── 5. Smart Filter (natural language → filter params)
export async function parseNaturalLanguageFilter(query) {
  return fetchFromBackendAI('parseFilter', { query, currentYear: new Date().getFullYear() });
}