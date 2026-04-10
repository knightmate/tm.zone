'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './receiver.module.css'
import { getUtcZones } from '@knightmate/tzmap'

interface PageProps {
  params: {
    zone: string[]
  }
}

function resolveIANA(raw: string): string {
  const key = raw.toUpperCase().replace(/[\s-]/g, '')
  const zones = getUtcZones(key)
  if (zones.length > 0) return zones[0]
  return raw
}

// Parse time string into 24-hour {hours, minutes}, or null if invalid.
// Supports: "4pm", "4:30pm", "9am", "1500", "14:30", "noon", "midnight"
function parseTime(t: string): { hours: number; minutes: number } | null {
  if (t.toLowerCase() === 'noon')     return { hours: 12, minutes: 0 }
  if (t.toLowerCase() === 'midnight') return { hours: 0,  minutes: 0 }
  // 12-hour: 3pm, 4:30am, 12pm
  const ampmMatch = t.match(/^(\d{1,2})(?::(\d{2}))?(am|pm)$/i)
  if (ampmMatch) {
    let hours = parseInt(ampmMatch[1])
    const minutes = parseInt(ampmMatch[2] || '0')
    const ampm = ampmMatch[3].toLowerCase()
    if (ampm === 'pm' && hours !== 12) hours += 12
    if (ampm === 'am' && hours === 12) hours = 0
    if (hours > 23 || minutes > 59) return null
    return { hours, minutes }
  }

  // 24-hour compact: 1500, 0900
  const compactMatch = t.match(/^(\d{3,4})$/)
  if (compactMatch) {
    const num = parseInt(compactMatch[1])
    const hours = Math.floor(num / 100)
    const minutes = num % 100
    if (hours > 23 || minutes > 59) return null
    return { hours, minutes }
  }

  // 24-hour colon: 14:30, 09:00
  const colonMatch = t.match(/^(\d{1,2}):(\d{2})$/)
  if (colonMatch) {
    const hours = parseInt(colonMatch[1])
    const minutes = parseInt(colonMatch[2])
    if (hours > 23 || minutes > 59) return null
    return { hours, minutes }
  }

  return null
}

// Calculate UTC offset in minutes for a given IANA timezone
// Uses fixed date (2024-06-15) to get consistent offset regardless of DST
function getSenderUTCOffset(iana: string): number {
  const date = new Date('2024-06-15T00:00:00Z')
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: iana,
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).formatToParts(date)

  const h = parseInt(parts.find((p) => p.type === 'hour')?.value || '0')
  const m = parseInt(parts.find((p) => p.type === 'minute')?.value || '0')
  return h * 60 + m
}

function convert(
  senderIana: string,
  receiverIana: string,
  hours: number,
  minutes: number
): string {
  const senderOffset = getSenderUTCOffset(senderIana)
  const date = new Date('2024-06-15T00:00:00Z')
  date.setUTCMinutes(hours * 60 + minutes - senderOffset)

  return new Intl.DateTimeFormat('en-US', {
    timeZone: receiverIana,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date)
}

function isValidIANA(iana: string): boolean {
  try {
    // Test if the timezone is valid by using it with Intl API
    new Intl.DateTimeFormat('en-US', { timeZone: iana })
    return true
  } catch {
    return false
  }
}

export default function Receiver({ params }: PageProps) {
  const parts = params.zone
  const timeStr = parts.at(-1) || ''
  const senderIana = resolveIANA(parts.slice(0, -1).join('/'))

  const [receiverIana, setReceiverIana] = useState('')
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [errorMsg, setErrorMsg] = useState('')
  const [converted, setConverted] = useState('')
  const [senderNow, setSenderNow] = useState('')

  useEffect(() => {
    // Detect receiver timezone
    const iana = Intl.DateTimeFormat().resolvedOptions().timeZone
    setReceiverIana(iana)

    const fmt = (tz: string) =>
      new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(new Date())

    // Handle /now — show current time in both sender and receiver timezones
    if (timeStr.toLowerCase() === 'now') {
      const resolvedSender = senderIana || iana
      setSenderNow(fmt(resolvedSender))
      setConverted(fmt(iana))
      setState('ready')
      return
    }

    // Validate sender IANA (only needed for non-now links)
    if (!isValidIANA(senderIana)) {
      setErrorMsg('Invalid timezone in link.')
      setState('error')
      return
    }

    // Parse time
    const parsed = parseTime(timeStr)
    if (!parsed) {
      setErrorMsg('Invalid time in link.')
      setState('error')
      return
    }

    // Convert
    const result = convert(senderIana, iana, parsed.hours, parsed.minutes)
    setConverted(result)
    setState('ready')
  }, [senderIana, timeStr])

  const nav = (
    <nav className={styles.nav}>
      <Link href="/" className={styles.navLogo}>tz.me</Link>
      <Link href="/" className={styles.navCreate}>Create your own link →</Link>
    </nav>
  )

  if (state === 'loading') {
    return (
      <div className={styles.container}>
        {nav}
        <div className={styles.content}>
          <p className={styles.loading}>Converting...</p>
        </div>
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className={styles.container}>
        {nav}
        <div className={styles.content}>
          <p className={styles.error}>{errorMsg}</p>
          <Link href="/" className={styles.homeLink}>
            ← Go back
          </Link>
        </div>
      </div>
    )
  }

  const isNow = timeStr.toLowerCase() === 'now'

  return (
    <div className={styles.container}>
      {nav}
      <div className={styles.content}>
        <div className={styles.convertedTime}>{converted}</div>
        <p className={styles.yourTime}>your time · {receiverIana}</p>

        {isNow && senderIana && senderIana !== receiverIana && (
          <p className={styles.senderContext}>
            It&apos;s <strong>{senderNow}</strong> in {senderIana} right now
          </p>
        )}

        {!isNow && (
          <p className={styles.senderContext}>
            {timeStr} · {senderIana}
          </p>
        )}

        <Link href="/" className={styles.shareButton}>
          Share your own time →
        </Link>
      </div>
    </div>
  )
}
