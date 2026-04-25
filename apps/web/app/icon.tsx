import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import path from 'path';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default function Icon() {
  const iconData = readFileSync(path.join(process.cwd(), 'public/icon-primary.png'));

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
        }}
      >
        <img
          src={`data:image/png;base64,${iconData.toString('base64')}`}
          style={{ objectFit: 'contain', width: '112%', height: '112%' }}
        />
      </div>
    ),
    { ...size }
  );
}