# tz.me – Share time. Without timezone drama.

A minimal, client-side timezone converter web app. Share a link with your IANA timezone + time, receiver opens it → sees time in their timezone automatically. No backend, no database, no signup.

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
npm start
```

## File Structure

```
app/
  layout.tsx                ← Root layout
  globals.css               ← Dark theme styles
  page.tsx                  ← Composer (home page)
  page.module.css          ← Composer styles
  [...zone]/
    page.tsx               ← Receiver page
    receiver.module.css    ← Receiver styles
```

## How It Works

### Composer (tz.me/)
1. **Auto-detect** your IANA timezone through browser
2. **Pick a time** with the time picker
3. **Copy link** – gets generated automatically (e.g., `tz.me/Asia/Kolkata/4:30pm`)
4. **Share** anywhere

### Receiver (tz.me/Asia/Kolkata/4:30pm)
1. **Link opens** to receiver page
2. **Auto-detect** receiver's browser timezone
3. **Convert** sender's time to receiver's timezone
4. **Display** the converted time big and bold

**All processing is client-side** – no backend calls, no database, pure Intl API.

## URL Format

- `tz.me/` – Composer
- `tz.me/{IANA}/{TIME}` – Receiver
  - `tz.me/Asia/Kolkata/4pm` – 4:00 PM in Kolkata
  - `tz.me/America/New_York/9:30am` – 9:30 AM in New York
  - `tz.me/Europe/London/6:45pm` – 6:45 PM in London

## Features

✅ Auto timezone detection (browser-based)
✅ No backend – 100% client-side
✅ Full IANA timezone support
✅ Works in browser and terminal (`curl`)
✅ Copy-to-clipboard functionality
✅ Mobile responsive
✅ Dark theme (minimal, clean design)

## Deployment on Vercel

### Option 1: CLI

```bash
npm i -g vercel
vercel
```

### Option 2: GitHub + Vercel Dashboard

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import repository
4. Deploy (zero config needed)

### Custom Domain

Set custom domain in Vercel dashboard after deploy.

## Design

- **Colors**: Dark theme (#0f0f0f bg, #f0f0f0 text, #e8552a accent)
- **Typography**: system-ui fonts, responsive sizing
- **Layout**: Centered max-width 600px, mobile first
- **Interactions**: Copy button feedback, hover states

## V1 Scope

✅ IANA timezone URLs only
✅ Auto-detect sender & receiver timezone
✅ Client-side time conversion
✅ Copy link button
✅ Mobile responsive
❌ No analytics
❌ No city name lookup (v2)
❌ No accounts / database

## Edge Cases

- **DST handling**: Uses fixed date (2024-06-15) to calculate UTC offset, ensuring consistent results across all times of year
- **Invalid timezone**: "Invalid timezone in link." error
- **Invalid time**: "Invalid time in link." error
- **12am/12pm**: Correctly handles noon (12pm) and midnight (12am)

## Browser Support

- Chrome/Edge: ✓ Full support
- Firefox: ✓ Full support
- Safari: ✓ Full support (iOS 15+)
- All modern browsers with Intl API support

## License

MIT
