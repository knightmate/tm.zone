'use client'

import { useState, useEffect, useRef } from 'react'
import styles from './page.module.css'

function formatTimeForUrl(value: string): string {
  const [h, m] = value.split(':').map(Number)
  const ampm = h >= 12 ? 'pm' : 'am'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return m === 0 ? `${h12}${ampm}` : `${h12}:${m.toString().padStart(2, '0')}${ampm}`
}

const DEMO_CHIPS = [
  { flag: '🇮🇳', label: 'IST', time: '5:30 AM' },
  { flag: '🇬🇧', label: 'GMT', time: '12:00 AM' },
  { flag: '🇯🇵', label: 'JST', time: '9:00 AM' },
  { flag: '🇺🇸', label: 'EST', time: '7:00 PM' },
]

const URL_FORMATS = [
  { path: 'pst/4pm',      desc: 'Shorthand timezone + time' },
  { path: 'mumbai/9am',   desc: 'City name as timezone' },
  { path: 'utc+5:30/3pm', desc: 'UTC offset format' },
  { path: 'london/noon',  desc: 'Natural language time' },
]

export default function Home() {
  const [time, setTime] = useState('12:00')
  const [senderIana, setSenderIana] = useState('')
  const [copied, setCopied] = useState(false)
  const [origin, setOrigin] = useState('')
  const generatorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSenderIana(Intl.DateTimeFormat().resolvedOptions().timeZone)
    setOrigin(window.location.origin)
  }, [])

  const link = senderIana && origin
    ? `${origin}/${senderIana}/${formatTimeForUrl(time)}`
    : ''

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const scrollToGenerator = () => {
    generatorRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className={styles.page}>

      {/* ── Navbar ── */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <span className={styles.logo}>tz.me</span>
          <div className={styles.navLinks}>
            <a href="#how-it-works">How it works</a>
            <a href="#examples">Examples</a>
          </div>
          <button className={styles.navCta} onClick={scrollToGenerator}>
            Try it free
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.inner}>
          <span className={styles.badge}>· No signup. No app. Just a link.</span>

          <h1 className={styles.heroTitle}>
            Share your time,<br />
            not the <span className={styles.accent}>confusion</span>.
          </h1>

          <p className={styles.heroSub}>
            Send a single link and everyone sees the meeting time<br />
            in <em>their own</em> timezone — automatically.
          </p>

          {/* Demo card */}
          <div className={styles.demoCard}>
            <div className={styles.demoTop}>
              <p className={styles.demoLabel}>YOU SHARE THIS LINK</p>
              <p className={styles.demoUrl}>
                tz.me/<strong>pst/4pm</strong>
              </p>
            </div>
            <div className={styles.demoDivider} />
            <div className={styles.demoBottom}>
              <div className={styles.demoClockRow}>
                <span className={styles.demoClock}>🕐</span>
                <span className={styles.demoBottomLabel}>Everyone sees it in their local time</span>
              </div>
              <div className={styles.chips}>
                {DEMO_CHIPS.map(({ flag, label, time }) => (
                  <span key={label} className={styles.chip}>
                    {flag} {label} <strong>{time}</strong>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className={styles.ctas}>
            <button className={styles.ctaPrimary} onClick={scrollToGenerator}>
              Create my link
            </button>
            <a href="#examples" className={styles.ctaSecondary}>
              See examples
            </a>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className={styles.section} id="how-it-works">
        <div className={styles.inner}>
          <p className={styles.sectionLabel}>HOW IT WORKS</p>
          <div className={styles.steps}>
            {[
              { n: '01', title: 'Pick your time', desc: 'Type your timezone and time directly in the URL. That\'s it.' },
              { n: '02', title: 'Share the link', desc: 'Paste it in Slack, email, or anywhere. No login required.' },
              { n: '03', title: 'They see their time', desc: 'Recipients instantly see the converted time in their timezone.' },
            ].map(({ n, title, desc }) => (
              <div key={n} className={styles.stepCard}>
                <span className={styles.stepNum}>{n}</span>
                <h3 className={styles.stepTitle}>{title}</h3>
                <p className={styles.stepDesc}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── URL Formats ── */}
      <section className={styles.section} id="examples">
        <div className={styles.inner}>
          <h2 className={styles.formatsTitle}>URL formats that just work</h2>
          <div className={styles.formatsTable}>
            {URL_FORMATS.map(({ path, desc }) => (
              <div key={path} className={styles.formatRow}>
                <a
                  href={origin ? `${origin}/${path}` : `/${path}`}
                  className={styles.formatLink}
                >
                  tz.me/{path}
                </a>
                <span className={styles.formatDesc}>{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Generator ── */}
      <section className={styles.section} ref={generatorRef}>
        <div className={styles.inner}>
          <h2 className={styles.formatsTitle}>Create your link</h2>
          <p className={styles.heroSub} style={{ marginBottom: '1.5rem' }}>
            Pick a time — your link generates instantly.
          </p>

          <div className={styles.generator}>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={styles.timePicker}
            />
            {senderIana && (
              <p className={styles.detectedTz}>
                Your timezone: <strong>{senderIana}</strong>
              </p>
            )}
            {link && (
              <div className={styles.linkRow}>
                <code className={styles.generatedLink}>{link}</code>
                <button className={styles.copyBtn} onClick={handleCopy}>
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <div className={styles.inner}>
          <span>tz.me — timezone sharing, simplified</span>
          <span>Built with ❤️ for distributed teams</span>
        </div>
      </footer>

    </div>
  )
}
