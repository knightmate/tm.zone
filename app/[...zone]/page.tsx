import type { Metadata } from 'next'
import ReceiverClient from './ReceiverClient'

interface PageProps {
  params: { zone: string[] }
}

function formatDisplayTime(timeStr: string): string {
  if (timeStr.toLowerCase() === 'now') return 'right now'
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

export function generateMetadata({ params }: PageProps): Metadata {
  const parts = params.zone
  const timeStr = parts.at(-1) || ''
  const zoneRaw = parts.slice(0, -1).join('/').replace(/_/g, ' ')
  const displayTime = formatDisplayTime(timeStr)
  const isNow = timeStr.toLowerCase() === 'now'

  const title = isNow
    ? `Current time in ${zoneRaw} · tym.zone`
    : `${displayTime} in ${zoneRaw} · tym.zone`

  const description = isNow
    ? `Click to see what time it is right now in ${zoneRaw}, converted to your timezone.`
    : `${displayTime} in ${zoneRaw}. Click to see this time converted to your local timezone.`

  const ogImage = `https://tym.zone/api/og?time=${encodeURIComponent(timeStr)}&zone=${encodeURIComponent(parts.slice(0, -1).join('/'))}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://tym.zone/${parts.join('/')}`,
      siteName: 'tym.zone',
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default function Page({ params }: PageProps) {
  return <ReceiverClient params={params} />
}
