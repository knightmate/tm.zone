'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './receiver.module.css'
import { getUtcZones } from '@knightmate/tzmap'

interface PageProps {
  params: { zone: string[] }
}

// ── Timezone resolution ──────────────────────────────────────────────
function resolveIANA(raw: string): string {
  const key = raw.toUpperCase().replace(/[\s\-_]/g, '')
  if (key === 'UTC') return 'UTC'
  const zones = getUtcZones(key)
  return zones.length > 0 ? zones[0] : raw
}

function isValidIANA(iana: string): boolean {
  try { new Intl.DateTimeFormat('en-US', { timeZone: iana }); return true }
  catch { return false }
}

// ── Time parsing ─────────────────────────────────────────────────────
function parseTime(t: string): { hours: number; minutes: number } | null {
  if (t.toLowerCase() === 'noon')     return { hours: 12, minutes: 0 }
  if (t.toLowerCase() === 'midnight') return { hours: 0,  minutes: 0 }
  const ampm = t.match(/^(\d{1,2})(?::(\d{2}))?(am|pm)$/i)
  if (ampm) {
    let h = parseInt(ampm[1])
    const m = parseInt(ampm[2] || '0')
    const p = ampm[3].toLowerCase()
    if (p === 'pm' && h !== 12) h += 12
    if (p === 'am' && h === 12) h = 0
    if (h > 23 || m > 59) return null
    return { hours: h, minutes: m }
  }
  const compact = t.match(/^(\d{3,4})$/)
  if (compact) {
    const n = parseInt(compact[1])
    const h = Math.floor(n / 100), m = n % 100
    if (h > 23 || m > 59) return null
    return { hours: h, minutes: m }
  }
  const colon = t.match(/^(\d{1,2}):(\d{2})$/)
  if (colon) {
    const h = parseInt(colon[1]), m = parseInt(colon[2])
    if (h > 23 || m > 59) return null
    return { hours: h, minutes: m }
  }
  return null
}

// ── Intl helpers ─────────────────────────────────────────────────────
function getOffsetMinutes(iana: string, date: Date): number {
  const str = new Intl.DateTimeFormat('en-US', { timeZone: iana, timeZoneName: 'longOffset' })
    .formatToParts(date).find(p => p.type === 'timeZoneName')?.value || 'GMT+0:00'
  const m = str.match(/GMT([+-])(\d+):(\d+)/)
  if (!m) return 0
  return (m[1] === '+' ? 1 : -1) * (parseInt(m[2]) * 60 + parseInt(m[3]))
}

function getTzAbbr(iana: string, date: Date): string {
  return new Intl.DateTimeFormat('en-US', { timeZone: iana, timeZoneName: 'short' })
    .formatToParts(date).find(p => p.type === 'timeZoneName')?.value || ''
}

function getUtcOffsetStr(iana: string, date: Date): string {
  const str = new Intl.DateTimeFormat('en-US', { timeZone: iana, timeZoneName: 'longOffset' })
    .formatToParts(date).find(p => p.type === 'timeZoneName')?.value || 'GMT'
  return str.replace('GMT', 'UTC')
}

function formatTime12(iana: string, date: Date): string {
  return new Intl.DateTimeFormat('en-US', { timeZone: iana, hour: 'numeric', minute: '2-digit', hour12: true }).format(date)
}

function formatDateLong(iana: string, date: Date): string {
  return new Intl.DateTimeFormat('en-US', { timeZone: iana, weekday: 'long', month: 'short', day: 'numeric' }).format(date)
}

function getDayName(iana: string, date: Date): string {
  return new Intl.DateTimeFormat('en-US', { timeZone: iana, weekday: 'long' }).format(date)
}

function getHour(iana: string, date: Date): number {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: iana, hour: 'numeric', hour12: false }).formatToParts(date)
  return parseInt(parts.find(p => p.type === 'hour')?.value || '0') % 24
}

function cityFromIANA(iana: string): string {
  if (iana === 'UTC') return 'UTC'
  const city = iana.includes('/') ? iana.split('/').pop()! : iana
  return city.replace(/_/g, ' ')
}

// Build a Date object for sender's specified time on today's date
function buildTargetDate(senderIana: string, hours: number, minutes: number): Date {
  const now = new Date()
  const todayStr = new Intl.DateTimeFormat('en-CA', {
    timeZone: senderIana, year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(now)
  const [y, mo, d] = todayStr.split('-').map(Number)
  const noonRef = new Date(Date.UTC(y, mo - 1, d, 12, 0, 0))
  const offset = getOffsetMinutes(senderIana, noonRef)
  return new Date(Date.UTC(y, mo - 1, d, hours, minutes, 0) - offset * 60000)
}

function getDayDiff(senderIana: string, receiverIana: string, date: Date): number {
  const fmt = (tz: string) => new Intl.DateTimeFormat('en-CA', {
    timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(date)
  const a = new Date(fmt(senderIana)).getTime()
  const b = new Date(fmt(receiverIana)).getTime()
  return Math.round((b - a) / 86400000)
}

function formatOffsetDiff(diffMin: number): string {
  const abs = Math.abs(diffMin)
  const h = Math.floor(abs / 60), m = abs % 60
  const parts: string[] = []
  if (h) parts.push(`${h} hour${h !== 1 ? 's' : ''}`)
  if (m) parts.push(`${m} minute${m !== 1 ? 's' : ''}`)
  return parts.join(' ') || 'the same time'
}

function getContext(hour: number, senderTime: string, receiverCity: string): { emoji: string; bold: string; rest: string } {
  if (hour < 5)  return { emoji: '🌙', bold: 'This is the middle of the night for you.', rest: ` Their ${senderTime} is the early hours in ${receiverCity} — you'd likely be asleep.` }
  if (hour < 7)  return { emoji: '🌅', bold: 'This is very early morning for you.', rest: ' An early start if you need to connect!' }
  if (hour < 9)  return { emoji: '☀️', bold: 'This is early morning for you.', rest: ' A reasonable time to connect.' }
  if (hour < 12) return { emoji: '💼', bold: 'This is your morning.', rest: ' A great time to connect!' }
  if (hour < 14) return { emoji: '🍽️', bold: 'Around lunchtime for you.', rest: ' Might be a good break for a call.' }
  if (hour < 17) return { emoji: '💼', bold: 'This is your afternoon.', rest: ' A good time to connect!' }
  if (hour < 20) return { emoji: '🌆', bold: 'This is your evening.', rest: ` You'd be winding down in ${receiverCity}.` }
  return { emoji: '🌙', bold: 'This is late evening for you.', rest: ` Their ${senderTime} falls late at night in ${receiverCity}.` }
}

interface TimeData {
  senderCity: string; senderAbbr: string; senderOffset: string
  senderTime: string; senderDate: string; senderDayName: string
  receiverCity: string; receiverAbbr: string; receiverOffset: string
  receiverTime: string; receiverDate: string; receiverDayName: string
  dayDiff: number; offsetDiffMin: number; receiverHour: number
}

export default function Receiver({ params }: PageProps) {
  const parts = params.zone.map(p => p.split('?')[0]).filter(Boolean)
  const timeStr = parts.at(-1) || ''
  const senderIana = resolveIANA(parts.slice(0, -1).join('/'))
  const isNow = timeStr.toLowerCase() === 'now'

  const [data, setData] = useState<TimeData | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const receiverIana = Intl.DateTimeFormat().resolvedOptions().timeZone
    const now = new Date()

    if (isNow) {
      const s = isValidIANA(senderIana) ? senderIana : receiverIana
      setData({
        senderCity: cityFromIANA(s), senderAbbr: getTzAbbr(s, now),
        senderOffset: getUtcOffsetStr(s, now), senderTime: formatTime12(s, now),
        senderDate: formatDateLong(s, now), senderDayName: getDayName(s, now),
        receiverCity: cityFromIANA(receiverIana), receiverAbbr: getTzAbbr(receiverIana, now),
        receiverOffset: getUtcOffsetStr(receiverIana, now), receiverTime: formatTime12(receiverIana, now),
        receiverDate: formatDateLong(receiverIana, now), receiverDayName: getDayName(receiverIana, now),
        dayDiff: getDayDiff(s, receiverIana, now),
        offsetDiffMin: getOffsetMinutes(receiverIana, now) - getOffsetMinutes(s, now),
        receiverHour: getHour(receiverIana, now),
      })
      return
    }

    if (!isValidIANA(senderIana)) { setError('Invalid timezone in link.'); return }
    const parsed = parseTime(timeStr)
    if (!parsed) { setError('Invalid time in link.'); return }

    const target = buildTargetDate(senderIana, parsed.hours, parsed.minutes)
    setData({
      senderCity: cityFromIANA(senderIana), senderAbbr: getTzAbbr(senderIana, target),
      senderOffset: getUtcOffsetStr(senderIana, target), senderTime: formatTime12(senderIana, target),
      senderDate: formatDateLong(senderIana, target), senderDayName: getDayName(senderIana, target),
      receiverCity: cityFromIANA(receiverIana), receiverAbbr: getTzAbbr(receiverIana, target),
      receiverOffset: getUtcOffsetStr(receiverIana, target), receiverTime: formatTime12(receiverIana, target),
      receiverDate: formatDateLong(receiverIana, target), receiverDayName: getDayName(receiverIana, target),
      dayDiff: getDayDiff(senderIana, receiverIana, target),
      offsetDiffMin: getOffsetMinutes(receiverIana, target) - getOffsetMinutes(senderIana, target),
      receiverHour: getHour(receiverIana, target),
    })
  }, [senderIana, timeStr, isNow])

  const nav = (
    <nav className={styles.nav}>
      <Link href="/" className={styles.navLogo}>tym.zone</Link>
      <Link href="/" className={styles.navCreate}>Create your own link →</Link>
    </nav>
  )

  if (error) return (
    <div className={styles.page}>
      {nav}
      <div className={styles.centered}>
        <p className={styles.error}>{error}</p>
        <Link href="/" className={styles.homeLink}>← Go back</Link>
      </div>
    </div>
  )

  if (!data) return (
    <div className={styles.page}>
      {nav}
      <div className={styles.centered}>
        <p className={styles.loading}>Converting…</p>
      </div>
    </div>
  )

  const ctx = getContext(data.receiverHour, data.senderTime, data.receiverCity)
  const diffStr = formatOffsetDiff(Math.abs(data.offsetDiffMin))
  const ahead = data.offsetDiffMin >= 0

  return (
    <div className={styles.page}>
      {nav}

      <div className={styles.card}>
        {/* ── Hero: YOUR converted time ── */}
        <div className={styles.heroBlock}>
          <p className={styles.heroLabel}>For you, that&apos;s</p>
          <p className={styles.heroTime}>{data.receiverTime}</p>
          <div className={styles.heroMeta}>
            <span className={styles.heroBadge}>{data.receiverCity}</span>
            <span className={styles.heroTz}>{data.receiverAbbr} · {data.receiverOffset}</span>
          </div>
          {data.dayDiff !== 0 && (
            <p className={styles.dayBadge}>{data.dayDiff > 0 ? '+1 day' : '−1 day'} · {data.receiverDayName}</p>
          )}
          {data.dayDiff === 0 && (
            <p className={styles.heroDate}>{data.receiverDate}</p>
          )}
        </div>

        {/* ── Divider ── */}
        <div className={styles.divider}>
          <div className={styles.dividerLine} />
          <span className={styles.dividerLabel}>converted from</span>
          <div className={styles.dividerLine} />
        </div>

        {/* ── Their time (secondary) ── */}
        <div className={styles.timeBlock}>
          <div>
            <p className={styles.timeLabel}>Their Time</p>
            <p className={styles.timeCity}>{data.senderCity}</p>
            <p className={styles.timeMeta}>{data.senderAbbr} · {data.senderOffset}</p>
          </div>
          <div className={styles.timeRight}>
            <p className={`${styles.timeBig} ${styles.timeSender}`}>{data.senderTime}</p>
            <p className={styles.timeDate}>{data.senderDate}</p>
          </div>
        </div>

        {/* ── Context ── */}
        <div className={styles.contextBox}>
          <span className={styles.contextEmoji}>{ctx.emoji}</span>
          <p className={styles.contextText}>
            <strong>{ctx.bold}</strong>{ctx.rest}
          </p>
        </div>

        {/* ── Buttons ── */}
        <div className={styles.buttons}>
          <Link href="/" className={styles.btnPrimary}>Share my own time →</Link>
          <Link href="/" className={styles.btnSecondary}>Find another time</Link>
        </div>
      </div>

      <p className={styles.footer}>
        {data.receiverCity} is <strong>{diffStr} {ahead ? 'ahead' : 'behind'}</strong> of {data.senderCity}
      </p>
    </div>
  )
}
