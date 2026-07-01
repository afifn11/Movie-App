import { movieService, IMG } from '../services/movieService';

/**
 * Mengambil array hasil rekomendasi Gemini dan memperkayanya (enrich)
 * dengan data aktual dari TMDB (Poster, ID, Rating) menggunakan 1 kueri per film.
 */
export async function enrichWithTmdbPoster(aiRecs) {
  if (!aiRecs || !Array.isArray(aiRecs)) return [];

  return Promise.all(
    aiRecs.map(async (rec) => {
      try {
        // Menggunakan searchQuery (judul akurat) dari AI, atau kombinasi title+year sebagai fallback
        const queryToUse = rec.searchQuery || `${rec.title} ${rec.year || ''}`.trim();
        const data = await movieService.search(queryToUse, 1);
        const match = data.results[0];

        return {
          ...rec,
          tmdbId: match?.id || null,
          poster: match?.poster_path ? IMG.posterSm(match.poster_path) : null,
          tmdbRating: match?.vote_average ? match.vote_average.toFixed(1) : null,
        };
      } catch (err) {
        console.warn(`TMDB enrichment failed for ${rec.title}:`, err);
        return { ...rec, tmdbId: null, poster: null, tmdbRating: null };
      }
    })
  );
}