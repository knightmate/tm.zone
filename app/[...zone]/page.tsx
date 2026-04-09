'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './receiver.module.css'

interface PageProps {
  params: {
    zone: string[]
  }
}

function parseTime(t: string): { hours: number; minutes: number } {
  const match = t.match(/^(\d{1,2})(?::(\d{2}))?(am|pm)$/i)
  if (!match) return { hours: 0, minutes: 0 }

  let hours = parseInt(match[1])
  const minutes = parseInt(match[2] || '0')
  const ampm = match[3].toLowerCase()

  if (ampm === 'pm' && hours !== 12) hours += 12
  if (ampm === 'am' && hours === 12) hours = 0

  return { hours, minutes }
}

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
  const senderIana = parts.slice(0, -1).join('/')

  const [receiverIana, setReceiverIana] = useState('')
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [errorMsg, setErrorMsg] = useState('')
  const [converted, setConverted] = useState('')

  useEffect(() => {
    // Detect receiver timezone
    const iana = Intl.DateTimeFormat().resolvedOptions().timeZone
    setReceiverIana(iana)

    // Validate sender IANA
    if (!isValidIANA(senderIana)) {
      setErrorMsg('Invalid timezone in link.')
      setState('error')
      return
    }

    // Parse time
    const { hours, minutes } = parseTime(timeStr)
    if (hours === 0 && minutes === 0 && timeStr !== '12am') {
      setErrorMsg('Invalid time in link.')
      setState('error')
      return
    }

    // Convert
    const result = convert(senderIana, iana, hours, minutes)
    setConverted(result)
    setState('ready')
  }, [senderIana, timeStr])

  if (state === 'loading') {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <p className={styles.loading}>Converting...</p>
        </div>
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <p className={styles.error}>{errorMsg}</p>
          <Link href="/" className={styles.homeLink}>
            ← Go back
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.convertedTime}>{converted}</div>
        <p className={styles.yourTime}>your time</p>
        <p className={styles.senderContext}>
          {timeStr} · {senderIana}
        </p>

        <Link href="/" className={styles.shareButton}>
          Share your own time →
        </Link>
      </div>
    </div>
  )
}
