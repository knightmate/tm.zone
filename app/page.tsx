'use client'

import { useState, useEffect, useRef } from 'react'
import styles from './page.module.css'

function formatTimeForUrl(value: string): string {
  const [h, m] = value.split(':').map(Number)
  const ampm = h >= 12 ? 'pm' : 'am'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return m === 0 ? `${h12}${ampm}` : `${h12}:${m.toString().padStart(2, '0')}${ampm}`
}

const EXAMPLES = [
  {
    label: 'City name',
    path: 'new_york/2pm',
    display: 'tym.zone/new_york/2pm',
    desc: '"Let\'s connect at 2pm my time" → everyone sees it in their timezone',
  },
  {
    label: 'Abbreviation',
    path: 'IST/9am',
    display: 'tym.zone/IST/9am',
    desc: 'Share 9am IST — no more "what\'s that in my time?" back-and-forth',
  },
  {
    label: 'IANA timezone',
    path: 'Europe/Berlin/4:45pm',
    display: 'tym.zone/Europe/Berlin/4:45pm',
    desc: 'Full IANA zone names work too',
  },
  {
    label: 'Current time',
    path: 'SF/now',
    display: 'tym.zone/SF/now',
    desc: 'Share what time it is right now for you',
  },
]

const ABBR_EXAMPLES = ['PST', 'IST', 'JST', 'GMT', 'EST', 'CET', 'AEST', 'MSK', 'PKT', 'BST']
const CITY_EXAMPLES = [
  'new_york', 'london', 'mumbai', 'tokyo', 'sydney',
  'dubai', 'paris', 'singapore', 'toronto', 'berlin',
  'seoul', 'bangkok', 'jakarta', 'cairo', 'lagos',
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
          <span className={styles.logo}>tym.zone</span>
          <div className={styles.navLinks}>
            <a href="#how-it-works">How it works</a>
            <a href="#formats">Formats</a>
            <a href="#supported">Supported</a>
          </div>
          <button className={styles.navCta} onClick={scrollToGenerator}>
            Create link
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.inner}>
          <span className={styles.badge}>· No signup. No app. Just a link.</span>

          <h1 className={styles.heroTitle}>
            Stop saying<br />
            <span className={styles.accent}>"what's that in my time?"</span>
          </h1>

          <p className={styles.heroSub}>
            Share a link. Everyone sees the time in <em>their own</em> timezone — instantly.
          </p>

          {/* Compelling example */}
          <div className={styles.exampleCard}>
            <p className={styles.exampleQuote}>
              "I'm in SF right now, do you want to meet at{' '}
              <a
                href={origin ? `${origin}/PST/4pm` : '/PST/4pm'}
                className={styles.exampleLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                4pm my time
              </a>
              ?"
            </p>
            <p className={styles.exampleHint}>
              When your colleague clicks the link, they see 4pm PST in <em>their</em> timezone. Try it →
            </p>
          </div>

          <div className={styles.ctas}>
            <button className={styles.ctaPrimary} onClick={scrollToGenerator}>
              Create my link
            </button>
            <a href="#formats" className={styles.ctaSecondary}>
              See formats
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
              { n: '01', title: 'Pick your time', desc: 'Type your city, abbreviation, or IANA timezone + a time in the URL.' },
              { n: '02', title: 'Share the link', desc: 'Paste it in Slack, email, calendar invite — anywhere. No login needed.' },
              { n: '03', title: 'They see their time', desc: 'Recipients instantly see the converted time in their own timezone.' },
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
      <section className={styles.section} id="formats">
        <div className={styles.inner}>
          <p className={styles.sectionLabel}>URL FORMATS</p>
          <h2 className={styles.formatsTitle}>Two things you can do</h2>

          <div className={styles.formatGroup}>
            <h3 className={styles.formatGroupTitle}>Share a time</h3>
            <p className={styles.formatGroupDesc}>Anyone who opens the link sees the time converted to their local timezone.</p>
            <div className={styles.formatsTable}>
              {EXAMPLES.map(({ path, display, desc, label }) => (
                <div key={path} className={styles.formatRow}>
                  <div className={styles.formatLeft}>
                    <span className={styles.formatBadge}>{label}</span>
                    <a
                      href={origin ? `${origin}/${path}` : `/${path}`}
                      className={styles.formatLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {display}
                    </a>
                  </div>
                  <span className={styles.formatDesc}>{desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.formatGroup} style={{ marginTop: '2rem' }}>
            <h3 className={styles.formatGroupTitle}>See current time</h3>
            <p className={styles.formatGroupDesc}>Use <code>/now</code> to share what time it is for you right now.</p>
            <div className={styles.formatsTable}>
              {[
                { path: 'IST/now', display: 'tym.zone/IST/now', desc: 'What time is it in India right now?' },
                { path: 'tokyo/now', display: 'tym.zone/tokyo/now', desc: 'Current time in Tokyo' },
              ].map(({ path, display, desc }) => (
                <div key={path} className={styles.formatRow}>
                  <a
                    href={origin ? `${origin}/${path}` : `/${path}`}
                    className={styles.formatLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {display}
                  </a>
                  <span className={styles.formatDesc}>{desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.timeFormats}>
            <p className={styles.timeFormatsLabel}>Supported time formats</p>
            <div className={styles.timeFormatChips}>
              {['3pm', '4:30am', '15:00', '1500', 'noon', 'midnight', 'now'].map(f => (
                <code key={f} className={styles.timeChip}>{f}</code>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Supported timezones ── */}
      <section className={styles.section} id="supported">
        <div className={styles.inner}>
          <p className={styles.sectionLabel}>SUPPORTED</p>
          <h2 className={styles.formatsTitle}>Abbreviations & cities — both work</h2>
          <p className={styles.heroSub} style={{ marginBottom: '2rem' }}>
            Powered by <strong>@knightmate/tzmap</strong> — no need to remember IANA names.
          </p>

          <div className={styles.supportGrid}>
            <div className={styles.supportCard}>
              <h3 className={styles.supportCardTitle}>Timezone Abbreviations</h3>
              <p className={styles.supportCardDesc}>Use any standard abbreviation directly in the URL.</p>
              <div className={styles.tagCloud}>
                {ABBR_EXAMPLES.map(a => (
                  <a key={a} href={origin ? `${origin}/${a}/3pm` : `/${a}/3pm`} className={styles.tag} target="_blank" rel="noopener noreferrer">
                    {a}
                  </a>
                ))}
                <span className={styles.tagMore}>+ many more</span>
              </div>
            </div>

            <div className={styles.supportCard}>
              <h3 className={styles.supportCardTitle}>150 Global Cities</h3>
              <p className={styles.supportCardDesc}>Use city names directly — no IANA knowledge needed.</p>
              <div className={styles.tagCloud}>
                {CITY_EXAMPLES.map(c => (
                  <a key={c} href={origin ? `${origin}/${c}/3pm` : `/${c}/3pm`} className={styles.tag} target="_blank" rel="noopener noreferrer">
                    {c}
                  </a>
                ))}
                <span className={styles.tagMore}>+ 130 more</span>
              </div>
            </div>
          </div>

          <p className={styles.ianaNote}>
            Full IANA names like <code>Europe/Berlin</code> or <code>America/New_York</code> also work.
          </p>
        </div>
      </section>

      {/* ── Generator ── */}
      <section className={styles.section} ref={generatorRef}>
        <div className={styles.inner}>
          <p className={styles.sectionLabel}>CREATE YOUR LINK</p>
          <h2 className={styles.formatsTitle}>Pick a time, get a link</h2>
          <p className={styles.heroSub} style={{ marginBottom: '1.5rem' }}>
            Your timezone is detected automatically.
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
          <span>tym.zone — timezone sharing, simplified</span>
          <span>Built for distributed teams</span>
        </div>
      </footer>

    </div>
  )
}
