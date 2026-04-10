import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

function formatDisplayTime(timeStr: string): string {
  if (timeStr.toLowerCase() === 'now') return 'Right Now'
  if (timeStr.toLowerCase() === 'noon') return '12:00 PM'
  if (timeStr.toLowerCase() === 'midnight') return '12:00 AM'
  const ampm = timeStr.match(/^(\d{1,2})(?::(\d{2}))?(am|pm)$/i)
  if (ampm) {
    const h = ampm[1]
    const m = ampm[2] ? `:${ampm[2]}` : ''
    const period = ampm[3].toUpperCase()
    return `${h}${m} ${period}`
  }
  return timeStr.toUpperCase()
}

export function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const time = searchParams.get('time') || ''
  const zone = searchParams.get('zone') || ''
  const isNow = time.toLowerCase() === 'now'
  const displayTime = formatDisplayTime(time)
  const displayZone = zone.replace(/_/g, ' ').replace(/\//g, ' / ')

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
          padding: '64px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: 40, height: 40, borderRadius: '10px',
            background: '#6C63FF', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: 20,
          }}>
            🌐
          </div>
          <span style={{ fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>
            tym.zone
          </span>
        </div>

        {/* Main time */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontSize: 20, color: '#555', fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase' }}>
            {isNow ? 'Current time in' : 'Shared time in'}
          </div>
          <div style={{ fontSize: 88, fontWeight: 800, color: '#6C63FF', lineHeight: 1, letterSpacing: '-3px' }}>
            {displayTime}
          </div>
          <div style={{ fontSize: 38, color: '#ccc', fontWeight: 500 }}>
            {displayZone}
          </div>
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            background: '#1a1a1a', border: '1px solid #2a2a2a',
            borderRadius: '12px', padding: '16px 24px',
          }}>
            <span style={{ fontSize: 20, color: '#888' }}>
              Click to see this in YOUR timezone →
            </span>
          </div>
          <div style={{
            background: '#6C63FF', borderRadius: '12px',
            padding: '16px 32px', fontSize: 20, color: '#fff', fontWeight: 600,
          }}>
            Open link
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
