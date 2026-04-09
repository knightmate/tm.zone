'use client'

import { useState, useEffect } from 'react'
import styles from './page.module.css'

function formatTimeForUrl(value: string): string {
  const [h, m] = value.split(':').map(Number)
  const ampm = h >= 12 ? 'pm' : 'am'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return m === 0 ? `${h12}${ampm}` : `${h12}:${m.toString().padStart(2, '0')}${ampm}`
}

export default function Composer() {
  const [time, setTime] = useState('12:00')
  const [senderIana, setSenderIana] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const iana = Intl.DateTimeFormat().resolvedOptions().timeZone
    setSenderIana(iana)
  }, [])

  const link = senderIana ? `https://tz.me/${senderIana}/${formatTimeForUrl(time)}` : ''

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>tz.me</h1>
        <p className={styles.tagline}>Share time. Without timezone drama.</p>
      </header>

      <div className={styles.composer}>
        <div className={styles.pickerGroup}>
          <label htmlFor="time">Pick a time</label>
          <input
            id="time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
          {senderIana && (
            <p className={styles.detected}>
              Detected: <strong>{senderIana}</strong>
            </p>
          )}
        </div>

        {link && (
          <div className={styles.linkBox}>
            <div className={styles.linkContent}>
              <code className={styles.link}>{link}</code>
              <button
                onClick={handleCopy}
                className={styles.copyBtn}
                title="Copy to clipboard"
              >
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}

        <div className={styles.howItWorks}>
          <h2>How it works</h2>
          <ol>
            <li>
              <strong>Pick your time</strong> → link auto-generates with your timezone
            </li>
            <li>
              <strong>Copy and share</strong> anywhere (Slack, WhatsApp, email)
            </li>
            <li>             
              <strong>Receiver clicks</strong> → sees time in their timezone instantly
            </li>
          </ol>
        </div>

        <div className={styles.features}>
          <h3>V1 Features</h3>
          <ul>
            <li>✓ Auto timezone detection</li>
            <li>✓ Works in browser and terminal (curl)</li>
            <li>✓ Zero signup, zero tracking</li>
            <li>✓ Full IANA timezone support</li>
          </ul>
        </div>

        <div className={styles.examples}>
          <h2>Examples</h2>
          <p className={styles.examplesSubtitle}>Click any link to see it in action</p>
          <ul>
            <li>
              <a href="https://tz.me/America/New_York/3pm" target="_blank" rel="noopener noreferrer">
                tz.me/America/New_York/3pm
              </a>
              <span>3 PM New York → your local time</span>
            </li>
            <li>
              <a href="https://tz.me/Europe/London/9am" target="_blank" rel="noopener noreferrer">
                tz.me/Europe/London/9am
              </a>
              <span>9 AM London → your local time</span>
            </li>
            <li>
              <a href="https://tz.me/Asia/Tokyo/10:30am" target="_blank" rel="noopener noreferrer">
                tz.me/Asia/Tokyo/10:30am
              </a>
              <span>10:30 AM Tokyo → your local time</span>
            </li>
            <li>
              <a href="https://tz.me/US/Pacific/now" target="_blank" rel="noopener noreferrer">
                tz.me/US/Pacific/now
              </a>
              <span>Current time in Pacific → your local time</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
