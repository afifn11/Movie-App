export default function handler(req, res) {
  const mask = (val) => {
    if (!val) return null;
    if (val.length <= 8) return '***';
    return `${val.slice(0, 6)}...${val.slice(-4)} (len:${val.length})`;
  };

  return res.status(200).json({
    NODE_ENV: process.env.NODE_ENV || null,
    VERCEL_ENV: process.env.VERCEL_ENV || null, // "production" / "preview" / "development"
    GEMINI_API_KEY: {
      exists: !!process.env.GEMINI_API_KEY,
      preview: mask(process.env.GEMINI_API_KEY),
    },
    SUPABASE_URL: {
      exists: !!(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL),
      source: process.env.SUPABASE_URL ? 'SUPABASE_URL' : (process.env.VITE_SUPABASE_URL ? 'VITE_SUPABASE_URL' : null),
    },
    SUPABASE_ANON_KEY: {
      exists: !!(process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY),
      source: process.env.SUPABASE_ANON_KEY ? 'SUPABASE_ANON_KEY' : (process.env.VITE_SUPABASE_ANON_KEY ? 'VITE_SUPABASE_ANON_KEY' : null),
    },
  });
}