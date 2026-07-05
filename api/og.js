import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

function h(type, props = {}, ...children) {
  const flat = children.flat(Infinity).filter((c) => c !== null && c !== undefined && c !== false);
  return { type, props: { ...props, children: flat.length === 1 ? flat[0] : flat } };
}

export default async function handler(request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = (searchParams.get('title') || 'Netfif Cinema').slice(0, 80);
    const rating = searchParams.get('rating') || null;
    const year = searchParams.get('year') || '';
    const poster = searchParams.get('poster') || '';

    const posterEl = poster
      ? h('div', { style: { display: 'flex', width: '420px', height: '630px', flexShrink: 0 } },
          h('img', { src: poster, width: '420', height: '630', style: { objectFit: 'cover' } }))
      : null;

    const yearEl = year ? h('span', { style: { color: '#9aa4b2', fontSize: '28px' } }, year) : null;

    const ratingEl = rating
      ? h('div', {
          style: {
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(232,184,75,0.15)', border: '1px solid rgba(232,184,75,0.4)',
            borderRadius: '999px', padding: '8px 20px',
            color: '#e8b84b', fontSize: '26px', fontWeight: 700,
          },
        }, `★ ${rating}/10`)
      : null;

    const element = h('div', { style: { display: 'flex', width: '1200px', height: '630px', background: '#080b10', fontFamily: 'sans-serif' } },
      posterEl,
      h('div', {
        style: {
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '60px', flex: 1,
          background: 'linear-gradient(135deg, #0d1117 0%, #080b10 100%)',
        },
      },
        h('div', { style: { display: 'flex', alignItems: 'center', marginBottom: '24px' } },
          h('span', { style: { color: '#e8b84b', fontSize: '28px', fontWeight: 700, letterSpacing: '2px' } }, 'NETFIF CINEMA')
        ),
        h('div', { style: { display: 'flex', color: '#fff', fontSize: '56px', fontWeight: 800, lineHeight: 1.1 } }, title),
        h('div', { style: { display: 'flex', alignItems: 'center', marginTop: '28px', gap: '20px' } }, yearEl, ratingEl)
      )
    );

    return new ImageResponse(element, { width: 1200, height: 630 });
  } catch (err) {

    return new Response(`OG Image Error: ${err.message}\n\nStack:\n${err.stack}`, {
      status: 500,
      headers: { 'content-type': 'text/plain' },
    });
  }
}