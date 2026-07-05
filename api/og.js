import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

export default async function handler() {
  return new ImageResponse(
    {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          width: '1200px',
          height: '630px',
          background: '#e8b84b',
          color: '#000000',
          fontSize: 60,
        },
        children: 'HELLO OG',
      },
    },
    { width: 1200, height: 630 }
  );
}