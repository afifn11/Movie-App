import { ImageResponse } from '@vercel/og';

function h(type, props = {}, ...children) {
  const flat = children.flat(Infinity).filter((c) => c !== null && c !== undefined && c !== false);
  return { type, props: { ...props, children: flat.length === 1 ? flat[0] : flat } };
}

const STAR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#e8b84b"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>`;
const STAR_DATA_URI = `data:image/svg+xml,${encodeURIComponent(STAR_SVG)}`;

export default {
  async fetch(request) {
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
            },
          },
            h('img', { src: STAR_DATA_URI, width: '22', height: '22' }),
            h('span', { style: { color: '#e8b84b', fontSize: '26px', fontWeight: 700 } }, `${rating}/10`)
          )
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
  },
};