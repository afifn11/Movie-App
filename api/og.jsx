import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

export default async function handler(request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get('title') || 'Netfif Cinema').slice(0, 80);
  const rating = searchParams.get('rating') || null;
  const year = searchParams.get('year') || '';
  const poster = searchParams.get('poster') || '';

  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: '1200px', height: '630px', background: '#080b10', fontFamily: 'sans-serif' }}>
        {poster && (
          <div style={{ display: 'flex', width: '420px', height: '630px', flexShrink: 0 }}>
            <img src={poster} width="420" height="630" style={{ objectFit: 'cover' }} />
          </div>
        )}
        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '60px', flex: 1,
          background: 'linear-gradient(135deg, #0d1117 0%, #080b10 100%)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
            <span style={{ color: '#e8b84b', fontSize: '28px', fontWeight: 700, letterSpacing: '2px' }}>
              NETFIF CINEMA
            </span>
          </div>
          <div style={{ display: 'flex', color: '#fff', fontSize: '56px', fontWeight: 800, lineHeight: 1.1 }}>
            {title}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '28px', gap: '20px' }}>
            {year && <span style={{ color: '#9aa4b2', fontSize: '28px' }}>{year}</span>}
            {rating && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'rgba(232,184,75,0.15)', border: '1px solid rgba(232,184,75,0.4)',
                borderRadius: '999px', padding: '8px 20px',
                color: '#e8b84b', fontSize: '26px', fontWeight: 700,
              }}>
                ★ {rating}/10
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}