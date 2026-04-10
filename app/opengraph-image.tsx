import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'tym.zone - Share time without timezone drama'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0f0f0f',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '72px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '12px',
            background: '#6C63FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
          }}>
            🌐
          </div>
          <span style={{ fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>
            tym.zone
          </span>
        </div>

        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontSize: 64, fontWeight: 800, color: '#fff', lineHeight: 1.1, letterSpacing: '-2px' }}>
            Share time,<br />
            <span style={{ color: '#6C63FF' }}>not confusion.</span>
          </div>
          <div style={{ fontSize: 26, color: '#888', fontWeight: 400, maxWidth: 640 }}>
            One link. Everyone sees the meeting time in their own timezone.
          </div>
        </div>

        {/* Example URL */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          background: '#1a1a1a',
          border: '1px solid #2a2a2a',
          borderRadius: '14px',
          padding: '18px 28px',
        }}>
          <span style={{ fontSize: 22, color: '#555' }}>🔗</span>
          <span style={{ fontSize: 24, color: '#6C63FF', fontFamily: 'monospace' }}>
            tym.zone/new_york/2pm
          </span>
          <span style={{ fontSize: 20, color: '#444', marginLeft: 12 }}>→ everyone sees their local time</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
