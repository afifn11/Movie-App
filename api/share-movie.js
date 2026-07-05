const TMDB_TOKEN = process.env.VITE_TMDB_READ_TOKEN || process.env.TMDB_READ_TOKEN;
const SITE_URL = 'https://netfif-cinema.vercel.app';

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id || !/^\d+$/.test(id)) {
    res.status(400).send('Invalid movie id');
    return;
  }
  if (!TMDB_TOKEN) {
    console.error('[CONFIG ERROR] TMDB token missing for share-movie endpoint');
    res.status(500).send('Server misconfiguration');
    return;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    const tmdbRes = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, {
      headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!tmdbRes.ok) {
      res.status(404).send('Movie not found');
      return;
    }

    const movie = await tmdbRes.json();
    const title = escapeHtml(movie.title);
    const year = movie.release_date ? new Date(movie.release_date).getFullYear() : '';
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null;
    const overview = escapeHtml((movie.overview || '').slice(0, 200));
    const poster = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '';
    const pageUrl = `${SITE_URL}/movie/${id}`;
    const ogImageUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(movie.title)}&year=${encodeURIComponent(year)}&rating=${encodeURIComponent(rating || '')}&poster=${encodeURIComponent(poster)}`;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Movie',
      name: movie.title,
      description: movie.overview || undefined,
      datePublished: movie.release_date || undefined,
      image: poster || undefined,
      aggregateRating: movie.vote_average ? {
        '@type': 'AggregateRating',
        ratingValue: movie.vote_average,
        bestRating: '10',
        ratingCount: movie.vote_count || 1,
      } : undefined,
    };

    const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}${year ? ` (${year})` : ''} — Netfif Cinema</title>
<meta name="description" content="${overview}" />
<link rel="canonical" href="${pageUrl}" />

<meta property="og:type" content="video.movie" />
<meta property="og:title" content="${title}${year ? ` (${year})` : ''}" />
<meta property="og:description" content="${overview}" />
<meta property="og:image" content="${ogImageUrl}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:url" content="${pageUrl}" />
<meta property="og:site_name" content="Netfif Cinema" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title}${year ? ` (${year})` : ''}" />
<meta name="twitter:description" content="${overview}" />
<meta name="twitter:image" content="${ogImageUrl}" />

<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>

<meta http-equiv="refresh" content="0;url=${pageUrl}" />
</head>
<body>
<p>Redirecting to <a href="${pageUrl}">${title}</a> on Netfif Cinema...</p>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    res.status(200).send(html);
  } catch (err) {
    console.error('share-movie error:', err);
    res.status(500).send('Something went wrong');
  }
}